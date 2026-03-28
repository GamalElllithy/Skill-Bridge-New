const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const APPLIED_JOBS_KEY = "appliedJobs";
const SAVED_JOBS_KEY = "savedJobs";
const NOTIFICATIONS_KEY = "skillbridgeStudentNotifications";

document.addEventListener("DOMContentLoaded", () => {
  setupTopbar();
  setupDropdowns();
  setupReveal();
  renderDashboard();
  setupNotificationCenter();
});

function setupTopbar() {
  const topbar = document.getElementById("studentTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelectorAll(".topbar-links a");

  toggle?.addEventListener("click", () => {
    const isOpen = topbar?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!topbar || !toggle) return;
      topbar.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840 && topbar && toggle) {
      topbar.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", () => {
    topbar?.classList.toggle("is-scrolled", window.scrollY > 24);
  });
}

function setupDropdowns() {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const targetId = trigger.getAttribute("data-dropdown-trigger");
      const target = targetId ? document.getElementById(targetId) : null;

      document.querySelectorAll(".dropdown-panel").forEach((panel) => {
        if (panel !== target) panel.classList.remove("is-open");
      });

      triggers.forEach((button) => {
        if (button !== trigger) button.setAttribute("aria-expanded", "false");
      });

      const isOpen = target?.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-dropdown-trigger]") || event.target.closest(".dropdown-panel")) return;
    closeAllDropdowns();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-panel").forEach((panel) => panel.classList.remove("is-open"));
  document.querySelectorAll("[data-dropdown-trigger]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (
    typeof IntersectionObserver === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
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
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function renderDashboard() {
  const passport = readJson(PASSPORT_KEY, {});
  const assessment = readJson(ASSESSMENT_KEY, {});
  const appliedJobs = readJson(APPLIED_JOBS_KEY, []);
  const savedJobs = readJson(SAVED_JOBS_KEY, []);

  const profile = buildDashboardProfile(passport, assessment, appliedJobs, savedJobs);

  replaceText("topbarName", profile.firstName);
  replaceText("topbarAvatar", profile.avatar);
  replaceText("sidebarAvatar", profile.avatar);
  replaceText("sidebarName", profile.fullName);
  replaceText("sidebarTrack", profile.trackLabel);
  replaceText("sidebarNoteCopy", profile.sidebarNote);
  replaceText("welcomeTitle", `أهلًا يا ${profile.firstName}`);
  replaceText("welcomeCopy", profile.welcomeCopy);
  replaceText("snapshotTitle", profile.snapshotTitle);
  replaceText("snapshotMatch", `${profile.match}%`);
  replaceText("snapshotCopy", profile.snapshotCopy);
  replaceText("journeyProgressCopy", `${profile.journeyProgress}%`);
  replaceText("xpProgressCopy", `${profile.xp} / 1000`);
  replaceText("levelBadge", profile.levelBadge);
  replaceText("nextStepTitle", profile.nextStepTitle);
  replaceText("nextStepCopy", profile.nextStepCopy);
  replaceText("todayFocusTitle", profile.nextStepTitle);
  replaceText("todayFocusCopy", profile.todayFocusCopy);
  replaceText("journeyActiveCopy", profile.journeyActiveCopy);
  replaceText("welcomeTag", profile.welcomeTag);

  setActionLink("heroPrimaryAction", profile.primaryAction);
  setActionLink("heroSecondaryAction", profile.secondaryAction);
  setActionLink("nextStepAction", profile.nextStepAction);

  setProgress("journeyProgressBar", profile.journeyProgress);
  setProgress("xpProgressBar", Math.min(profile.xp, 1000) / 10);

  renderSkillList("topSkillsList", profile.skills, "موجودة في بروفايلك");
  renderSkillList("skillGapsList", profile.gaps, "طوّرها الآن", true);
  renderTimeline(profile.timeline);
  renderBadges(profile.badges);
  renderProjects(profile.projects);
  renderJobStats(profile);

  const notifications = ensureNotifications(profile);
  renderNotifications(notifications);
  renderUpdates(profile, notifications);
}

function buildDashboardProfile(passport, assessment, appliedJobs, savedJobs) {
  const fullName = String(passport.name || "Gamal Ahmed").trim();
  const firstName = fullName.split(" ").filter(Boolean)[0] || "صديقنا";
  const avatar = passport.avatar || initials(fullName);

  const rawTrack =
    assessment.careerPath ||
    assessment.fullTitle ||
    passport.track ||
    "Data Analysis";

  const trackLabel = cleanTrackLabel(rawTrack);

  const strengths = pickArray(
    assessment.strengths,
    passport.strengths,
    ["تحليل منطقي", "حل المشكلات", "تنفيذ منظم"]
  );

  const gaps = pickArray(
    assessment.weaknesses,
    passport.weaknesses,
    ["SQL المتقدم", "العرض والتقديم", "بناء مشاريع أقوى"]
  );

  const skills = pickArray(
    passport.skills,
    [],
    ["Python", "SQL", "Excel", "Dashboards", "Communication"]
  ).slice(0, 6);

  const projects = Array.isArray(passport.projects) && passport.projects.length
    ? passport.projects.slice(0, 3)
    : [
        {
          title: "Customer Insights Dashboard",
          summary: "مشروع يوضح قدرتك على قراءة البيانات وتحويلها إلى قرارات واضحة."
        },
        {
          title: "SQL Reporting Pack",
          summary: "استعلامات وتقارير عملية مرتبطة بتحليل البيانات وتحسين المتابعة."
        }
      ];

  const xp = clampNumber(passport.xp, 620, 80, 1000);
  const journeyProgress = clampNumber(
    passport.learningProgress ?? passport.jobReadiness,
    appliedJobs.length ? 72 : 60,
    25,
    96
  );
  const match = clampNumber(passport.jobReadiness, assessment.dna?.[0]?.value || 82, 55, 96);
  const badges = pickArray(
    passport.badges,
    [],
    ["Explorer", "Focused Learner", "Career Starter"]
  ).slice(0, 4);

  const nextFocus = normalizeGapLabel(gaps[0] || skills[0] || "Python");
  const hasApplications = appliedJobs.length > 0;
  const hasSavedJobs = savedJobs.length > 0;

  const primaryAction = hasApplications
    ? { href: "smart-jobs.html", label: "تابع التقديمات والفرص" }
    : { href: "learning-path.html", label: "ابدأ خطة التعلم" };

  const nextStepAction = hasApplications
    ? { href: "learning-path.html", label: "راجع خطة التعلم" }
    : { href: "learning-path.html", label: "ابدأ الخطوة التالية" };

  const secondaryAction = hasSavedJobs
    ? { href: "smart-jobs.html", label: "راجع الوظائف المحفوظة" }
    : { href: "talent-dna.html", label: "راجع Talent DNA" };

  return {
    fullName,
    firstName,
    avatar,
    xp,
    match,
    journeyProgress,
    trackLabel,
    skills,
    gaps: gaps.slice(0, 4),
    projects,
    badges,
    appliedJobs,
    savedJobs,
    primaryAction,
    nextStepAction,
    secondaryAction,
    levelBadge: getLevelBadge(xp),
    welcomeTag: hasApplications ? "On Track" : "Welcome Back",
    snapshotTitle: `المسار الأقرب لك الآن: ${trackLabel}`,
    snapshotCopy:
      assessment.copy ||
      `الصورة الحالية تشير إلى أنك أقرب لمسار ${trackLabel} لأن لديك نقاط قوة واضحة في ${strengths
        .slice(0, 2)
        .join(" و")}.`,
    welcomeCopy: hasApplications
      ? `أنت تتحرك بشكل جيد. عندك ${appliedJobs.length} تقديمات تحتاج متابعة، وأفضل خطوة الآن هي رفع جودة بروفايلك ومهارة واحدة أساسية.`
      : `الصورة أصبحت أوضح. المطلوب الآن بسيط: طوّر مهارة أساسية، حدّث بروفايلك، ثم ابدأ التقديم على الفرص المناسبة.`,
    sidebarNote: hasSavedJobs
      ? `عندك ${savedJobs.length} وظائف محفوظة. اجعل الخطوة التالية هي تقوية ${nextFocus} ثم ارجع للتقديم.`
      : `أنهيت التحليل. الخطوة الأهم الآن هي تقوية ${nextFocus} ثم بناء دليل عملي على مستواك.`,
    nextStepTitle: `طوّر ${nextFocus}`,
    nextStepCopy: assessment.next || `هذه هي الخطوة الأقرب التي سترفع فرصك داخل مسار ${trackLabel}.`,
    todayFocusCopy: `لو ستعمل شيئًا واحدًا اليوم، اجعله ${nextFocus} لأنها أقصر خطوة تربطك بفرص أفضل.`,
    journeyActiveCopy: hasApplications
      ? "أنت بدأت التقديم بالفعل. ركّز الآن على رفع الجودة ومتابعة الفرص المناسبة."
      : `دلوقتي ركّز على تطوير ${nextFocus} ثم أضف مشروعًا أو إنجازًا صغيرًا يدعم بروفايلك.`,
    timeline: buildTimeline(passport, assessment, appliedJobs, nextFocus),
    strengths
  };
}

function buildTimeline(passport, assessment, appliedJobs, nextFocus) {
  const timeline = [];

  if (assessment.careerPath || assessment.fullTitle) {
    timeline.push({
      title: "تم تحديد مسارك",
      copy: cleanTrackLabel(assessment.careerPath || assessment.fullTitle)
    });
  }

  if (Array.isArray(passport.completedSteps) && passport.completedSteps.length) {
    timeline.push({
      title: "تم تحديث بروفايلك",
      copy: `أنهيت ${passport.completedSteps.length} خطوات داخل الرحلة`
    });
  }

  if (appliedJobs.length) {
    const lastApplied = appliedJobs[appliedJobs.length - 1];
    timeline.push({
      title: "بدأت التقديم على فرص",
      copy: `آخر تقديم كان على ${lastApplied.title || "فرصة مناسبة"}`
    });
  }

  if (!timeline.length) {
    timeline.push(
      {
        title: "بدأت الرحلة",
        copy: "أنشأت بروفايلك وحددت الاتجاه الأقرب لك."
      },
      {
        title: "الخطوة الحالية",
        copy: `ركّز الآن على ${nextFocus} ثم انتقل إلى خطة التعلم.`
      }
    );
  }

  if (timeline.length < 4) {
    timeline.push({
      title: "الخطوة القادمة",
      copy: `أضف دليلًا عمليًا على ${nextFocus} داخل بروفايلك أو Passport.`
    });
  }

  return timeline.slice(0, 4);
}

function ensureNotifications(profile) {
  const existing = readJson(NOTIFICATIONS_KEY, []);
  const defaults = [
    {
      id: "step-focus",
      title: "الخطوة التالية واضحة",
      message: `${profile.nextStepTitle} هي أسرع خطوة ترفع فرصك حاليًا.`,
      read: false
    },
    {
      id: "jobs-snapshot",
      title: "الفرص المناسبة لك",
      message: profile.appliedJobs.length
        ? `أنت تتابع ${profile.appliedJobs.length} تقديمات بالفعل.`
        : "في فرص مناسبة لك جاهزة للمراجعة داخل Smart Jobs.",
      read: false
    },
    {
      id: "passport-reminder",
      title: "حدّث Passport",
      message: "أي مهارة أو مشروع جديد سيقوّي صورتك أمام الشركات.",
      read: existing.some((item) => item.id === "passport-reminder")
    }
  ];

  const merged = defaults.map((item) => existing.find((current) => current.id === item.id) || item);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(merged));
  return merged;
}

