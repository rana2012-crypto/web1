// =========================================
// Menu hamburger (tampilan HP)
// =========================================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
});

// Tutup menu setelah salah satu link diklik
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
  });
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
