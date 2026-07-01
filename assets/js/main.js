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

const slides = [
  {
    src: "/assets/images/everything-clipboard/01-find-anything-you-copied.png",
    alt: "Everything Clipboard main window showing searchable clipboard history across copied items.",
    caption: "Find anything you copied across text, links, code, colors, files, images, and macOS pasteboards."
  },
  {
    src: "/assets/images/everything-clipboard/02-quick-paste-without-digging.png",
    alt: "Quick Paste window showing a focused search interface for clipboard results.",
    caption: "Use Quick Paste to search and restore copied items from a focused keyboard-first window."
  },
  {
    src: "/assets/images/everything-clipboard/03-private-by-default.png",
    alt: "Privacy settings showing ignored apps, ignored patterns, and secure text controls.",
    caption: "Keep clipboard history local on your Mac with ignored apps, ignored patterns, and secure text protection."
  },
  {
    src: "/assets/images/everything-clipboard/04-control-what-gets-captured.png",
    alt: "Capture settings for pasteboard monitoring, retention, OCR, and secure detection.",
    caption: "Choose which pasteboards are monitored and control history retention, OCR, secure detection, and capture pauses."
  },
  {
    src: "/assets/images/everything-clipboard/05-direct-paste-is-optional.png",
    alt: "Quick Paste settings explaining optional Direct Paste behavior.",
    caption: "Direct Paste is optional and uses macOS Accessibility permission only when you enable it."
  },
  {
    src: "/assets/images/everything-clipboard/06-build-a-paste-stack.png",
    alt: "Paste Stack workflow showing queued copied items for ordered pasting.",
    caption: "Queue copied items into a Paste Stack for repeated, ordered pasting."
  },
  {
    src: "/assets/images/everything-clipboard/07-built-in-help.png",
    alt: "Built-in Help window with topics for browsing, Quick Paste, Paste Stack, privacy, and shortcuts.",
    caption: "Keep product guidance close with searchable built-in help for browsing, Quick Paste, Paste Stack, media, privacy, and shortcuts."
  }
];

if (carousel) {
  const image = carousel.querySelector("[data-carousel-image]");
  const caption = carousel.querySelector("[data-carousel-caption]");
  const count = carousel.querySelector("[data-carousel-count]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const open = carousel.querySelector("[data-carousel-open]");
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  let index = 0;
  let timer;

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
