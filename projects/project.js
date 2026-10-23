(function () {
  var root = document.documentElement, bar = document.getElementById("progress");
  var anim = !matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window;
  if (anim) {
    root.classList.add("anim");
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-r]").forEach(function (el) { io.observe(el); });
  }
  function onScroll() { var h = root.scrollHeight - innerHeight; bar.style.setProperty("--p", h > 0 ? scrollY / h : 0); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var links = [].slice.call(document.querySelectorAll(".toc a")), secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function spy() { var cur = 0; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; }); links.forEach(function (a, i) { a.classList.toggle("on", i === cur); }); }
  addEventListener("scroll", spy, { passive: true }); spy();
})();
