const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const navDropdown = document.querySelector(".nav-dropdown");
const navDropdownTrigger = document.querySelector(".nav-dropdown-trigger");

const closeDropdown = () => {
  if (navDropdown && navDropdownTrigger) {
    navDropdown.classList.remove("is-open");
    navDropdownTrigger.setAttribute("aria-expanded", "false");
  }
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    if (isOpen) {
      closeDropdown();
    }
  });
}

if (navDropdown && navDropdownTrigger) {
  navDropdownTrigger.addEventListener("click", () => {
    const isOpen = navDropdown.classList.toggle("is-open");
    navDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
  });
}

const carousel = document.querySelector("[data-carousel]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (carousel) {
  const slideData = carousel.querySelector("[data-carousel-slides]");
  const slides = slideData ? JSON.parse(slideData.textContent) : [];
  const image = carousel.querySelector("[data-carousel-image]");
  const caption = carousel.querySelector("[data-carousel-caption]");
  const count = carousel.querySelector("[data-carousel-count]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const open = carousel.querySelector("[data-carousel-open]");
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  let index = 0;
  let timer;

  if (!slides.length) {
    throw new Error("Carousel slide data is missing.");
  }

  const setSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    const slide = slides[index];
    image.src = slide.src;
    image.alt = slide.alt;
    caption.textContent = slide.caption;
    count.textContent = `${index + 1} of ${slides.length}`;
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === index));
    });
  };

  const stop = () => {
    window.clearInterval(timer);
  };

  const start = () => {
    stop();
    if (motionQuery.matches) {
      return;
    }
    timer = window.setInterval(() => {
      if (!carousel.matches(":hover") && !carousel.contains(document.activeElement)) {
        setSlide(index + 1);
      }
    }, 4200);
  };

  previous.addEventListener("click", () => {
    setSlide(index - 1);
    start();
  });

  next.addEventListener("click", () => {
    setSlide(index + 1);
    start();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setSlide(Number(dot.dataset.carouselDot));
      start();
    });
  });

  open.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) {
      return;
    }
    const slide = slides[index];
    lightboxImage.src = slide.src;
    lightboxImage.alt = slide.alt;
    lightboxCaption.textContent = slide.caption;
    lightbox.hidden = false;
    stop();
    lightboxClose.focus();
  });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("mouseover", stop);
  carousel.addEventListener("mouseout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      start();
    }
  });
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      start();
    }
  });

  setSlide(0);
  start();

  motionQuery.addEventListener("change", () => {
    if (motionQuery.matches) {
      stop();
    } else {
      start();
    }
  });
}

if (lightbox && lightboxClose) {
  const closeLightbox = () => {
    lightbox.hidden = true;
    if (carousel) {
      carousel.querySelector("[data-carousel-open]").focus();
    }
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
