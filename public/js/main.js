// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
}

// Carousels (Home page: About Me / Portfolio cards)
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.parentElement.querySelectorAll(".carousel-dots span");
  let index = 0;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("active", n === index));
    dots.forEach((d, n) => d.classList.toggle("active", n === index));
  };

  carousel.querySelector(".prev").addEventListener("click", () => show(index - 1));
  carousel.querySelector(".next").addEventListener("click", () => show(index + 1));
  show(0);
});

// Modals: buttons with data-modal="id" open the matching .modal
document.querySelectorAll("[data-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.modal).classList.add("open");
  });
});
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal-close")) modal.classList.remove("open");
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach((m) => m.classList.remove("open"));
});
