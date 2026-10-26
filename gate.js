/* Access gate: the welcome section is open, the rest needs approval.
   Visitors request access (name, email, reason). Sandeep approves by email and the visitor receives a personal link.
   This is a courtesy gate, not security: the page content is still delivered to the browser. */
(function () {
  var HASH = "90c0af481025609087947279459d38a17e727e89a65fa9ff4de5100bcb61beb1", KEY = "skAccess", MAIL = "sandeepkumark1028@gmail.com";
  // Google Apps Script web app that handles approvals (see access-backend/SETUP.md). Leave empty to use plain email requests.
  var API = "https://script.google.com/macros/s/AKfycbxvzltz27ZWsSmYW_Jh1FRdd0O3hC6r9gC0PIZX-kMcrW69BdLTReARmCh7OSH_BcpGPg/exec";

  // fetch that gives up after a while instead of hanging forever
  function tfetch(url, opts, ms) {
    var c = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (c) c.abort(); }, ms || 12000);
    opts = opts || {}; if (c) opts.signal = c.signal;
    var race = new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, (ms || 12000) + 500); });
    return Promise.race([fetch(url, opts), race]).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; });
  }
  window.skSend = function (p) {
    if (API) {
      return tfetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "message", name: p.name, email: p.email, subject: p.subject, message: p.message, website: "" }) }, 20000)
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.ok) return true;
          var er = new Error((j && j.error) || "rejected");
          if (j && j.error && j.error !== "Unknown action.") er.userMessage = j.error;   // an old script does not know "message" yet
          throw er;
        })
        .catch(function (err) { try { console.warn("[contact form] could not send:", err && err.message); } catch (x) {} throw err; });
    }
    return tfetch("https://formsubmit.co/ajax/" + MAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: p.name, email: p.email, _subject: p.subject, message: p.message, _template: "table", _captcha: "false", _honey: "" }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { if (j && (j.success === true || j.success === "true")) return true; throw new Error((j && j.message) || "send failed"); })
      .catch(function (err) { try { console.warn("[access form] could not send:", err && err.message); } catch (x) {} throw err; });
  };
  function verify(token) {
    return tfetch(API + "?action=verify&token=" + encodeURIComponent(token), {}, 10000).then(function (r) { return r.json(); });
  }

  var root = document.documentElement, store = null;
  try { store = window.localStorage; } catch (e) {}
  function get() { try { return store && store.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { store && store.setItem(KEY, v); } catch (e) {} }
  function clear() { try { store && store.removeItem(KEY); } catch (e) {} }
  function param() { try { return new URLSearchParams(location.search).get("access"); } catch (e) { return null; } }
  function stripParam() { try { var u = new URL(location.href); u.searchParams.delete("access"); history.replaceState(null, "", u.pathname + (u.search || "") + u.hash); } catch (e) {} }
  var saved = get(), viaLink = !!(API && saved && saved.indexOf("tok:") === 0);
  var unlocked = saved === HASH || viaLink;

  if (unlocked) {
    if (param()) stripParam();
    // Approved links can be revoked or expire, so quietly re-check them.
    if (viaLink) verify(saved.slice(4)).then(function (j) { if (j && j.ok === false) { clear(); location.reload(); } }).catch(function () {});
    return;
  }

  root.classList.add("sk-locked");
  var css = document.createElement("style");
  css.textContent = [
    "html.sk-locked main, html.sk-locked body > footer { display: none !important; }",
    ".skg { position: relative; isolation: isolate; min-height: 100vh; min-height: 100svh; display: grid; place-items: center; padding: 110px 20px; overflow: hidden; background: var(--bg, #0e0e10); color: var(--text, #f5efe8); font-family: var(--body, system-ui, sans-serif); }",
    ".skg::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: var(--a1, #f59e0b); opacity: .08; -webkit-mask-image: var(--pcb), linear-gradient(180deg, transparent 0, #000 260px); mask-image: var(--pcb), linear-gradient(180deg, transparent 0, #000 260px); -webkit-mask-size: 240px 240px, 100% 100%; mask-size: 240px 240px, 100% 100%; -webkit-mask-repeat: repeat, no-repeat; mask-repeat: repeat, no-repeat; -webkit-mask-composite: source-in; mask-composite: intersect; }",
    ".skg::after { content: ''; position: absolute; left: 50%; top: 45%; width: 900px; height: 900px; margin: -450px 0 0 -450px; z-index: -1; pointer-events: none; background: radial-gradient(circle, color-mix(in srgb, var(--a1, #f59e0b) 15%, transparent), transparent 62%); }",
    ".skg-c { width: min(100%, 640px); padding: clamp(26px, 5vw, 46px); border-radius: 28px; background: var(--surface, #1a1a1e); border: 1px solid var(--line, #2e2a26); box-shadow: 0 40px 90px -40px #000; animation: skgin .9s var(--ease, ease) both; }",
    "@keyframes skgin { from { opacity: 0; transform: translateY(34px) scale(.97); } }",
    ".skg-k { display: inline-flex; align-items: center; gap: 10px; font: 500 12px/1 var(--mono, monospace); letter-spacing: .18em; text-transform: uppercase; color: var(--a1, #f59e0b); }",
    ".skg-k i { width: 9px; height: 9px; border-radius: 50%; background: var(--a1, #f59e0b); box-shadow: 0 0 14px var(--a1, #f59e0b); }",
    ".skg h2 { margin: 18px 0 12px; font: 800 clamp(28px, 4.6vw, 42px)/1.05 var(--display, system-ui); letter-spacing: -.035em; text-wrap: balance; }",
    ".skg p { margin: 0 0 22px; color: var(--text-2, #b8aea2); font-size: 17px; line-height: 1.6; }",
    ".skg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }",
    ".skg input, .skg textarea { width: 100%; font: 500 16px/1.5 var(--body, system-ui); color: inherit; background: var(--bg, #0e0e10); border: 1px solid var(--line, #2e2a26); border-radius: 14px; padding: 15px 16px; transition: border-color .3s, box-shadow .3s; }",
    ".skg textarea { min-height: 112px; resize: vertical; margin-bottom: 14px; display: block; }",
    ".skg input:focus, .skg textarea:focus { outline: none; border-color: var(--a1, #f59e0b); box-shadow: 0 0 0 3px color-mix(in srgb, var(--a1, #f59e0b) 22%, transparent); }",
    ".skg input::placeholder, .skg textarea::placeholder { color: var(--text-3, #7d7469); }",
    ".skg .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }",
    ".skg-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; height: 52px; padding: 0 26px; border-radius: 999px; border: 1px solid var(--text, #f5efe8); background: var(--text, #f5efe8); color: var(--bg, #0e0e10); font: 700 15px/1 var(--body, system-ui); cursor: pointer; transition: transform .35s var(--ease, ease), background .3s, color .3s, opacity .3s; }",
    ".skg-btn:hover { background: var(--a1, #f59e0b); border-color: var(--a1, #f59e0b); color: var(--on-accent, #140c02); transform: translateY(-2px); }",
    ".skg-btn:disabled { opacity: .6; cursor: default; transform: none; }",
    ".skg-btn.ghost { background: transparent; color: var(--text, #f5efe8); border-color: var(--line, #2e2a26); }",
    ".skg-btn.ghost:hover { border-color: var(--a1, #f59e0b); color: var(--a1, #f59e0b); background: transparent; }",
    ".skg-or { display: flex; align-items: center; gap: 14px; margin: 28px 0 22px; font: 500 11px/1 var(--mono, monospace); letter-spacing: .2em; text-transform: uppercase; color: var(--text-3, #7d7469); }",
    ".skg-or::before, .skg-or::after { content: ''; flex: 1; height: 1px; background: var(--line, #2e2a26); }",
    ".skg-code { display: flex; gap: 12px; }",
    ".skg-code input { flex: 1; text-transform: uppercase; letter-spacing: .12em; font-family: var(--mono, monospace); }",
    ".skg-m { min-height: 22px; margin: 14px 0 0 !important; font-size: 14px !important; line-height: 1.5; color: var(--text-2, #b8aea2); }",
    ".skg-m a { color: var(--a1, #f59e0b); text-decoration: underline; }",
    ".skg-m.err { color: #f0716f; } .skg-m.ok { color: #4ade80; }",
    ".skg-f { margin-top: 22px; padding-top: 18px; border-top: 1px dashed var(--line, #2e2a26); display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 14px; color: var(--text-3, #7d7469); }",
    ".skg-f a { color: var(--text-2, #b8aea2); } .skg-f a:hover { color: var(--a1, #f59e0b); }",
    ".skg.out { animation: skgout .55s var(--ease, ease) forwards; }",
    "@keyframes skgout { to { opacity: 0; transform: translateY(-30px); } }",
    "@media (max-width: 520px) { .skg-row { grid-template-columns: 1fr; } .skg-code { flex-direction: column; } .skg-btn { width: 100%; } }"
  ].join("\n");
  document.head.appendChild(css);

  function norm(v) { return String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^SK/, ""); }
  function sha(t) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject(new Error("nocrypto"));
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
  }
  function build() {
    var g = document.createElement("section"); g.className = "skg"; g.id = "access"; g.setAttribute("aria-label", "Access required");
    g.innerHTML = '<div class="skg-c"><span class="skg-k"><i></i>Access required</span><h2>Request access to view the rest of the portfolio</h2><p>The welcome page is open to everyone. My experience, projects and contact details are shared on request. Tell me who you are and why you would like access. I review each request and email you a personal access link.</p>' +
      '<form id="skg-req" novalidate><div class="skg-row"><input id="skg-n" name="name" placeholder="Your name" autocomplete="name" aria-label="Your name"><input id="skg-e" name="email" type="email" placeholder="Your email" autocomplete="email" aria-label="Your email"></div>' +
      '<textarea id="skg-r" name="reason" placeholder="Why would you like access? (for example: a recruiter hiring for an embedded role)" aria-label="Why would you like access"></textarea><input class="hp" id="skg-w" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="skg-btn" type="submit">Request access <span aria-hidden="true">→</span></button></form>' +
      '<div class="skg-or">Already have a code</div><form class="skg-code" id="skg-go" novalidate><input id="skg-c" placeholder="SK-XXXXX-XXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Access code"><button class="skg-btn ghost" type="submit">Unlock</button></form>' +
      '<p class="skg-m" id="skg-m" role="status"></p><div class="skg-f"><a href="mailto:' + MAIL + '">' + MAIL + '</a><a href="https://www.linkedin.com/in/sandeep-kumar-k" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/sandeepkumark1028" target="_blank" rel="noopener">GitHub</a></div></div>';
    var main = document.querySelector("main"); main.parentNode.insertBefore(g, main);
    var m = g.querySelector("#skg-m");
    function say(t, c) { m.className = "skg-m" + (c ? " " + c : ""); m.textContent = t; }
    function grant(val) {
      set(val); say("Access granted. Welcome!", "ok"); g.classList.add("out");
      setTimeout(function () {
        root.classList.remove("sk-locked"); g.remove();
        window.dispatchEvent(new Event("resize"));
        var t = document.querySelector("main #about, main.pg") || document.querySelector("main");
        if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "start" });
        window.dispatchEvent(new Event("scroll"));
      }, 560);
    }
    function fail() { m.className = "skg-m err"; m.innerHTML = 'Sorry, I could not send that automatically. Please email me directly at <a href="mailto:' + MAIL + '?subject=' + encodeURIComponent("Portfolio access request") + '">' + MAIL + '</a>.'; }

    g.querySelector("#skg-req").addEventListener("submit", function (e) {
      e.preventDefault();
      var n = g.querySelector("#skg-n").value.trim(), em = g.querySelector("#skg-e").value.trim(), why = g.querySelector("#skg-r").value.trim(), btn = e.target.querySelector("button");
      if (!n) { say("Please enter your name.", "err"); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { say("Please enter a valid email address.", "err"); return; }
      if (why.length < 10) { say("Please tell me a little about why you would like access.", "err"); return; }
      var label = btn.innerHTML; btn.disabled = true; btn.textContent = "Sending…"; say("");
      function done() {
        say("Request sent. Thank you, " + n + "! Once I approve it, a personal access link will be emailed to " + em + ".", "ok");
        ["#skg-n", "#skg-e", "#skg-r"].forEach(function (s) { g.querySelector(s).value = ""; }); btn.textContent = "Request sent ✓";
        setTimeout(function () { btn.disabled = false; btn.innerHTML = label; }, 5000);
      }
      function bad(err) { btn.disabled = false; btn.innerHTML = label; if (err && err.userMessage) say(err.userMessage, "err"); else fail(); }
      if (API) {
        tfetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "request", name: n, email: em, reason: why, website: g.querySelector("#skg-w").value }) }, 20000)
          .then(function (r) { return r.json(); })
          .then(function (j) { if (j && j.ok) done(); else { var er = new Error("rejected"); er.userMessage = j && j.error; throw er; } })
          .catch(bad);
      } else {
        window.skSend({ name: n, email: em, subject: "Portfolio access request from " + n, message: "Hello Sandeep,\n\nI would like access to your portfolio.\n\nName: " + n + "\nEmail: " + em + "\n\nWhy I would like access:\n" + why }).then(done).catch(bad);
      }
    });
    g.querySelector("#skg-go").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = norm(g.querySelector("#skg-c").value);
      if (!v) { say("Enter your access code.", "err"); return; }
      sha(v).then(function (h) {
        if (h !== HASH) { say("That code is not right. Please check it and try again.", "err"); return; }
        grant(HASH);
      }).catch(function () { say("This browser cannot check codes here. Please email me and I will help.", "err"); });
    });
    // Personal link from an approval email: ?access=TOKEN
    var tk = param();
    if (tk) {
      stripParam();
      if (!API) { say("This access link cannot be checked right now. Please email me and I will help.", "err"); }
      else {
        say("Checking your access link…");
        verify(tk).then(function (j) { if (j && j.ok) grant("tok:" + tk); else say("This access link is not valid or has expired. Please request access again.", "err"); })
          .catch(function () { say("I could not check your link just now. Please try again in a moment.", "err"); });
        g.scrollIntoView({ block: "center" });
      }
    }
    // Links into the locked sections bring people to the access panel
    document.addEventListener("click", function (e) {
      if (!root.classList.contains("sk-locked")) return;
      var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
      var h = a.getAttribute("href") || "";
      if (/^(\.\.\/)?#(home|top)?$/.test(h) || /#home$/.test(h)) return;
      if (/^#/.test(h) || /^\.\.\/#/.test(h) || /^projects\//.test(h)) { if (/^\.\.\//.test(h)) return; e.preventDefault(); g.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
