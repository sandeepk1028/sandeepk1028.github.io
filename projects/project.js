(function () {
  var root = document.documentElement, bar = document.getElementById("progress");
  var anim = !matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window;
  if (anim) {
    root.classList.add("anim");
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-r]").forEach(function (el) { io.observe(el); });
  }
  function onScroll() { var h = root.scrollHeight - innerHeight; bar.style.setProperty("--p", h > 0 ? scrollY / h : 0); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
