const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(Boolean(open)));
});

document.querySelectorAll("[data-reveal]").forEach((element) => {
  element.classList.add("reveal-ready");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

const canvas = document.querySelector(".orb-canvas");
if (canvas) {
  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let points = [];

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({ length: 52 }, (_, index) => {
      const angle = index * 2.399963;
      const radius = 26 + (index % 11) * 7;
      return { angle, radius, depth: 0.55 + (index % 7) * 0.07, drift: 0.0015 + (index % 5) * 0.0003 };
    });
  };
  resize();
  window.addEventListener("resize", resize);

  let time = 0;
  const draw = () => {
    context.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const size = Math.min(width, height) * 0.39;

    const halo = context.createRadialGradient(cx, cy, size * 0.15, cx, cy, size);
    halo.addColorStop(0, "rgba(212,175,55,.16)");
    halo.addColorStop(0.55, "rgba(212,175,55,.045)");
    halo.addColorStop(1, "rgba(212,175,55,0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(cx, cy, size, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.translate(cx, cy);
    context.rotate(time * 0.00008);
    context.strokeStyle = "rgba(212,175,55,.28)";
    context.lineWidth = 1;
    for (let ring = 0; ring < 3; ring += 1) {
      context.beginPath();
      context.ellipse(0, 0, size * (0.55 + ring * 0.16), size * (0.38 + ring * 0.08), ring * 0.58, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();

    points.forEach((point) => {
      const angle = point.angle + (reduceMotion ? 0 : time * point.drift);
      const x = Math.cos(angle) * point.radius * 3.05;
      const y = Math.sin(angle) * point.radius * 1.55;
      context.beginPath();
      context.arc(cx + x * 0.92, cy + y * 0.92, 0.7 + point.depth * 0.65, 0, Math.PI * 2);
      context.fillStyle = "rgba(242,202,80,.72)";
      context.fill();
    });

    if (!reduceMotion) {
      time += 16;
      requestAnimationFrame(draw);
    }
  };
  draw();
}

document.querySelectorAll("[data-count]").forEach((element) => {
  const finalValue = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  element.textContent = `0${suffix}`;
  const countObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    countObserver.disconnect();
    const duration = 1100;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(finalValue * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });
  countObserver.observe(element);
});

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Demo form ready. Connect a form endpoint or CRM before production.";
      status.setAttribute("role", "status");
    }
  });
});
