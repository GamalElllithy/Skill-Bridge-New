const COMPANY_NOTIFICATIONS_KEY = "skillbridgeCompanyNotifications";
const COMPANY_SETUP_KEY = "skillbridgeCompanySetup";
const POSTED_JOBS_KEY = "skillbridgePostedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";

document.addEventListener("DOMContentLoaded", () => {
  setupTopbar();
  setupDropdowns();
  setupReveal();
  setupStudentModals();
  setupModalTabs();
  setupStudentFilters();
  setupViewSwitch();
  setupCompanyNotifications();
  renderCompanyAnalytics();
});

function setupTopbar() {
  const topbar = document.getElementById("companyTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");

  if (toggle && topbar) {
    toggle.addEventListener("click", () => {
      topbar.classList.toggle("is-open");
    });
  }

  if (topbar) {
    window.addEventListener("scroll", () => {
      topbar.classList.toggle("is-scrolled", window.scrollY > 24);
    });
  }
}

function setupDropdowns() {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const targetId = trigger.getAttribute("data-dropdown-trigger");
      const target = document.getElementById(targetId);

      document.querySelectorAll(".dropdown-panel").forEach((panel) => {
        if (panel !== target) panel.classList.remove("is-open");
      });

      target?.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-dropdown-trigger]") || event.target.closest(".dropdown-panel")) return;
    document.querySelectorAll(".dropdown-panel").forEach((panel) => {
      panel.classList.remove("is-open");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (typeof IntersectionObserver === "undefined") {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function setupStudentModals() {
  const overlay = document.getElementById("modalOverlay");
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const closeButtons = document.querySelectorAll("[data-close-modal]");

  function closeAllModals() {
    document.querySelectorAll(".student-modal").forEach((modal) => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    });
    overlay?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-open-modal");
      const modal = document.getElementById(modalId);
      if (!modal || !overlay) return;

      closeAllModals();
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeAllModals));
  overlay?.addEventListener("click", closeAllModals);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });
}

function setupModalTabs() {
  const tabs = document.querySelectorAll(".modal-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const parentModal = tab.closest(".modal-card");
      const targetId = tab.getAttribute("data-tab-target");
      if (!parentModal || !targetId) return;

      parentModal.querySelectorAll(".modal-tab").forEach((item) => item.classList.remove("active"));
      parentModal.querySelectorAll(".modal-tab-panel").forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      parentModal.querySelector(`#${targetId}`)?.classList.add("active");
    });
  });
}

function setupStudentFilters() {
  const studentsGrid = document.getElementById("studentsGrid");
  const trackFilter = document.getElementById("trackFilter");
  const sortFilter = document.getElementById("sortFilter");
  const studentSearch = document.getElementById("studentSearch");
  const resultsCounter = document.getElementById("resultsCounter");

  if (!studentsGrid || !trackFilter || !sortFilter || !studentSearch || !resultsCounter) return;

  const studentCards = Array.from(studentsGrid.querySelectorAll(".student-card"));

  function updateStudents() {
    const trackValue = trackFilter.value;
    const sortValue = sortFilter.value;
    const searchValue = studentSearch.value.trim().toLowerCase();

    let filteredCards = studentCards.filter((card) => {
      const track = card.dataset.track || "";
      const name = (card.dataset.name || "").toLowerCase();
      const email = (card.dataset.email || "").toLowerCase();
      const matchesTrack = trackValue === "all" || track === trackValue;
      const matchesSearch = !searchValue || name.includes(searchValue) || email.includes(searchValue);
      return matchesTrack && matchesSearch;
    });

    if (sortValue !== "default") {
      filteredCards.sort((a, b) => Number(b.dataset[sortValue] || 0) - Number(a.dataset[sortValue] || 0));
    }

    studentCards.forEach((card) => card.classList.add("hidden"));
    filteredCards.forEach((card) => {
      card.classList.remove("hidden");
      studentsGrid.appendChild(card);
    });

    resultsCounter.textContent = `Showing ${filteredCards.length} students`;
  }

  trackFilter.addEventListener("change", updateStudents);
  sortFilter.addEventListener("change", updateStudents);
  studentSearch.addEventListener("input", updateStudents);

  updateStudents();
}

function setupViewSwitch() {
  const viewButtons = document.querySelectorAll("[data-view]");
  const studentsGrid = document.getElementById("studentsGrid");
  if (!viewButtons.length || !studentsGrid) return;

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      studentsGrid.classList.toggle("is-list", button.dataset.view === "list");
    });
  });
}

