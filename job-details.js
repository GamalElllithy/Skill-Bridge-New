const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const SELECTED_JOB_KEY = "skillbridgeSelectedJobId";

const JOBS = [
  {
    id: "job-1",
    title: "Junior Data Analyst",
    company: "TechNova",
    logo: "TN",
    location: "Cairo / Remote",
    workType: "Internship",
    description: [
      "تحليل البيانات وبناء تقارير واضحة لفريق المنتج والإدارة.",
      "استخراج insights تساعد الفريق على اتخاذ قرارات أسرع.",
      "المساهمة في dashboards وتقارير أداء دورية."
    ],
    responsibilities: [
      "Clean and organize datasets",
      "Build clear reports and charts",
      "Support product and business teams with insights"
    ],
    coreSkills: ["Python", "SQL", "Excel", "Visualization"],
    optionalSkills: ["Power BI", "Storytelling", "Statistics"],
    gapsHelp: {
      SQL: "Complete SQL path to increase match by 10%",
      Visualization: "Build 1 dashboard to improve your portfolio strength",
      "API Integration": "Learn API basics to connect real data sources"
    },
    relatedJobs: [
      { title: "BI Intern", match: 76, why: "Strong analytical fit with reporting potential" },
      { title: "Data Intern", match: 82, why: "Closer to your current level and projects" },
      { title: "Reporting Associate", match: 72, why: "You already have visualization basics" }
    ]
  },
  {
    id: "job-2",
    title: "BI Intern",
    company: "InsightFlow",
    logo: "IF",
    location: "Cairo",
    workType: "Full-time",
    description: [
      "مساعدة فريق BI في بناء تقارير شهرية ومتابعة KPIs.",
      "تحويل البيانات الخام إلى dashboards يمكن الاعتماد عليها.",
      "المساهمة في تحليل الأداء وإظهار الاتجاهات."
    ],
    responsibilities: [
      "Support KPI dashboards",
      "Prepare reports for business teams",
      "Track trends and anomalies"
    ],
    coreSkills: ["Excel", "SQL", "Power BI", "Reporting"],
    optionalSkills: ["Storytelling", "Automation"],
    gapsHelp: {
      "Power BI": "Build one BI dashboard to increase match by 8%",
      SQL: "Practice intermediate SQL queries",
      Reporting: "Learn how to present insights clearly"
    },
    relatedJobs: [
      { title: "Junior Data Analyst", match: 78, why: "Very close to your current analysis track" },
      { title: "Reporting Analyst", match: 74, why: "Your visualization progress helps here" }
    ]
  },
  {
    id: "job-3",
    title: "Product Operations Intern",
    company: "BridgeLab",
    logo: "BL",
    location: "Alexandria / Hybrid",
    workType: "Internship",
    description: [
      "تنسيق عمليات المنتج وتحليل الأداء ومتابعة التنفيذ.",
      "المساعدة في ترتيب الأولويات وإعداد updates واضحة.",
      "الربط بين التنفيذ والمتابعة العملية."
    ],
    responsibilities: [
      "Track tasks and team execution",
      "Support reporting and follow-up",
      "Coordinate with multiple stakeholders"
    ],
    coreSkills: ["Communication", "Excel", "Ownership", "Reporting"],
    optionalSkills: ["Operations Thinking", "Coordination"],
    gapsHelp: {
      Reporting: "Learn reporting basics to improve trust in your readiness",
      Ownership: "Build one operations case study",
      Communication: "Practice structured updates and presentation"
    },
    relatedJobs: [
      { title: "Operations Intern", match: 73, why: "Your organized work style fits the role" },
      { title: "Project Coordinator", match: 69, why: "Good next step if you improve communication" }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderPage();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("detailsTopbar");
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
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function renderPage() {
  const job = getCurrentJob();
  const passport = getPassport();
  const assessment = getAssessment();
  const analysis = analyzeJob(job, passport, assessment);

  replaceText("jobTitle", job.title);
  replaceText("companyLine", `${job.company} • ${job.location} • ${job.workType}`);
  replaceText("matchValue", `${analysis.match}%`);
  replaceText("whyMatchCopy", analysis.whyMatch);
  replaceText("summaryStickyCopy", analysis.summary);
  replaceText("feedbackLine", analysis.feedback);

  const logo = document.getElementById("companyLogo");
  if (logo) logo.textContent = job.logo;

  const ring = document.getElementById("matchRing");
  if (ring) {
    const circumference = 301.59;
    const offset = circumference - (circumference * analysis.match) / 100;
    ring.style.strokeDashoffset = `${offset}`;
    ring.style.stroke = analysis.match >= 80 ? "var(--success)" : analysis.match >= 60 ? "var(--warning)" : "var(--danger)";
  }

  renderMatchAccordion(analysis);
  renderSkillsMap(job, analysis);
  renderDescription(job);
  renderTips(analysis);
  renderAnalytics(analysis);
  renderOtherJobs(job);
  renderRoadmap(analysis);
  renderTimeline(analysis);
  renderBadges(analysis);
}

function analyzeJob(job, passport, assessment) {
  const skills = normalizeSkills([...(passport.skills || []), ...(assessment.strengths || [])]);
  const learningProgress = Number(passport.learningProgress || 40);
  const projectsCount = Array.isArray(passport.projects) ? passport.projects.length : 0;
  const savedJobs = Array.isArray(passport.savedJobs) ? passport.savedJobs.length : 0;
  const applications = Array.isArray(passport.applications) ? passport.applications.length : 0;

  const skillsMatch = Math.round((job.coreSkills.filter((skill) => skills.includes(skill.toLowerCase())).length / job.coreSkills.length) * 100);
  const experienceMatch = Math.min(95, 45 + projectsCount * 14 + Math.round((passport.xp || 0) / 140));
  const projectsMatch = Math.min(95, 40 + projectsCount * 20);
  const learningMatch = Math.min(95, learningProgress + 15);
  const match = Math.round((skillsMatch + experienceMatch + projectsMatch + learningMatch) / 4);

  const missing = job.coreSkills.filter((skill) => !skills.includes(skill.toLowerCase()));
  const strengths = job.coreSkills.filter((skill) => skills.includes(skill.toLowerCase()));

  return {
    match,
    skillsMatch,
    experienceMatch,
    projectsMatch,
    learningMatch,
    missing,
    strengths,
    whyMatch: `You match ${match}% of required skills. Your strong points: ${strengths.slice(0, 3).join(", ") || "solid fundamentals"}. Skills to improve: ${missing.slice(0, 2).join(", ") || "project depth"}.`,
    summary: strengths.length
      ? `Strong in ${strengths.slice(0, 2).join(" and ")}, and very close to this role if you improve ${missing[0] || "one more area"}.`
      : "This role is possible, but it needs a stronger skill foundation before applying with confidence.",
    feedback: match >= 80
      ? "You’re almost ready for this role!"
      : `Complete ${missing[0] || "the next skill"} to reach around ${Math.min(95, match + 10)}% Match!`,
    savedJobs,
    applications
  };
}

function renderMatchAccordion(analysis) {
  const container = document.getElementById("matchAccordion");
  if (!container) return;

  const items = [
    { title: "Skills Match ✅", value: analysis.skillsMatch, copy: "المهارات الأساسية الحالية عندك مقارنة بمتطلبات الوظيفة." },
    { title: "Experience Match ⚡", value: analysis.experienceMatch, copy: "يعتمد على المشاريع وXP والتعرض العملي." },
    { title: "Projects Match 🎯", value: analysis.projectsMatch, copy: "يقيس قوة portfolio الحالي وقدرته على دعم التقديم." },
    { title: "Learning Path Contribution 📈", value: analysis.learningMatch, copy: "كل خطوة تتعلمها ترفع فرصتك في هذه الوظيفة." }
  ];

  container.innerHTML = items.map((item, index) => `
    <article class="accordion-item ${index === 0 ? "active" : ""}">
      <div class="accordion-header">
        <strong>${item.title}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="accordion-body">${item.copy}</div>
    </article>
  `).join("");

  wireAccordion(container);
}

function renderSkillsMap(job, analysis) {
  const container = document.getElementById("skillsMap");
  if (!container) return;

  const skills = job.coreSkills.concat(job.optionalSkills.map((skill) => `${skill} (Optional)`));
  container.innerHTML = skills.map((skill) => {
    const baseSkill = skill.replace(" (Optional)", "");
    const isCore = !skill.includes("(Optional)");
    const hasSkill = analysis.strengths.includes(baseSkill);
    const studentLevel = hasSkill ? Math.min(92, analysis.match + 8) : Math.max(35, analysis.match - 22);
    const requiredLevel = isCore ? 82 : 60;
    const hint = job.gapsHelp[baseSkill] || "Complete the suggested learning path to improve this area";

    return `
      <article class="skill-card">
        <div class="skill-head">
          <strong>${skill}</strong>
          <span>${hasSkill ? "Core Match" : "Gap"}</span>
        </div>
        <div class="skill-bars">
          <div>
            <div class="skill-labels"><span>Student Level</span><span>${studentLevel}%</span></div>
            <div class="skill-track"><span style="width:${studentLevel}%"></span></div>
          </div>
          <div>
            <div class="skill-labels"><span>Job Required</span><span>${requiredLevel}%</span></div>
            <div class="skill-track"><span style="width:${requiredLevel}%"></span></div>
          </div>
        </div>
        <p class="skill-hint">${hint}</p>
      </article>
    `;
  }).join("");
}

function renderDescription(job) {
  const container = document.getElementById("descriptionAccordion");
  if (!container) return;

  const items = [
    { title: "Job Description", body: job.description.join(" • ") },
    { title: "Responsibilities", body: job.responsibilities.join(" • ") },
    { title: "Core Skills", body: job.coreSkills.join(" • ") }
  ];

  container.innerHTML = items.map((item, index) => `
    <article class="accordion-item ${index === 0 ? "active" : ""}">
      <div class="accordion-header">
        <strong>${item.title}</strong>
        <span>Open</span>
      </div>
      <div class="accordion-body">${item.body}</div>
    </article>
  `).join("");

  wireAccordion(container);
}

function renderTips(analysis) {
  const container = document.getElementById("tipsList");
  if (!container) return;

  const tips = [
    `Learn ${analysis.missing[0] || "one additional skill"} to increase your match quickly.`,
    "Build one practical project related to this job.",
    "Keep your Talent Passport updated to show stronger readiness."
  ];

  container.innerHTML = tips.map((tip) => `
    <article class="tips-card">
      <strong>Recommended Tip</strong>
      <p>${tip}</p>
    </article>
  `).join("");
}

function renderAnalytics(analysis) {
  const container = document.getElementById("analyticsList");
  if (!container) return;

  const items = [
    { label: "Match Score", value: `${analysis.match}%` },
    { label: "Saved Jobs", value: `${analysis.savedJobs}` },
    { label: "Applied Jobs", value: `${analysis.applications}` }
  ];

  container.innerHTML = items.map((item) => `
    <article class="analytics-item">
      <div class="analytics-head">
        <strong>${item.label}</strong>
        <span>${item.value}</span>
      </div>
    </article>
  `).join("");
}

function renderOtherJobs(job) {
  const container = document.getElementById("otherJobs");
  if (!container) return;

  container.innerHTML = job.relatedJobs.map((item) => `
    <article class="other-job-card">
      <div class="other-job-head">
        <strong>${item.title}</strong>
        <span>${item.match}% Match</span>
      </div>
      <p>${item.why}</p>
    </article>
  `).join("");
}

function renderRoadmap(analysis) {
  const container = document.getElementById("actionPlan");
  if (!container) return;

  const plan = [
    { title: `Complete ${analysis.missing[0] || "the next path"}`, gain: "+10% Match" },
    { title: "Build Project X", gain: "+7% Match" },
    { title: "Practice API / reporting basics", gain: "+5% Match" }
  ];

  container.innerHTML = plan.map((item) => `
    <article class="roadmap-card">
      <div class="roadmap-head">
        <strong>${item.title}</strong>
        <span>${item.gain}</span>
      </div>
      <p>خطوة مرئية وواضحة ترفع فرصك بدل التخمين.</p>
    </article>
  `).join("");
}

function renderTimeline(analysis) {
  const container = document.getElementById("timelineChart");
  if (!container) return;

  const current = analysis.match;
  const next = Math.min(95, current + 8);
  const month = Math.min(98, next + 9);
  const items = [
    { label: "Current Skills", value: current },
    { label: "After Learning Path", value: next },
    { label: "After Project + Apply", value: month }
  ];

  container.innerHTML = items.map((item) => `
    <article class="timeline-point">
      <strong>${item.label}</strong>
      <div class="skill-track"><span style="width:${item.value}%"></span></div>
      <span class="timeline-note">${item.value}% projected match</span>
    </article>
  `).join("");
}

function renderBadges(analysis) {
  const container = document.getElementById("badgeRow");
  if (!container) return;

  const badges = [
    analysis.match >= 80 ? "High Match" : "Almost Ready",
    "Skill Match",
    "Job Focused"
  ];

  container.innerHTML = badges.map((badge) => `<span class="badge-pill">${badge}</span>`).join("");
}

function wireAccordion(container) {
  container.querySelectorAll(".accordion-item").forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header?.addEventListener("click", () => item.classList.toggle("active"));
  });
}

function setupActions() {
  ["applyNowBtn", "stickyApplyBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", applyCurrentJob);
  });

  document.getElementById("saveJobBtn")?.addEventListener("click", saveCurrentJob);
  document.getElementById("trackJobBtn")?.addEventListener("click", () => showToast("تم تفعيل تتبع الوظيفة."));
  document.getElementById("shareJobBtn")?.addEventListener("click", shareCurrentJob);
}

