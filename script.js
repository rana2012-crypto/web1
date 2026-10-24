// =========================================
// Mode gelap / terang
// (tema awal sudah dipasang oleh skrip kecil di <head>)
// =========================================
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
  try {
    return localStorage.getItem("tema");
  } catch (e) {
    return null;
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const toDark = theme !== "dark";
  themeToggle.setAttribute("aria-label", toDark ? "Aktifkan mode gelap" : "Aktifkan mode terang");
  themeToggle.title = toDark ? "Mode gelap" : "Mode terang";
}

applyTheme(root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light"));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let themeAnimTimer;

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

  // Pasang transisi warna sebentar supaya pergantian tema terasa halus
  if (!reduceMotion.matches) {
    root.classList.add("theme-anim");
    clearTimeout(themeAnimTimer);
    themeAnimTimer = setTimeout(() => root.classList.remove("theme-anim"), 500);
  }

  applyTheme(next);
  try {
    localStorage.setItem("tema", next);
  } catch (e) {
    // penyimpanan tidak tersedia (mis. mode privat) — tema tetap berganti
  }
});

// Ikuti perubahan pengaturan perangkat selama pengguna belum memilih sendiri
darkQuery.addEventListener("change", (e) => {
  const saved = getSavedTheme();
  if (saved !== "light" && saved !== "dark") applyTheme(e.matches ? "dark" : "light");
});

// =========================================
// Menu hamburger (tampilan HP & tablet)
// =========================================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}

navToggle.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("open"));
});

// Tutup menu setelah salah satu link diklik
navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// Tutup menu saat klik di luar menu atau menekan Esc
document.addEventListener("click", (e) => {
  if (!navMenu.classList.contains("open")) return;
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("open")) {
    setMenu(false);
    navToggle.focus();
  }
});

// Tutup menu jika layar diperlebar ke ukuran laptop
window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

// =========================================
// Bayangan header saat halaman digulir
// =========================================
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// =========================================
// Tandai menu aktif sesuai section yang terlihat
// =========================================
const sections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
  // Section aktif = section terakhir yang bagian atasnya sudah melewati
  // sepertiga atas layar. Jika sudah di dasar halaman, pilih section terakhir.
  const batas = window.innerHeight / 3;
  const diDasar = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
  let currentId = sections[0].id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= batas) currentId = section.id;
  });
  if (diDasar) currentId = sections[sections.length - 1].id;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
window.addEventListener("load", updateActiveLink);
updateActiveLink();

// =========================================
// Animasi muncul saat elemen terlihat
// =========================================
const revealItems = document.querySelectorAll(".reveal");

// Kartu yang berjajar muncul bergantian (jeda 0,1 detik per kartu)
revealItems.forEach((item) => {
  const siblings = [...item.parentElement.children].filter((el) => el.classList.contains("reveal"));
  const index = siblings.indexOf(item);
  if (index > 0) item.style.setProperty("--delay", Math.min(index, 4) * 0.1 + "s");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// =========================================
// Tahun otomatis di footer
// =========================================
document.getElementById("year").textContent = new Date().getFullYear();