function setupCompanyNotifications() {
  const fab = document.getElementById("companyNotificationFab");
  const panel = document.getElementById("companyNotificationPanel");
  const markAll = document.getElementById("companyMarkAllRead");
  const notifications = ensureCompanyNotifications();

  renderCompanyNotifications(notifications);

  fab?.addEventListener("click", (event) => {
    event.stopPropagation();
    panel?.classList.toggle("hidden");
  });

  markAll?.addEventListener("click", () => {
    const updated = readCompanyNotifications().map((item) => ({ ...item, read: true }));
    writeCompanyNotifications(updated);
    renderCompanyNotifications(updated);
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".notification-center")) return;
    panel?.classList.add("hidden");
  });
}

function ensureCompanyNotifications() {
  const existing = readCompanyNotifications();
  const defaults = buildCompanyNotificationDefaults();
  const merged = mergeNotifications(existing, defaults);
  writeCompanyNotifications(merged);
  return merged;
}

function buildCompanyNotificationDefaults() {
  const students = getStudentData();
  const applications = getStoredJson(APPLIED_JOBS_KEY, []);
  const postedJobs = getStoredJson(POSTED_JOBS_KEY, []);
  const topCandidate = students.sort((a, b) => b.score - a.score)[0];

  return [
    {
      id: "company-new-applicants",
      title: "New applicants arrived",
      message: `${applications.length || 3} applicants are waiting for review across your open roles.`,
      type: "info",
      time: "الآن",
      link: "#jobs",
      read: false
    },
    {
      id: "company-top-match",
      title: "Top match candidate",
      message: `${topCandidate.name} (${topCandidate.score}% Match) is ready for a quick interview.`,
      type: "success",
      time: "منذ قليل",
      link: "#students",
      read: false
    },
    {
      id: "company-job-health",
      title: "Hiring pipeline update",
      message: `${postedJobs.length || 2} jobs are collecting candidates with strong fundamentals.`,
      type: "reminder",
      time: "اليوم",
      link: "#reports",
      read: postedJobs.length === 0
    }
  ];
}

function renderCompanyNotifications(notifications) {
  const visibleNotifications = notifications.filter((item) => !item.dismissed);
  const unread = visibleNotifications.filter((item) => !item.read).length;
  const trigger = document.getElementById("companyNotificationsTrigger");
  const count = document.getElementById("companyNotificationCount");
  const topbarList = document.getElementById("companyNotificationsList");
  const feed = document.getElementById("companyNotificationFeed");

  if (trigger) trigger.setAttribute("data-badge", String(unread));
  if (count) count.textContent = String(unread);

  if (topbarList) {
    topbarList.innerHTML = visibleNotifications.slice(0, 3).map((item) => `
      <a class="dropdown-note" href="${item.link}">
        <strong>${item.title}</strong>
        <span>${item.message}</span>
      </a>
    `).join("");
  }

  if (feed) {
    feed.innerHTML = visibleNotifications.map((item) => `
      <article class="notification-item ${item.type} ${item.read ? "" : "unread"}" data-notification-id="${item.id}">
        <div class="notification-item-head">
          <strong>${item.title}</strong>
          <small>${item.time}</small>
        </div>
        <p>${item.message}</p>
        <div class="notification-actions">
          <a href="${item.link}">Open</a>
          <button class="notification-dismiss" type="button" data-action="dismiss">Dismiss</button>
          ${item.read ? "" : '<button class="notification-clear" type="button" data-action="read">Mark read</button>'}
        </div>
      </article>
    `).join("");

    bindNotificationActions(feed, renderCompanyNotifications, writeCompanyNotifications, readCompanyNotifications);
  }
}

