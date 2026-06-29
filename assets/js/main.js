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
