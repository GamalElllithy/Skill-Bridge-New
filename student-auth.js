const PASSPORT_KEY = "skillbridgeTalentPassport";
const ROLE_KEY = "skillbridgeUserRole";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const DRAFT_KEY = "skillbridgeOnboardingDraft";
const DEFAULT_JOB_READINESS = 22;

const CATEGORY_TRACKS = {
  technology: {
    title: "Technology",
    careerPath: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "Python", "SQL", "React"]
  },
  business: {
    title: "Business",
    careerPath: "Marketing Specialist",
    skills: ["Communication", "Leadership", "Excel", "Presentation", "Negotiation", "Research"]
  },
  design: {
    title: "Design",
    careerPath: "Product Designer",
    skills: ["Figma", "Wireframing", "UX Research", "Typography", "Prototyping", "Visual Design"]
  },
  media: {
    title: "Media",
    careerPath: "Content Creator",
    skills: ["Content Writing", "Canva", "Editing", "Storytelling", "Social Media", "Research"]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupMenu("studentAuthTopbar");
  setupReveal();
  setupViewSwitch("[data-student-auth]");
  setupPasswordToggles();
  setupFlowLinks();
  setupStudentLogin();
  setupStudentWizard();
});

function setupMenu(id) {
  const topbar = document.getElementById(id);
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;
  toggle.addEventListener("click", () => topbar.classList.toggle("is-open"));
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (typeof IntersectionObserver === "undefined") {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function setupViewSwitch(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const buttons = root.querySelectorAll("[data-auth-view]");
  const panels = root.querySelectorAll("[data-auth-panel]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-auth-view");
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      panels.forEach((panel) => panel.classList.toggle("active", panel.getAttribute("data-auth-panel") === target));
    });
  });
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(button.getAttribute("data-toggle-password"));
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "إخفاء" : "إظهار";
    });
  });
}

function setupFlowLinks() {
  const accessLink = document.getElementById("studentAccessLink");
  const continueLink = document.getElementById("studentContinueLink");
  const draft = readStoredJson(DRAFT_KEY);
  const label = draft?.profile || draft?.currentStep >= 0 ? "كمّل الـ Onboarding" : "ابدأ الـ Onboarding";

  [accessLink, continueLink].forEach((link) => {
    if (!link) return;
    link.href = "student-onboarding.html";
    link.textContent = label;
  });
}

function setupStudentLogin() {
  const form = document.getElementById("studentLoginForm");
  const email = document.getElementById("studentLoginEmail");
  const password = document.getElementById("studentLoginPassword");
  const remember = document.getElementById("rememberStudent");

  if (!form || !email || !password) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
      showToast("أدخل البريد الإلكتروني وكلمة المرور أولًا.");
      return;
    }

    if (!isValidEmail(emailValue)) {
      showToast("البريد الإلكتروني غير صحيح.");
      email.focus();
      return;
    }

    if (passwordValue.length < 6) {
      showToast("كلمة المرور قصيرة جدًا.");
      password.focus();
      return;
    }

    window.localStorage.setItem(ROLE_KEY, "student");

    const current = getCurrentPassport();
    const name = current.name || emailValue.split("@")[0];
    mergePassport({
      name,
      email: emailValue,
      status: current.status || "Available",
      track: current.track || "Talent in Progress",
      avatar: current.avatar || getInitials(name),
      welcomeState: remember?.checked ? "returning" : "login",
      jobReadiness: current.jobReadiness || DEFAULT_JOB_READINESS
    });

    runSmartWelcome(name, "login", "student-onboarding.html");
  });
}