function renderCompanyAnalytics() {
  const departmentFilter = document.getElementById("analyticsDepartmentFilter");
  const jobTypeFilter = document.getElementById("analyticsJobTypeFilter");

  const render = () => {
    const students = getStudentData();
    const department = departmentFilter?.value || "all";
    const filtered = department === "all"
      ? students
      : students.filter((item) => item.trackKey === department);

    const averageMatch = filtered.length
      ? Math.round(filtered.reduce((sum, item) => sum + item.score, 0) / filtered.length)
      : 0;
    const skillCount = {};
    filtered.forEach((student) => {
      student.skills.forEach((skill) => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    renderTopSkills(topSkills);
    renderDistribution(filtered);
    renderAverageGauge(averageMatch, filtered);
    renderRecentApplications(filtered);
    renderKpis(filtered, averageMatch, topSkills[0]?.[0] || "--", jobTypeFilter?.value || "all");
  };

  departmentFilter?.addEventListener("change", render);
  jobTypeFilter?.addEventListener("change", render);
  render();
}

function renderTopSkills(items) {
  const container = document.getElementById("companyTopSkillsChart");
  if (!container) return;

  const max = Math.max(...items.map((item) => item[1]), 1);
  container.innerHTML = items.map(([skill, count]) => `
    <div class="chart-row">
      <span>${skill}</span>
      <div class="progress-track"><span style="width:${Math.round((count / max) * 100)}%"></span></div>
    </div>
  `).join("");
}

function renderDistribution(students) {
  const container = document.getElementById("companyDistributionChart");
  if (!container) return;

  const buckets = [
    { label: "90%+", count: students.filter((item) => item.score >= 90).length },
    { label: "80-89", count: students.filter((item) => item.score >= 80 && item.score < 90).length },
    { label: "70-79", count: students.filter((item) => item.score >= 70 && item.score < 80).length }
  ];
  const max = Math.max(...buckets.map((item) => item.count), 1);

  container.innerHTML = buckets.map((bucket) => `
    <div class="distribution-row">
      <div class="distribution-meta">
        <strong>${bucket.label}</strong>
        <span>${bucket.count} candidates</span>
      </div>
      <div class="progress-track"><span style="width:${Math.round((bucket.count / max) * 100)}%"></span></div>
    </div>
  `).join("");
}

function renderAverageGauge(value, students) {
  const ring = document.getElementById("companyAverageMatchRing");
  const label = document.getElementById("companyAverageMatchLabel");
  const topStudentsList = document.getElementById("companyTopStudentsList");
  const circumference = 289.03;

  if (ring) {
    ring.style.strokeDashoffset = `${circumference - (circumference * value) / 100}`;
  }
  if (label) label.textContent = `${value}%`;

  if (topStudentsList) {
    topStudentsList.innerHTML = students
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((student) => `<div><span>${student.track}</span><strong>${student.name}</strong></div>`)
      .join("");
  }
}

function renderRecentApplications(students) {
  const container = document.getElementById("companyRecentApplications");
  if (!container) return;

  container.innerHTML = students
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((student, index) => `<div><span>${index === 0 ? "Top Match" : "Candidate"}</span><strong>${student.name}</strong></div>`)
    .join("");
}

function renderKpis(students, averageMatch, topSkill, jobType) {
  replaceText("kpiApplicants", String(getStoredJson(APPLIED_JOBS_KEY, []).length || students.length * 3));
  replaceText("kpiAverageMatch", `${averageMatch}%`);
  replaceText("kpiTopSkill", topSkill);
  replaceText("kpiHiringHealth", jobType === "internship" ? "Internship Ready" : averageMatch >= 80 ? "Strong" : "Balanced");
}

function bindNotificationActions(container, renderFn, writeFn, readFn) {
  container.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      const item = button.closest("[data-notification-id]");
      const id = item?.getAttribute("data-notification-id");
      if (!id) return;

      let notifications = readFn();
      if (action === "read") {
        notifications = notifications.map((note) => note.id === id ? { ...note, read: true } : note);
      }
      if (action === "dismiss") {
        notifications = notifications.map((note) => note.id === id ? { ...note, dismissed: true } : note);
      }

      writeFn(notifications);
      renderFn(notifications);
    });
  });
}

function getStudentData() {
  return Array.from(document.querySelectorAll(".student-card")).map((card) => ({
    name: card.dataset.name || "",
    email: card.dataset.email || "",
    trackKey: card.dataset.track || "data",
    track: card.querySelector(".student-head p")?.textContent || "",
    xp: Number(card.dataset.xp || 0),
    projects: Number(card.dataset.projects || 0),
    score: Number(card.dataset.score || 0),
    skills: inferSkills(card.dataset.track || "data")
  }));
}

function inferSkills(track) {
  if (track === "software") return ["JavaScript", "React", "APIs", "Git"];
  if (track === "design") return ["UX", "Research", "Figma", "Prototyping"];
  return ["Python", "SQL", "Power BI", "Excel"];
}

function readCompanyNotifications() {
  return getStoredJson(COMPANY_NOTIFICATIONS_KEY, []);
}

function writeCompanyNotifications(items) {
  window.localStorage.setItem(COMPANY_NOTIFICATIONS_KEY, JSON.stringify(items));
}

function mergeNotifications(existing, defaults) {
  const map = new Map();
  defaults.forEach((item) => map.set(item.id, item));
  existing.forEach((item) => {
    map.set(item.id, { ...map.get(item.id), ...item });
  });
  return Array.from(map.values());
}

function getStoredJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}
