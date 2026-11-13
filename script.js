const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Header background on scroll ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");

const setMenu = (open) => {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("lock", open);
};

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuBtn.focus();
  }
});
window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- Theme toggle ---------- */
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

// Stagger siblings that enter together
document.querySelectorAll(".work-grid, .skills-grid, .edu-grid, .timeline, .hero-inner").forEach((group) => {
  group.querySelectorAll(":scope > .reveal").forEach((el, i) => el.style.setProperty("--d", `${i * 0.08}s`));
});

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- Active nav link ---------- */
const navLinks = [...document.querySelectorAll(".nav-items a[href^='#']")];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- Typing effect in the hero ---------- */
const typedEl = document.querySelector(".typed");
const words = ["fast", "responsive", "pixel-perfect", "accessible"];

if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = words[0];
  } else {
    let w = 0;
    let c = 0;
    let deleting = false;
    const tick = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  }
}

/* ---------- Copy email ---------- */
const copyBtn = document.querySelector(".copy-email");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      copyBtn.textContent = "Copied ✓";
    } catch (e) {
      copyBtn.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => (copyBtn.textContent = "Copy email"), 2000);
  });
}

/* ---------- Footer year ---------- */
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