function renderNotifications(notifications) {
  const unread = notifications.filter((item) => !item.read).length;
  const trigger = document.getElementById("studentNotificationsTrigger");
  const count = document.getElementById("studentNotificationCount");
  const topbarList = document.getElementById("studentNotificationsList");
  const feed = document.getElementById("studentNotificationFeed");

  if (trigger) {
    trigger.setAttribute("data-badge", String(unread));
  }

  if (count) {
    count.textContent = String(unread);
  }

  renderNotificationList(topbarList, notifications, "dropdown-note");
  renderNotificationList(feed, notifications, "notification-item");
}

function renderNotificationList(container, items, className) {
  if (!container) return;

  container.replaceChildren(
    ...items.map((item) => {
      const article = document.createElement("article");
      article.className = className;

      const strong = document.createElement("strong");
      strong.textContent = item.title;

      const span = document.createElement("span");
      span.textContent = item.message;

      article.append(strong, span);
      return article;
    })
  );
}

function renderUpdates(profile, notifications) {
  const updates = document.getElementById("studentUpdatesList");
  if (!updates) return;

  const items = [
    { title: "Current Path", copy: profile.trackLabel },
    { title: "Next Action", copy: profile.nextStepTitle },
    {
      title: "Notifications",
      copy: `${notifications.filter((item) => !item.read).length} unread`
    }
  ];

  updates.replaceChildren(
    ...items.map((item) => {
      const article = document.createElement("article");
      article.className = "update-item";

      const strong = document.createElement("strong");
      strong.textContent = item.title;

      const span = document.createElement("span");
      span.textContent = item.copy;

      article.append(strong, span);
      return article;
    })
  );
}