function applyCurrentJob() {
  const job = getCurrentJob();
  const payload = buildStoredJobPayload(job);
  const list = getStoredList(APPLIED_JOBS_KEY);
  if (!list.some((item) => item.id === payload.id)) {
    list.push({
      ...payload,
      status: "Pending Review",
      appliedAt: new Date().toISOString()
    });
    setStoredList(APPLIED_JOBS_KEY, list);
    syncPassport("applications", list);
  }
  showToast("تم التقديم بنجاح 🎉");
  setTimeout(() => {
    window.location.href = "applied-jobs.html?tab=applied";
  }, 900);
}

function saveCurrentJob() {
  const job = getCurrentJob();
  const payload = buildStoredJobPayload(job);
  const list = getStoredList(SAVED_JOBS_KEY);
  const exists = list.some((item) => item.id === payload.id);
  const next = exists
    ? list.filter((item) => item.id !== payload.id)
    : [...list, { ...payload, savedAt: new Date().toISOString() }];
  setStoredList(SAVED_JOBS_KEY, next);
  syncPassport("savedJobs", next);
  showToast(exists ? "تمت إزالة الوظيفة من المحفوظة." : "تم حفظ الوظيفة.");
  if (!exists) {
    setTimeout(() => {
      window.location.href = "applied-jobs.html?tab=saved";
    }, 900);
  }
}

function shareCurrentJob() {
  const url = window.location.href;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("تم نسخ رابط الوظيفة.");
    }).catch(() => showToast("تعذر نسخ الرابط."));
    return;
  }
  showToast("تعذر نسخ الرابط.");
}

function getCurrentJob() {
  const selected = window.localStorage.getItem(SELECTED_JOB_KEY) || "job-1";
  return JOBS.find((job) => job.id === selected) || JOBS[0];
}

function getPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getAssessment() {
  try {
    return JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function syncPassport(key, value) {
  const passport = getPassport();
  if (!passport.name) return;
  passport[key] = value;
  passport.lastSeenAt = new Date().toISOString();
  if (key === "applications") {
    passport.badges = Array.from(new Set([...(passport.badges || []), "Applied Job"]));
    passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 70);
    passport.xp = Math.max(Number(passport.xp || 0), 180) + 20;
  }
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function buildStoredJobPayload(job) {
  const analysis = analyzeJob(job, getPassport(), getAssessment());
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    match: analysis.match,
    tagsLabel: [job.workType, job.location]
  };
}

function getStoredList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function setStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeSkills(items) {
  return items.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(message) {
  const toast = document.getElementById("detailsToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
