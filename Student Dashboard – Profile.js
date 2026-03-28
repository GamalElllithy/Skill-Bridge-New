document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupDropdowns();
  setupReveal();
  setupTabs();
  setupProjectFilters();
  setupSkillPreview();
  setupActivityFilters();
  setupToasts();
  setupThemeToggle();
});

function setupMenu() {
  const topbar = document.getElementById("profileTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;

  toggle.addEventListener("click", () => {
    topbar.classList.toggle("is-open");
  });
}

function setupDropdowns() {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");

  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute("data-dropdown-trigger");
    const menu = document.getElementById(targetId);
    if (!menu) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !menu.classList.contains("is-open");
      closeAllDropdowns();
      if (willOpen) menu.classList.add("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    const insideDropdown = event.target.closest(".dropdown-menu");
    const insideTrigger = event.target.closest("[data-dropdown-trigger]");
    if (!insideDropdown && !insideTrigger) closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(item);
  });
}

function setupTabs() {
  const buttons = document.querySelectorAll("[data-tab-target]");
  const panels = document.querySelectorAll(".tab-panel");
  if (!buttons.length || !panels.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab-target");
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      panels.forEach((panel) => panel.classList.toggle("active", panel.id === target));
    });
  });
}

function setupProjectFilters() {
  const techFilter = document.getElementById("projectTech");
  const yearFilter = document.getElementById("projectYear");
  const cards = Array.from(document.querySelectorAll("#projectsGrid .project-card"));
  if (!techFilter || !yearFilter || !cards.length) return;

  const applyFilters = () => {
    const techValue = techFilter.value;
    const yearValue = yearFilter.value;

    cards.forEach((card) => {
      const techs = card.dataset.tech || "";
      const year = card.dataset.year || "";
      const techMatch = techValue === "all" || techs.includes(techValue);
      const yearMatch = yearValue === "all" || year === yearValue;
      card.hidden = !(techMatch && yearMatch);
    });
  };

  techFilter.addEventListener("change", applyFilters);
  yearFilter.addEventListener("change", applyFilters);
}

function setupSkillPreview() {
  const preview = document.getElementById("skillPreview");
  const tags = document.querySelectorAll(".skill-tag");
  if (!preview || !tags.length) return;

  tags.forEach((tag) => {
    const text = tag.getAttribute("data-skill-info") || "";
    tag.addEventListener("mouseenter", () => {
      preview.textContent = text;
    });
    tag.addEventListener("focus", () => {
      preview.textContent = text;
    });
  });
}

function setupActivityFilters() {
  const buttons = document.querySelectorAll("[data-activity-filter]");
  const cards = document.querySelectorAll("#activityTimeline .timeline-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-activity-filter");
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.type === filter;
        card.hidden = !matches;
      });
    });
  });
}

function setupToasts() {
  const toast = document.getElementById("profileToast");
  const buttons = document.querySelectorAll("[data-toast]");
  if (!toast || !buttons.length) return;

  let timeoutId;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      toast.textContent = button.getAttribute("data-toast");
      toast.classList.add("is-visible");
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        toast.classList.remove("is-visible");
      }, 2200);
    });
  });
}

function setupThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}