function setupStudentWizard() {
  const steps = Array.from(document.querySelectorAll(".signup-step"));
  const next = document.querySelector("[data-next-step]");
  const prev = document.querySelector("[data-prev-step]");
  const finish = document.querySelector("[data-finish-step]");
  const label = document.querySelector("[data-progress-label]");
  const bar = document.querySelector("[data-progress-bar]");
  const copy = document.querySelector("[data-progress-copy]");
  const categoryButtons = Array.from(document.querySelectorAll("[data-category]"));
  const skillsGrid = document.getElementById("studentSkillsGrid");
  const skillsCounter = document.getElementById("skillsCounter");

  if (!steps.length || !next || !prev || !finish || !label || !bar || !copy || !skillsGrid || !skillsCounter) return;

  let current = 0;
  let selectedCategory = "technology";
  let selectedSkills = [];

  const stepMessages = [
    "خلّينا نبدأ بالمعلومات الأساسية فقط.",
    "اختيار واحد هنا يكفي، والتفاصيل هنكملها في الـ onboarding.",
    "بقيت خطوة أخيرة ثم ننقلك مباشرة للتحليل الذكي."
  ];

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.getAttribute("data-category") || "";
      selectedSkills = [];
      categoryButtons.forEach((item) => item.classList.toggle("selected", item === button));
      renderSkills(selectedCategory, selectedSkills, skillsGrid, skillsCounter);
    });
  });

  next.addEventListener("click", () => {
    if (!validateStep(current, { selectedCategory, selectedSkills })) return;
    if (current < steps.length - 1) {
      current += 1;
      render();
    }
  });

  prev.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      render();
    }
  });

  finish.addEventListener("click", () => {
    if (!validateStep(current, { selectedCategory, selectedSkills })) return;

    const name = getValue("studentName");
    const email = getValue("studentEmail");
    const phone = getValue("studentPhone");
    const password = getValue("studentPassword");
    const level = getValue("studentLevel");
    const opportunity = getValue("studentOpportunity");
    const location = getValue("studentLocation");
    const status = getValue("studentStatus");
    const about = getValue("studentAbout");
    const category = CATEGORY_TRACKS[selectedCategory] || CATEGORY_TRACKS.technology;

    if (password.length < 8) {
      showToast("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }

    window.localStorage.setItem(ROLE_KEY, "student");

    mergePassport({
      name,
      email,
      phone,
      track: category.careerPath,
      category: category.title,
      academicLevel: level,
      opportunity,
      location,
      status,
      about,
      skills: selectedSkills,
      avatar: getInitials(name),
      welcomeState: "signup",
      jobReadiness: Math.max(getCurrentPassport().jobReadiness || DEFAULT_JOB_READINESS, 28)
    });

    runSmartWelcome(name, "signup", "student-onboarding.html");
  });

  function render() {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));
    label.textContent = `Step ${current + 1} / ${steps.length}`;
    bar.style.width = `${((current + 1) / steps.length) * 100}%`;
    copy.textContent = stepMessages[current];
    prev.classList.toggle("hidden", current === 0);
    next.classList.toggle("hidden", current === steps.length - 1);
    finish.classList.toggle("hidden", current !== steps.length - 1);
  }

  categoryButtons.forEach((button) => {
    button.classList.toggle("selected", button.getAttribute("data-category") === selectedCategory);
  });
  renderSkills(selectedCategory, selectedSkills, skillsGrid, skillsCounter);
  render();
}

function renderSkills(categoryKey, selectedSkills, skillsGrid, skillsCounter) {
  const category = CATEGORY_TRACKS[categoryKey] || CATEGORY_TRACKS.technology;

  skillsGrid.innerHTML = category.skills.map((skill) => `
    <button class="skill-btn ${selectedSkills.includes(skill) ? "selected" : ""}" type="button" data-skill="${escapeHtml(skill)}">${skill}</button>
  `).join("");

  skillsCounter.textContent = `${selectedSkills.length} selected`;

  skillsGrid.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = button.getAttribute("data-skill") || "";
      const exists = selectedSkills.includes(skill);
      if (exists) {
        selectedSkills.splice(selectedSkills.indexOf(skill), 1);
      } else {
        selectedSkills.push(skill);
      }
      renderSkills(categoryKey, selectedSkills, skillsGrid, skillsCounter);
    });
  });
}

function validateStep(current, state) {
  if (current === 0) {
    if (!getValue("studentName") || !getValue("studentEmail") || !getValue("studentPhone") || !getValue("studentPassword")) {
      showToast("أكمل المعلومات الأساسية أولًا.");
      return false;
    }

    if (!isValidEmail(getValue("studentEmail"))) {
      showToast("البريد الإلكتروني غير صحيح.");
      return false;
    }

    return true;
  }

  if (current === 1) {
    if (!state.selectedCategory || !getValue("studentLevel") || !getValue("studentOpportunity")) {
      showToast("اختَر المجال والمستوى ونوع الفرصة أولًا.");
      return false;
    }

    return true;
  }

  if (!getValue("studentLocation") || !getValue("studentStatus")) {
    showToast("أكمل التفضيلات الأساسية أولًا.");
    return false;
  }

  if (state.selectedSkills.length < 3) {
    showToast("اختَر 3 مهارات على الأقل علشان تكمل.");
    return false;
  }

  return true;
}

