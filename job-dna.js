const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const ROLE_KEY = "skillbridgeUserRole";
const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";
const NOTES_KEY = "skillbridgeRecruiterNotes";

const JOB_LIBRARY = [
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    company: "PixelForge",
    location: "Remote",
    level: "Junior",
    requiredSkills: [
      { name: "HTML", priority: "core" },
      { name: "CSS", priority: "core" },
      { name: "JavaScript", priority: "core" },
      { name: "React", priority: "high" }
    ],
    softSkills: ["Communication", "Problem Solving", "Ownership"],
    projectsNeed: 2,
    summary: "Frontend role focused on building fast and clean product interfaces.",
    similarJobs: [
      { title: "Frontend Intern", matchBoost: 8 },
      { title: "UI Engineer", matchBoost: 5 }
    ],
    recommendations: [
      { label: "Complete React Path", gain: 10 },
      { label: "Build 1 Project", gain: 7 },
      { label: "Practice API Integration", gain: 5 }
    ]
  },
  {
    id: "data-analyst",
    title: "Junior Data Analyst",
    company: "TechNova",
    location: "Cairo / Remote",
    level: "Junior",
    requiredSkills: [
      { name: "Python", priority: "core" },
      { name: "SQL", priority: "high" },
      { name: "Excel", priority: "core" },
      { name: "Visualization", priority: "high" }
    ],
    softSkills: ["Analytical Thinking", "Communication", "Accuracy"],
    projectsNeed: 2,
    summary: "Data role focused on turning business data into clear actionable insights.",
    similarJobs: [
      { title: "Data Intern", matchBoost: 7 },
      { title: "BI Intern", matchBoost: 5 }
    ],
    recommendations: [
      { label: "Complete SQL Path", gain: 10 },
      { label: "Build 1 Dashboard", gain: 7 },
      { label: "Practice Business Storytelling", gain: 4 }
    ]
  },
  {
    id: "product-ops",
    title: "Product Operations Intern",
    company: "BridgeLab",
    location: "Alexandria / Hybrid",
    level: "Internship",
    requiredSkills: [
      { name: "Excel", priority: "core" },
      { name: "Communication", priority: "high" },
      { name: "Ownership", priority: "high" },
      { name: "Reporting", priority: "medium" }
    ],
    softSkills: ["Speed", "Problem Solving", "Follow-up"],
    projectsNeed: 1,
    summary: "Operations role for someone who can organize, track, and improve execution.",
    similarJobs: [
      { title: "Operations Intern", matchBoost: 8 },
      { title: "Project Coordinator", matchBoost: 4 }
    ],
    recommendations: [
      { label: "Practice Reporting", gain: 8 },
      { label: "Build 1 Execution Case", gain: 6 },
      { label: "Improve Stakeholder Communication", gain: 4 }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderJobDna();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("jobTopbar");
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

function renderJobDna() {
  const passport = getPassport();
  const assessment = getAssessment();
  const currentJob = getCurrentJob();
  const analysis = analyzeMatch(currentJob, passport, assessment);

  renderHero(currentJob, analysis);
  renderPicker(currentJob.id);
  renderBreakdown(analysis.breakdown);
  renderJobStructure(currentJob);
  renderComparison(analysis.comparison);
  renderGaps(analysis.gaps);
  renderBoostPlan(currentJob, analysis.overall);
  renderGrowth(analysis.overall, currentJob.recommendations);
  renderMatchReady(currentJob, analysis.overall);
  renderRecruiterSections(currentJob, analysis);
}

function renderHero(job, analysis) {
  replaceText("jobTitle", job.title);
  replaceText("jobCompany", `${job.company} • ${job.location}`);
  replaceText("overallMatch", `${analysis.overall}%`);
  replaceText("quickSummary", analysis.quickSummary);
  replaceText("whyMatchCopy", analysis.aiExplanation);
  replaceText("decisionTitle", analysis.decision.title);
  replaceText("decisionCopy", analysis.decision.copy);
  replaceText("timeToHire", analysis.timeToHire);
  replaceText("aiRecommendation", analysis.aiRecommendation);

  const ring = document.getElementById("matchRing");
  if (ring) {
    const circumference = 301.59;
    const offset = circumference - (circumference * analysis.overall) / 100;
    ring.style.strokeDashoffset = `${offset}`;
  }

  const decisionBox = document.getElementById("decisionBox");
  if (decisionBox) {
    decisionBox.classList.remove("strong", "medium", "low");
    decisionBox.classList.add(analysis.decision.className);
  }
}

function renderPicker(activeId) {
  const picker = document.getElementById("jobPicker");
  if (!picker) return;

  picker.innerHTML = JOB_LIBRARY.map((job) => `
    <button class="picker-btn ${job.id === activeId ? "active" : ""}" type="button" data-job-pick="${job.id}">
      ${job.title}
    </button>
  `).join("");

  picker.querySelectorAll("[data-job-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-job-pick");
      window.localStorage.setItem(JOB_SELECTION_KEY, jobId);
      renderJobDna();
    });
  });
}