function renderSkillList(id, items, hint, isGap = false) {
  const el = document.getElementById(id);
  if (!el) return;

  el.replaceChildren(
    ...items.map((item) => {
      const article = document.createElement("article");
      article.className = isGap ? "gap-chip" : "skill-chip";

      const strong = document.createElement("strong");
      strong.textContent = item;

      const span = document.createElement("span");
      span.textContent = hint;

      article.append(strong, span);
      return article;
    })
  );
}

function renderTimeline(items) {
  const el = document.getElementById("studentGrowthChart");
  if (!el) return;

  el.replaceChildren(
    ...items.map((item) => {
      const article = document.createElement("article");
      article.className = "timeline-item";

      const strong = document.createElement("strong");
      strong.textContent = item.title;

      const span = document.createElement("span");
      span.textContent = item.copy;

      article.append(strong, span);
      return article;
    })
  );
}

function renderBadges(items) {
  const el = document.getElementById("studentBadgeSummary");
  if (!el) return;

  el.replaceChildren(
    ...items.slice(0, 4).map((item) => {
      const article = document.createElement("article");
      article.className = "badge-card";

      const strong = document.createElement("strong");
      strong.textContent = item;

      const span = document.createElement("span");
      span.textContent = "Unlocked in your journey";

      article.append(strong, span);
      return article;
    })
  );
}