function runSmartWelcome(name, mode, destination) {
  const overlay = document.getElementById("smartAuthOverlay");
  const title = document.getElementById("overlayTitle");
  const subtitle = document.getElementById("overlaySubtitle");
  const targetUrl = destination || "student-onboarding.html";

  if (!overlay || !title || !subtitle) {
    window.location.href = targetUrl;
    return;
  }

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  title.textContent = "Creating your Talent DNA...";
  subtitle.textContent = "نجهز دخولك للمرحلة التالية";

  setTimeout(() => {
    title.textContent = `Welcome, ${name}`;
    subtitle.textContent = mode === "signup"
      ? "حسابك جاهز. نبدأ التحليل الذكي الآن."
      : "أهلاً بعودتك. نكمل الـ onboarding من حيث توقفت.";
  }, 1200);

  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2600);
}

function getStudentFlowState() {
  const passport = getCurrentPassport();
  let assessment = {};
  let draft = {};

  try {
    assessment = JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    assessment = {};
  }

  try {
    draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null") || {};
  } catch (error) {
    draft = {};
  }

  const hasPassport = Boolean(passport.name || passport.email);
  const hasDraft = Boolean(draft.profile || draft.currentStep >= 0);
  const completedSteps = Array.isArray(passport.completedSteps) ? passport.completedSteps.length : 0;
  const hasAssessment = Boolean(assessment.fullTitle || assessment.careerPath || assessment.persona);
  const isReadyForDashboard = hasPassport && (completedSteps >= 3 || hasAssessment);

  if (isReadyForDashboard) {
    return {
      entryUrl: "student-dashboard.html",
      entryLabel: "افتح الـ Dashboard"
    };
  }

  if (hasDraft || hasPassport) {
    return {
      entryUrl: "student-onboarding.html",
      entryLabel: "كمّل رحلتك"
    };
  }

  return {
    entryUrl: "student-onboarding.html",
    entryLabel: "ابدأ رحلتك"
  };
}

function readStoredJson(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

function getCurrentPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function mergePassport(partial) {
  const current = getCurrentPassport();
  const name = partial.name || current.name || "Student";
  const next = {
    ...current,
    name,
    email: partial.email || current.email || "",
    phone: partial.phone || current.phone || "",
    track: partial.track || current.track || "Talent in Progress",
    category: partial.category || current.category || "",
    academicLevel: partial.academicLevel || current.academicLevel || "",
    opportunity: partial.opportunity || current.opportunity || "Internship",
    location: partial.location || current.location || "Remote",
    status: partial.status || current.status || "Available",
    about: partial.about || current.about || "Student profile generated from smart access flow.",
    avatar: partial.avatar || current.avatar || getInitials(name),
    skills: Array.isArray(partial.skills) && partial.skills.length ? partial.skills : Array.isArray(current.skills) ? current.skills : [],
    strengths: Array.isArray(current.strengths) ? current.strengths : [],
    weaknesses: Array.isArray(current.weaknesses) ? current.weaknesses : [],
    badges: Array.isArray(current.badges) && current.badges.length ? current.badges : ["Explorer"],
    xp: typeof current.xp === "number" ? current.xp : 120,
    level: typeof current.level === "number" ? current.level : 1,
    levelLabel: current.levelLabel || "Level 1 - Starter",
    jobReadiness: partial.jobReadiness || current.jobReadiness || DEFAULT_JOB_READINESS,
    learningProgress: typeof current.learningProgress === "number" ? current.learningProgress : 0,
    projects: Array.isArray(current.projects) ? current.projects : [],
    applications: Array.isArray(current.applications) ? current.applications : [],
    savedJobs: Array.isArray(current.savedJobs) ? current.savedJobs : [],
    completedSteps: Array.isArray(current.completedSteps) ? current.completedSteps : [],
    welcomeState: partial.welcomeState || current.welcomeState || "signup",
    lastSeenAt: new Date().toISOString()
  };

  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(next));
  return next;
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showToast(message) {
  const toast = document.getElementById("studentAuthToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