function renderBreakdown(items) {
  const container = document.getElementById("breakdownList");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <article class="breakdown-item">
      <div class="breakdown-item-head">
        <strong>${item.label}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="bar-track"><span style="width:${item.value}%"></span></div>
    </article>
  `).join("");
}

function renderJobStructure(job) {
  setChipList("requiredSkills", job.requiredSkills.map((skill) => skill.name), "dna-chip");
  setChipList("softSkills", job.softSkills, "soft-chip");
  replaceText("jobLevel", job.level);
}

function renderComparison(rows) {
  const container = document.getElementById("comparisonRows");
  if (!container) return;

  container.innerHTML = rows.map((row) => `
    <div class="comparison-row">
      <strong>${row.skill}</strong>
      <span class="${row.hasSkill ? "yes" : "no"}">${row.hasSkill ? "✅" : "❌"}</span>
      <span>✅</span>
      <span class="${row.confidence >= 70 ? "confidence-strong" : "confidence-weak"}">${row.confidence}%</span>
    </div>
  `).join("");
}

function renderGaps(gaps) {
  const container = document.getElementById("gapGrid");
  if (!container) return;

  if (!gaps.length) {
    container.innerHTML = `
      <article class="gap-card medium">
        <strong>جاهز تقريبًا</strong>
        <p>لا توجد gaps حرجة الآن. ركّز على تحسين المشاريع والتقديم.</p>
        <div class="gap-actions">
          <a class="tiny-btn" href="smart-jobs.html">Go To Jobs</a>
        </div>
      </article>
    `;
    return;
  }

  container.innerHTML = gaps.map((gap) => `
    <article class="gap-card ${gap.priority}">
      <strong>${gap.skill}</strong>
      <p>${gap.priority === "high" ? "High Priority" : "Medium Priority"}</p>
      <p>${gap.copy}</p>
      <div class="gap-actions">
        <a class="tiny-btn" href="learning-path.html">Start Learning</a>
      </div>
    </article>
  `).join("");
}

function renderBoostPlan(job, currentMatch) {
  const container = document.getElementById("boostList");
  if (!container) return;

  let projected = currentMatch;
  container.innerHTML = job.recommendations.map((item) => {
    projected = Math.min(99, projected + item.gain);
    return `
      <article class="boost-card">
        <div class="boost-head">
          <strong>${item.label}</strong>
          <span class="boost-gain">+${item.gain}%</span>
        </div>
        <p>بعد الخطوة دي قد تصل إلى ${projected}% match</p>
      </article>
    `;
  }).join("");
}

function renderGrowth(currentMatch, recommendations) {
  const container = document.getElementById("growthProjection");
  if (!container) return;

  const week = Math.min(99, currentMatch + (recommendations[0]?.gain || 8));
  const month = Math.min(99, week + (recommendations[1]?.gain || 7) + (recommendations[2]?.gain || 5));

  container.innerHTML = `
    <article class="growth-card"><strong>دلوقتي</strong><span class="growth-value">${currentMatch}%</span></article>
    <article class="growth-card"><strong>بعد أسبوع</strong><span class="growth-value">${week}%</span></article>
    <article class="growth-card"><strong>بعد شهر</strong><span class="growth-value">${month}%</span></article>
  `;
}

function renderMatchReady(job, currentMatch) {
  const container = document.getElementById("matchReadyJobs");
  if (!container) return;

  container.innerHTML = job.similarJobs.map((item) => `
    <article class="match-ready-card">
      <strong>${item.title}</strong>
      <p>${Math.min(99, currentMatch + item.matchBoost)}% Match</p>
      <a href="smart-jobs.html">View Jobs</a>
    </article>
  `).join("");
}

function renderRecruiterSections(job, analysis) {
  const isCompany = window.localStorage.getItem(ROLE_KEY) === "company";
  toggleHidden("candidateRankingPanel", !isCompany);
  toggleHidden("redFlagsPanel", !isCompany);
  toggleHidden("notesPanel", !isCompany);
  if (!isCompany) return;

  const ranking = document.getElementById("candidateRanking");
  const flags = document.getElementById("redFlags");
  const notes = document.getElementById("recruiterNotes");

  if (ranking) {
    ranking.innerHTML = buildCandidateRanking(job).map((item) => `
      <article class="ranking-item">
        <div>
          <strong>${item.name}</strong>
          <span>${item.copy}</span>
        </div>
        <span class="ranking-pill">${item.match}%</span>
      </article>
    `).join("");
  }

  if (flags) {
    const items = analysis.redFlags.length ? analysis.redFlags : ["No critical red flags"];
    flags.innerHTML = items.map((item) => `
      <article class="flag-item">
        <strong>${item}</strong>
        <span>راجعها قبل القرار النهائي</span>
      </article>
    `).join("");
  }

  if (notes) {
    notes.value = getRecruiterNotes(job.id);
  }
}

function setupActions() {
  const applyButtons = ["heroApplyBtn", "applyNowBtn"];
  applyButtons.forEach((id) => {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener("click", () => {
      saveAppliedJob(getCurrentJob().id);
      showToast("تم حفظ الوظيفة داخل Applied Jobs.");
      setTimeout(() => {
        window.location.href = "applied-jobs.html";
      }, 900);
    });
  });

  const saveBtn = document.getElementById("saveJobBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      toggleSavedJob(getCurrentJob().id);
      showToast("تم تحديث حالة الحفظ لهذه الوظيفة.");
    });
  }

  const improveBtn = document.getElementById("improveMatchBtn");
  if (improveBtn) {
    improveBtn.addEventListener("click", () => {
      window.location.href = "learning-path.html";
    });
  }

  const notesBtn = document.getElementById("saveNotesBtn");
  if (notesBtn) {
    notesBtn.addEventListener("click", () => {
      const jobId = getCurrentJob().id;
      const notes = document.getElementById("recruiterNotes")?.value.trim() || "";
      saveRecruiterNotes(jobId, notes);
      showToast("تم حفظ ملاحظات الشركة.");
    });
  }
}

function analyzeMatch(job, passport, assessment) {
  const userSkills = normalizeSkills([
    ...(passport.skills || []),
    ...(assessment?.strengths || [])
  ]);
  const requiredSkills = job.requiredSkills.map((skill) => skill.name);
  const matchedSkills = requiredSkills.filter((skill) => userSkills.includes(skill.toLowerCase()));
  const skillsMatch = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  const projectsCount = Array.isArray(passport.projects) ? passport.projects.length : 0;
  const experience = Math.min(100, 40 + projectsCount * 20 + Math.floor(Number(passport.xp || 0) / 120));
  const projectsScore = Math.min(100, Math.round((projectsCount / Math.max(job.projectsNeed, 1)) * 100));
  const learningProgress = Number(passport.learningProgress || passport.jobReadiness || 35);
  const overall = Math.round((skillsMatch + experience + projectsScore + learningProgress) / 4);

  const comparison = requiredSkills.map((skill) => ({
    skill,
    hasSkill: userSkills.includes(skill.toLowerCase()),
    confidence: userSkills.includes(skill.toLowerCase()) ? Math.min(96, 64 + Math.floor((passport.jobReadiness || 50) / 2)) : 40
  }));

  const gaps = requiredSkills
    .filter((skill) => !userSkills.includes(skill.toLowerCase()))
    .map((skill, index) => ({
      skill,
      priority: index === 0 ? "high" : "medium",
      copy: index === 0
        ? `هذه المهارة ترفع احتمال قبولك مباشرة في دور ${job.title}.`
        : `إضافتها ستقوّي الثقة في جاهزيتك وتزيد سرعة القرار.`
    }));

  const breakdown = [
    { label: "Skills Match", value: skillsMatch },
    { label: "Experience", value: experience },
    { label: "Projects", value: projectsScore },
    { label: "Learning Progress", value: learningProgress }
  ];

  const quickSummary = `Candidate matches ${overall}% of requirements, strong in ${matchedSkills.slice(0, 2).join(" and ") || "core basics"}, needs ${gaps[0]?.skill || "project depth"}.`;
  const aiExplanation = `أنت مناسب للوظيفة دي لأنك تمتلك مهارات قوية في ${matchedSkills.slice(0, 2).join(" و") || "الأساسيات"}، لكن تحتاج تحسين ${gaps.map((gap) => gap.skill).join(" و") || "المشاريع العملية"}.`;
  const decision = getDecision(overall, gaps.length);
  const aiRecommendation = overall >= 80
    ? "Recommended to interview now with a practical task."
    : `Recommended to interview after completing ${gaps[0]?.skill || "the next module"}.`;
  const timeToHire = overall >= 85 ? "Ready Now" : overall >= 70 ? "2 Weeks" : "4 Weeks";
  const redFlags = [];

  if (projectsCount === 0) redFlags.push("No real projects yet");
  if (gaps.length >= 2) redFlags.push("Missing key skills for this job");
  if ((passport.learningProgress || 0) < 30) redFlags.push("Low consistency in learning progress");

  return {
    overall,
    breakdown,
    comparison,
    gaps,
    quickSummary,
    aiExplanation,
    decision,
    aiRecommendation,
    timeToHire,
    redFlags
  };
}

function getDecision(match, gapsCount) {
  if (match >= 82 && gapsCount <= 1) {
    return {
      title: "Strong Candidate",
      copy: "جاهز للمقابلة أو للاختبار العملي مباشرة.",
      className: "strong"
    };
  }

  if (match >= 65) {
    return {
      title: "Needs Improvement",
      copy: "واعد جدًا، لكن يحتاج خطوة أو خطوتين قبل قرار نهائي.",
      className: "medium"
    };
  }

  return {
    title: "Not Ready Yet",
    copy: "الوظيفة أعلى من المستوى الحالي، والأفضل تحسين الأساسيات أولًا.",
    className: "low"
  };
}

function buildCandidateRanking(job) {
  const base = [
    { name: "Ahmed", skills: ["HTML", "CSS", "JavaScript", "React"], xp: 1350, progress: 82 },
    { name: "Gamal", skills: (getPassport().skills || []), xp: Number(getPassport().xp || 0), progress: Number(getPassport().jobReadiness || 0) },
    { name: "Sara", skills: ["HTML", "CSS", "JavaScript"], xp: 1020, progress: 72 }
  ];

  return base.map((candidate) => {
    const matched = job.requiredSkills.filter((skill) => normalizeSkills(candidate.skills).includes(skill.name.toLowerCase())).length;
    const match = Math.round(((matched / job.requiredSkills.length) * 60) + Math.min(40, candidate.progress * 0.4));
    return {
      name: candidate.name,
      match,
      copy: match >= 80 ? "جاهز للمقابلة" : "يحتاج خطوة تطوير"
    };
  }).sort((a, b) => b.match - a.match);
}

function getCurrentJob() {
  const selectedId = window.localStorage.getItem(JOB_SELECTION_KEY);
  const fromSaved = getStoredList(SAVED_JOBS_KEY)[0];
  const fromApplied = getStoredList(APPLIED_JOBS_KEY)[0];

  if (selectedId) {
    const selected = JOB_LIBRARY.find((job) => job.id === selectedId);
    if (selected) return selected;
  }

  if (fromApplied) {
    const match = mapStoredJobToLibrary(fromApplied.title);
    if (match) return match;
  }

  if (fromSaved) {
    const match = mapStoredJobToLibrary(fromSaved.title);
    if (match) return match;
  }

  return JOB_LIBRARY[0];
}

function mapStoredJobToLibrary(title) {
  return JOB_LIBRARY.find((job) => job.title.toLowerCase() === String(title || "").toLowerCase());
}

function normalizeSkills(skills) {
  return skills.map((skill) => String(skill).trim().toLowerCase()).filter(Boolean);
}

function setChipList(id, items, className) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = items.map((item) => `<span class="${className}">${item}</span>`).join("");
}

function toggleSavedJob(jobId) {
  const job = JOB_LIBRARY.find((item) => item.id === jobId);
  if (!job) return;
  const saved = getStoredList(SAVED_JOBS_KEY);
  const exists = saved.some((item) => item.id === jobId || item.title === job.title);
  const next = exists
    ? saved.filter((item) => item.id !== jobId && item.title !== job.title)
    : [...saved, { id: job.id, title: job.title, company: job.company, match: 0 }];
  setStoredList(SAVED_JOBS_KEY, next);
  syncPassport("savedJobs", next);
}

function saveAppliedJob(jobId) {
  const job = JOB_LIBRARY.find((item) => item.id === jobId);
  if (!job) return;
  const applied = getStoredList(APPLIED_JOBS_KEY);
  if (applied.some((item) => item.id === jobId || item.title === job.title)) return;
  const next = [...applied, {
    id: job.id,
    title: job.title,
    company: job.company,
    match: 0,
    status: "Pending Review",
    appliedAt: new Date().toISOString()
  }];
  setStoredList(APPLIED_JOBS_KEY, next);
  syncPassport("applications", next);
}

function syncPassport(key, value) {
  const passport = getPassport();
  if (!passport.name) return;
  passport[key] = value;
  if (key === "applications") {
    passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 72);
    passport.badges = Array.from(new Set([...(passport.badges || []), "Job Hunter"]));
  }
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
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

function getPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {
      name: "Gamal Ahmed",
      skills: ["HTML", "CSS", "JavaScript"],
      xp: 900,
      jobReadiness: 68,
      learningProgress: 45,
      projects: [{ title: "Starter Project" }]
    };
  } catch (error) {
    return {
      name: "Gamal Ahmed",
      skills: ["HTML", "CSS", "JavaScript"],
      xp: 900,
      jobReadiness: 68,
      learningProgress: 45,
      projects: [{ title: "Starter Project" }]
    };
  }
}

function getAssessment() {
  try {
    return JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getRecruiterNotes(jobId) {
  try {
    const notes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
    return notes[jobId] || "";
  } catch (error) {
    return "";
  }
}

function saveRecruiterNotes(jobId, text) {
  let notes = {};
  try {
    notes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
  } catch (error) {
    notes = {};
  }
  notes[jobId] = text;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function toggleHidden(id, hidden) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function showToast(message) {
  const toast = document.getElementById("jobDnaToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