function renderProjects(projects) {
  const el = document.getElementById("projectsGrid");
  if (!el) return;

  el.replaceChildren(
    ...projects.map((project) => {
      const article = document.createElement("article");
      article.className = "project-card";

      const strong = document.createElement("strong");
      strong.textContent = project.title || "Project";

      const meta = document.createElement("span");
      meta.className = "project-meta";
      meta.textContent = project.summary || "Project added to your profile.";

      article.append(strong, meta);
      return article;
    })
  );
}

function renderJobStats(profile) {
  const el = document.getElementById("jobsStats");
  if (!el) return;

  const items = [
    { title: "Applied Jobs", value: profile.appliedJobs.length },
    { title: "Saved Jobs", value: profile.savedJobs.length },
    { title: "Current Match", value: `${profile.match}%` },
    { title: "Readiness", value: `${profile.journeyProgress}%` }
  ];

  el.replaceChildren(
    ...items.map((item) => {
      const article = document.createElement("article");
      article.className = "jobs-stat-card";

      const strong = document.createElement("strong");
      strong.textContent = String(item.value);

      const span = document.createElement("span");
      span.textContent = item.title;

      article.append(strong, span);
      return article;
    })
  );
}

function setupNotificationCenter() {
  const fab = document.getElementById("studentNotificationFab");
  const panel = document.getElementById("studentNotificationPanel");
  const markAll = document.getElementById("studentMarkAllRead");

  fab?.addEventListener("click", (event) => {
    event.stopPropagation();
    panel?.classList.toggle("hidden");
  });

  markAll?.addEventListener("click", () => {
    const updated = readJson(NOTIFICATIONS_KEY, []).map((item) => ({ ...item, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    renderNotifications(updated);
    renderUpdatesFromState(updated);
    showToast("تم تعليم كل الإشعارات كمقروءة.");
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".notification-center")) return;
    panel?.classList.add("hidden");
  });
}

function renderUpdatesFromState(notifications) {
  const passport = readJson(PASSPORT_KEY, {});
  const assessment = readJson(ASSESSMENT_KEY, {});
  const appliedJobs = readJson(APPLIED_JOBS_KEY, []);
  const savedJobs = readJson(SAVED_JOBS_KEY, []);
  const profile = buildDashboardProfile(passport, assessment, appliedJobs, savedJobs);
  renderUpdates(profile, notifications);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
}

function setProgress(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = `${Math.max(0, Math.min(value, 100))}%`;
}

function setActionLink(id, action) {
  const el = document.getElementById(id);
  if (!el || !action) return;
  el.href = action.href;
  el.textContent = action.label;
}

function pickArray(primary, secondary, fallback) {
  if (Array.isArray(primary) && primary.length) return primary;
  if (Array.isArray(secondary) && secondary.length) return secondary;
  return fallback;
}

function clampNumber(value, fallback, min, max) {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return Math.min(max, Math.max(min, numericValue));
  }
  return fallback;
}

function cleanTrackLabel(value) {
  return String(value || "Data Analysis")
    .replace(/^مجالك الأقرب:\s*/i, "")
    .replace(/^أنت أقرب إلى\s*/i, "")
    .replace(/^أنت مناسب لـ?\s*/i, "")
    .replace(/\s*بنسبة\s*\d+%/i, "")
    .trim();
}

function normalizeGapLabel(value) {
  return String(value || "Python")
    .replace(/^تعلم\s+/i, "")
    .replace(/^طوّر\s+/i, "")
    .trim();
}

function getLevelBadge(xp) {
  if (xp >= 900) return "Level 4 - Builder";
  if (xp >= 700) return "Level 3 - Advancer";
  if (xp >= 450) return "Level 2 - Explorer";
  return "Level 1 - Starter";
}

function showToast(message) {
  const toast = document.getElementById("studentDashboardToast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
