/* Soft access gate: the welcome section is open, the rest asks for an access code.
   This is a courtesy gate, not security: the page content is still delivered to the browser. */
(function () {
  var HASH = "90c0af481025609087947279459d38a17e727e89a65fa9ff4de5100bcb61beb1", KEY = "skAccess", MAIL = "kumarsandeep.k7259@gmail.com";
  window.skSend = function (p) {
    return fetch("https://formsubmit.co/ajax/" + MAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: p.name, email: p.email, _subject: p.subject, message: p.message, _template: "table", _captcha: "false", _honey: "" }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { if (j && (j.success === true || j.success === "true")) return true; throw new Error((j && j.message) || "send failed"); });
  };
  var root = document.documentElement, store = null;
  try { store = window.localStorage; } catch (e) {}
  function unlocked() { try { return store && store.getItem(KEY) === HASH; } catch (e) { return false; } }
  if (unlocked()) return;
  root.classList.add("sk-locked");
  var css = document.createElement("style");
  css.textContent = [
    "html.sk-locked main, html.sk-locked body > footer { display: none !important; }",
    ".skg { position: relative; isolation: isolate; min-height: 100vh; min-height: 100svh; display: grid; place-items: center; padding: 110px 20px; overflow: hidden; background: var(--bg, #0e0e10); color: var(--text, #f5efe8); font-family: var(--body, system-ui, sans-serif); }",
    ".skg::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: var(--a1, #f59e0b); opacity: .08; -webkit-mask-image: var(--pcb), linear-gradient(180deg, transparent 0, #000 260px); mask-image: var(--pcb), linear-gradient(180deg, transparent 0, #000 260px); -webkit-mask-size: 240px 240px, 100% 100%; mask-size: 240px 240px, 100% 100%; -webkit-mask-repeat: repeat, no-repeat; mask-repeat: repeat, no-repeat; -webkit-mask-composite: source-in; mask-composite: intersect; }",
    ".skg::after { content: ''; position: absolute; left: 50%; top: 45%; width: 900px; height: 900px; margin: -450px 0 0 -450px; z-index: -1; pointer-events: none; background: radial-gradient(circle, color-mix(in srgb, var(--a1, #f59e0b) 15%, transparent), transparent 62%); }",
    ".skg-c { width: min(100%, 620px); padding: clamp(26px, 5vw, 46px); border-radius: 28px; background: var(--surface, #1a1a1e); border: 1px solid var(--line, #2e2a26); box-shadow: 0 40px 90px -40px #000; animation: skgin .9s var(--ease, ease) both; }",
    "@keyframes skgin { from { opacity: 0; transform: translateY(34px) scale(.97); } }",
    ".skg-k { display: inline-flex; align-items: center; gap: 10px; font: 500 12px/1 var(--mono, monospace); letter-spacing: .18em; text-transform: uppercase; color: var(--a1, #f59e0b); }",
    ".skg-k i { width: 9px; height: 9px; border-radius: 50%; background: var(--a1, #f59e0b); box-shadow: 0 0 14px var(--a1, #f59e0b); }",
    ".skg h2 { margin: 18px 0 12px; font: 800 clamp(30px, 5vw, 46px)/1.05 var(--display, system-ui); letter-spacing: -.035em; text-wrap: balance; }",
    ".skg p { margin: 0 0 24px; color: var(--text-2, #b8aea2); font-size: 17px; line-height: 1.6; }",
    ".skg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }",
    ".skg input { width: 100%; font: 500 16px/1.4 var(--body, system-ui); color: inherit; background: var(--bg, #0e0e10); border: 1px solid var(--line, #2e2a26); border-radius: 14px; padding: 15px 16px; transition: border-color .3s, box-shadow .3s; }",
    ".skg input:focus { outline: none; border-color: var(--a1, #f59e0b); box-shadow: 0 0 0 3px color-mix(in srgb, var(--a1, #f59e0b) 22%, transparent); }",
    ".skg input::placeholder { color: var(--text-3, #7d7469); }",
    ".skg-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; height: 52px; padding: 0 26px; border-radius: 999px; border: 1px solid var(--text, #f5efe8); background: var(--text, #f5efe8); color: var(--bg, #0e0e10); font: 700 15px/1 var(--body, system-ui); cursor: pointer; transition: transform .35s var(--ease, ease), background .3s, color .3s; }",
    ".skg-btn:hover { background: var(--a1, #f59e0b); border-color: var(--a1, #f59e0b); color: var(--on-accent, #140c02); transform: translateY(-2px); }",
    ".skg-btn.ghost { background: transparent; color: var(--text, #f5efe8); border-color: var(--line, #2e2a26); }",
    ".skg-btn.ghost:hover { border-color: var(--a1, #f59e0b); color: var(--a1, #f59e0b); background: transparent; }",
    ".skg-or { display: flex; align-items: center; gap: 14px; margin: 28px 0 22px; font: 500 11px/1 var(--mono, monospace); letter-spacing: .2em; text-transform: uppercase; color: var(--text-3, #7d7469); }",
    ".skg-or::before, .skg-or::after { content: ''; flex: 1; height: 1px; background: var(--line, #2e2a26); }",
    ".skg-code { display: flex; gap: 12px; }",
    ".skg-code input { flex: 1; text-transform: uppercase; letter-spacing: .12em; font-family: var(--mono, monospace); }",
    ".skg-m { min-height: 22px; margin: 14px 0 0 !important; font-size: 14px !important; color: var(--text-2, #b8aea2); }",
    ".skg-m.err { color: #f0716f; }",
    ".skg-m.ok { color: #4ade80; }",
    ".skg-f { margin-top: 22px; padding-top: 18px; border-top: 1px dashed var(--line, #2e2a26); display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 14px; color: var(--text-3, #7d7469); }",
    ".skg-f a { color: var(--text-2, #b8aea2); }",
    ".skg-f a:hover { color: var(--a1, #f59e0b); }",
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
    g.innerHTML = '<div class="skg-c"><span class="skg-k"><i></i>Access required</span><h2>Request access to view the rest of the portfolio</h2><p>The welcome page is open to everyone. My experience, projects and contact details are shared on request. Send me your details and I will reply with an access code.</p>' +
      '<form id="skg-req" novalidate><div class="skg-row"><input id="skg-n" name="name" placeholder="Your name" autocomplete="name" aria-label="Your name"><input id="skg-e" name="email" type="email" placeholder="Your email" autocomplete="email" aria-label="Your email"></div><button class="skg-btn" type="submit">Request access <span aria-hidden="true">→</span></button></form>' +
      '<div class="skg-or">Already have a code</div><form class="skg-code" id="skg-go" novalidate><input id="skg-c" placeholder="SK-XXXXX-XXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Access code"><button class="skg-btn ghost" type="submit">Unlock</button></form>' +
      '<p class="skg-m" id="skg-m" role="status"></p><div class="skg-f"><a href="mailto:' + MAIL + '">' + MAIL + '</a><a href="https://www.linkedin.com/in/sandeep-kumar-k" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/sandeepk1028" target="_blank" rel="noopener">GitHub</a></div></div>';
    var main = document.querySelector("main"); main.parentNode.insertBefore(g, main);
    var m = g.querySelector("#skg-m");
    function say(t, c) { m.className = "skg-m" + (c ? " " + c : ""); m.textContent = t; }
    g.querySelector("#skg-req").addEventListener("submit", function (e) {
      e.preventDefault();
      var n = g.querySelector("#skg-n").value.trim(), em = g.querySelector("#skg-e").value.trim(), btn = e.target.querySelector("button");
      if (!n || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { say("Please add your name and a valid email.", "err"); return; }
      var label = btn.innerHTML; btn.disabled = true; btn.textContent = "Sending…"; say("");
      window.skSend({ name: n, email: em, subject: "Portfolio access request from " + n, message: "Hello Sandeep,\n\nI would like access to your portfolio.\n\nName: " + n + "\nEmail: " + em }).then(function () {
        say("Request sent. Thank you, " + n + "! I will reply to " + em + " with your access code.", "ok"); g.querySelector("#skg-n").value = ""; g.querySelector("#skg-e").value = ""; btn.textContent = "Request sent ✓";
        setTimeout(function () { btn.disabled = false; btn.innerHTML = label; }, 4000);
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = label;
        m.className = "skg-m err"; m.innerHTML = 'Sorry, I could not send that automatically. Please email me directly at <a href="mailto:' + MAIL + '?subject=' + encodeURIComponent("Portfolio access request") + '">' + MAIL + '</a>.';
      });
    });
    g.querySelector("#skg-go").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = norm(g.querySelector("#skg-c").value);
      if (!v) { say("Enter your access code.", "err"); return; }
      sha(v).then(function (h) {
        if (h !== HASH) { say("That code is not right. Please check it and try again.", "err"); return; }
        try { store && store.setItem(KEY, HASH); } catch (x) {}
        say("Access granted. Welcome!", "ok"); g.classList.add("out");
        setTimeout(function () {
          root.classList.remove("sk-locked"); g.remove();
          window.dispatchEvent(new Event("resize"));
          var t = document.querySelector("main #about, main.pg") || document.querySelector("main");
          if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "start" });
          window.dispatchEvent(new Event("scroll"));
        }, 560);
      }).catch(function () { say("This browser cannot check codes here. Please email me and I will help.", "err"); });
    });
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
