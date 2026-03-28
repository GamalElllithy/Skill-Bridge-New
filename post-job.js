const COMPANY_SETUP_KEY = "skillbridgeCompanySetup";
const JOB_DRAFT_KEY = "skillbridgePostJobDraft";
const POSTED_JOBS_KEY = "skillbridgePostedJobs";

const stepMessages = [
  "ابدأ بأساسيات الوظيفة حتى يظهر الـ live preview بشكل واضح.",
  "حدد المهارات المطلوبة، فهنا يتكوّن أساس الـ Job DNA.",
  "حدد مستوى الوظيفة لتوضيح نوع المرشحين المتوقعين.",
  "المزايا والمرونة تؤثر مباشرة على جذب المرشحين.",
  "دع النظام يحلل جودة الترشيح المتوقعة قبل النشر.",
  "راجع الوظيفة ككل ثم انشرها بثقة."
];

const skillTemplates = {
  frontend: {
    title: "Frontend Developer",
    department: "Engineering",
    core: ["HTML", "CSS", "JavaScript", "React"],
    optional: ["TypeScript", "APIs", "Testing"]
  },
  data: {
    title: "Data Analyst",
    department: "Data",
    core: ["Python", "SQL", "Excel", "Visualization"],
    optional: ["Power BI", "Statistics", "Storytelling"]
  },
  backend: {
    title: "Backend Developer",
    department: "Engineering",
    core: ["Node.js", "APIs", "Databases", "Architecture"],
    optional: ["Docker", "Testing", "Security"]
  }
};

const candidateSamples = [
  { name: "Gamal", role: "Aspiring Data Analyst", match: 84, copy: "Strong fundamentals + fast learner" },
  { name: "Ahmed", role: "Frontend Explorer", match: 80, copy: "Good projects and clean basics" },
  { name: "Sara", role: "Product Designer", match: 71, copy: "Great communication, needs more depth" }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupIntro();
  setupWizard();
});

function setupMenu() {
  const topbar = document.getElementById("postTopbar");
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

function setupIntro() {
  const intro = document.getElementById("postIntro");
  const startBtn = document.getElementById("startPostingBtn");
  const loadDraftBtn = document.getElementById("loadDraftBtn");

  startBtn?.addEventListener("click", () => hideIntro());

  loadDraftBtn?.addEventListener("click", () => {
    const draft = getDraft();
    hideIntro();
    if (draft.title || draft.department) {
      hydrateDraft();
      showToast("تم تحميل آخر draft.");
    } else {
      applySmartCompanyDefaults();
      showToast("تم تطبيق اقتراحات ذكية كبداية.");
    }
  });

  function hideIntro() {
    intro?.classList.add("hidden");
    intro?.setAttribute("aria-hidden", "true");
  }
}

function setupWizard() {
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const nextBtn = document.getElementById("nextJobStepBtn");
  const prevBtn = document.getElementById("prevJobStepBtn");
  const publishBtn = document.getElementById("publishJobBtn");
  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const previewBtn = document.getElementById("previewJobBtn");
  const resetBtn = document.getElementById("resetJobBtn");
  const duplicateBtn = document.getElementById("duplicateJobBtn");

  if (!steps.length || !nextBtn || !prevBtn || !publishBtn) return;

  hydrateDraft();
  applySmartCompanyDefaults();
  wireInputs();

  let current = Number(getDraft().currentStep || 0);

  function render() {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));

    const progress = Math.round(((current + 1) / steps.length) * 100);
    const score = calculateJobScore();
    replaceText("jobProgressLabel", `Step ${current + 1} / ${steps.length}`);
    replaceText("jobProgressCopy", stepMessages[current]);
    replaceText("jobScoreValue", `${score}%`);

    const bar = document.getElementById("jobProgressBar");
    if (bar) bar.style.width = `${progress}%`;

    prevBtn.classList.toggle("hidden", current === 0);
    nextBtn.classList.toggle("hidden", current === steps.length - 1);
    publishBtn.classList.toggle("hidden", current !== steps.length - 1);

    saveCurrentStep(current);
    updateLiveUi();
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(current)) return;
    if (current < steps.length - 1) {
      current += 1;
      render();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      render();
    }
  });

  saveDraftBtn.addEventListener("click", () => {
    saveDraft(false);
    showToast("تم حفظ الوظيفة كـ Draft.");
  });

  previewBtn.addEventListener("click", () => {
    saveDraft(false);
    current = steps.length - 1;
    render();
    showToast("تم فتح المراجعة النهائية.");
  });

  publishBtn.addEventListener("click", () => {
    if (!validateStep(current)) return;
    const job = buildJob(true);
    const jobs = getPostedJobs();
    jobs.unshift(job);
    window.localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(jobs));
    window.localStorage.removeItem(JOB_DRAFT_KEY);
    showToast("تم نشر الوظيفة بنجاح ✅");
    setTimeout(() => {
      window.location.href = "company-dashboard.html";
    }, 1000);
  });

  resetBtn.addEventListener("click", () => {
    window.localStorage.removeItem(JOB_DRAFT_KEY);
    window.location.reload();
  });

  duplicateBtn?.addEventListener("click", () => {
    const lastJob = getPostedJobs()[0];
    if (!lastJob) {
      showToast("لا توجد وظيفة منشورة لنسخها الآن.");
      return;
    }
    window.localStorage.setItem(JOB_DRAFT_KEY, JSON.stringify({ ...lastJob, status: "Draft", currentStep: 0 }));
    window.location.reload();
  });

  render();
}

function wireInputs() {
  document.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", updateLiveUi);
    field.addEventListener("change", updateLiveUi);
  });

  document.querySelectorAll("[data-benefit]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      updateLiveUi();
    });
  });

  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => {
      const template = skillTemplates[button.getAttribute("data-template")];
      if (!template) return;
      setValue("jobTitle", template.title);
      setValue("jobDepartment", template.department);
      setValue("coreSkills", template.core.join(", "));
      setValue("optionalSkills", template.optional.join(", "));
      updateLiveUi();
      showToast("تم تطبيق Template الوظيفة.");
    });
  });

  const skillLevel = document.getElementById("skillLevel");
  skillLevel?.addEventListener("input", () => {
    replaceText("skillLevelValue", mapSkillLevel(skillLevel.value));
  });

  const remoteFlex = document.getElementById("remoteFlex");
  remoteFlex?.addEventListener("input", () => {
    replaceText("remoteFlexValue", `${remoteFlex.value}%`);
    updateSalaryImpact();
  });
}

function updateLiveUi() {
  const draft = buildJob(false);
  window.localStorage.setItem(JOB_DRAFT_KEY, JSON.stringify(draft));

  replaceText("previewJobTitle", draft.title || "New Job Title");
  replaceText("previewCompany", `${draft.companyName} • ${draft.location || "Remote"}`);
  replaceText("previewStatus", draft.status);
  replaceText("jobScoreValue", `${calculateJobScore()}%`);

  renderSkillBars(draft);
  renderMetaTags(draft);
  renderCandidatePreview(draft);
  renderSuggestions(draft);
  renderAnalysis(draft);
  renderFinalReview(draft);
  updateSalaryImpact();
}

function renderSkillBars(draft) {
  const box = document.getElementById("skillBars");
  if (!box) return;
  const skills = draft.coreSkills.length ? draft.coreSkills : ["Core skill appears here"];
  const level = draft.skillLevelValue;

  box.innerHTML = skills.map((skill, index) => {
    const value = Math.max(45, Math.min(95, level + 10 - index * 8));
    return `
      <article class="skill-bar-card">
        <strong>${skill}</strong>
        <small>${mapConfidence(value)}</small>
        <div class="bar-track"><span style="width:${value}%"></span></div>
      </article>
    `;
  }).join("");
}

function renderMetaTags(draft) {
  const meta = document.getElementById("previewMetaTags");
  const skills = document.getElementById("previewSkillTags");
  if (meta) {
    meta.innerHTML = [draft.department, draft.location, draft.duration].filter(Boolean).map((item) => `<span>${item}</span>`).join("");
  }
  if (skills) {
    skills.innerHTML = draft.coreSkills.slice(0, 4).map((item) => `<span>${item}</span>`).join("");
  }
}

function renderCandidatePreview(draft) {
  const container = document.getElementById("candidatePreview");
  if (!container) return;

  const score = predictedMatch(draft);
  container.innerHTML = candidateSamples.map((candidate, index) => `
    <article class="candidate-mini">
      <strong>${candidate.name}</strong>
      <p>${candidate.role}</p>
      <span>${Math.max(58, score - index * 6)}% Match</span>
      <p>${candidate.copy}</p>
    </article>
  `).join("");
}

function renderSuggestions(draft) {
  const container = document.getElementById("jobSuggestions");
  if (!container) return;

  const suggestions = [];
  if (draft.coreSkills.length < 3) suggestions.push("We suggest at least 3 core skills for better matching.");
  if (!draft.salaryRange) suggestions.push("Adding salary range may increase candidate trust.");
  if (!draft.internshipFriendly && draft.duration === "Internship") suggestions.push("Internship roles usually perform better when internship-friendly is enabled.");

  if (!suggestions.length) {
    suggestions.push("This setup looks strong. You are ready for Smart Matching.");
  }

  container.innerHTML = suggestions.map((item) => `
    <article class="suggestion-card">
      <strong>AI Suggestion</strong>
      <p>${item}</p>
    </article>
  `).join("");
}

function renderAnalysis(draft) {
  const value = predictedMatch(draft);
  replaceText("analysisMatchValue", `${value}%`);

  const ring = document.getElementById("analysisRing");
  if (ring) {
    const circumference = 301.59;
    const offset = circumference - (circumference * value) / 100;
    ring.style.strokeDashoffset = `${offset}`;
  }

  const breakdown = document.getElementById("analysisBreakdown");
  if (!breakdown) return;

  const metrics = [
    { label: "Skills", value: Math.max(50, Math.min(95, draft.coreSkills.length * 18)) },
    { label: "Candidate Level", value: draft.skillLevelValue },
    { label: "Projects Match", value: draft.studentReady ? 82 : 66 },
    { label: "XP & Readiness", value: draft.internshipFriendly ? 84 : 72 }
  ];

  breakdown.innerHTML = metrics.map((item) => `
    <article class="analysis-item">
      <strong>${item.label}</strong>
      <p>${item.value}%</p>
      <div class="bar-track"><span style="width:${item.value}%"></span></div>
    </article>
  `).join("");
}

function renderFinalReview(draft) {
  const recommendationBox = document.getElementById("aiRecommendations");
  const summaryBox = document.getElementById("jobSummary");
  if (!recommendationBox || !summaryBox) return;

  const recommendations = [
    `Adding ${draft.optionalSkills[0] || "one optional skill"} may increase top candidate match by 10%.`,
    draft.salaryRange ? "Salary clarity improves application quality." : "Add salary range to improve trust and conversion.",
    draft.remoteFlex > 60 ? "High flexibility makes the role more attractive to juniors." : "Consider more flexibility for a wider pool."
  ];

  recommendationBox.innerHTML = recommendations.map((item) => `
    <article class="recommendation-item">
      <strong>AI Recommendation</strong>
      <span>${item}</span>
    </article>
  `).join("");

  const summaryItems = [
    ["Title", draft.title || "Untitled Job"],
    ["Department", draft.department || "Not selected"],
    ["Location", draft.location || "Not selected"],
    ["Duration", draft.duration || "Not selected"],
    ["Core Skills", draft.coreSkills.join(", ") || "Not added"],
    ["Benefits", draft.benefits.join(", ") || "No benefits selected"]
  ];

  summaryBox.innerHTML = summaryItems.map(([label, value]) => `
    <article class="summary-item">
      <strong>${label}</strong>
      <span>${value}</span>
    </article>
  `).join("");
}

function updateSalaryImpact() {
  const salary = getValue("salaryRange");
  const flex = Number(getValue("remoteFlex") || 60);
  const text = document.getElementById("salaryImpactText");
  if (!text) return;

  if (salary && flex >= 70) {
    text.textContent = "راتب واضح + مرونة عالية = جذب أفضل للمرشحين المناسبين.";
    return;
  }

  if (salary) {
    text.textContent = "إضافة salary range واضح قد ترفع التفاعل من المرشحين المناسبين.";
    return;
  }

  text.textContent = "المرونة جيدة، لكن إظهار الراتب قد يجعل القرار أسرع للطلاب.";
}

function validateStep(index) {
  const validators = [
    () => !!getValue("jobTitle") && !!getValue("jobDepartment") && !!getValue("jobLocation") && !!getValue("jobDuration"),
    () => splitTags(getValue("coreSkills")).length > 0,
    () => !!getValue("minExperience") && !!getValue("qualifications"),
    () => true,
    () => true,
    () => true
  ];

  const ok = validators[index] ? validators[index]() : true;
  if (!ok) showToast("أكمل بيانات الخطوة الحالية أولًا.");
  return ok;
}

function buildJob(published) {
  const company = getCompanySetup();
  return {
    id: `job-${Date.now()}`,
    title: getValue("jobTitle") || "Untitled Job",
    department: getValue("jobDepartment"),
    location: getValue("jobLocation"),
    duration: getValue("jobDuration"),
    coreSkills: splitTags(getValue("coreSkills")),
    optionalSkills: splitTags(getValue("optionalSkills")),
    skillLevel: Number(getValue("skillLevel") || 2),
    skillLevelLabel: mapSkillLevel(getValue("skillLevel") || 2),
    skillLevelValue: mapSkillLevelToPercent(getValue("skillLevel") || 2),
    minExperience: getValue("minExperience"),
    qualifications: getValue("qualifications"),
    studentReady: document.getElementById("studentReady")?.checked || false,
    internshipFriendly: document.getElementById("internshipFriendly")?.checked || false,
    needsSenior: document.getElementById("needsSenior")?.checked || false,
    salaryRange: getValue("salaryRange"),
    remoteFlex: Number(getValue("remoteFlex") || 60),
    benefits: getActiveValues("[data-benefit]"),
    companyName: company.companyName || "Your Company",
    industry: company.industryLabel || "Technology",
    status: published ? "Published" : "Draft",
    score: calculateJobScore(),
    currentStep: Number(getDraft().currentStep || 0),
    updatedAt: new Date().toISOString()
  };
}

function predictedMatch(draft) {
  const skillsWeight = Math.min(40, draft.coreSkills.length * 9);
  const levelWeight = Math.round(draft.skillLevelValue * 0.22);
  const friendlyBoost = (draft.studentReady ? 8 : 0) + (draft.internshipFriendly ? 8 : 0);
  const benefitBoost = Math.min(12, draft.benefits.length * 3);
  return Math.max(52, Math.min(96, 30 + skillsWeight + levelWeight + friendlyBoost + benefitBoost));
}

function calculateJobScore() {
  const checks = [
    !!getValue("jobTitle"),
    !!getValue("jobDepartment"),
    !!getValue("jobLocation"),
    !!getValue("jobDuration"),
    splitTags(getValue("coreSkills")).length > 0,
    !!getValue("minExperience"),
    !!getValue("qualifications"),
    true,
    getActiveValues("[data-benefit]").length > 0
  ];
  return Math.max(18, Math.round((checks.filter(Boolean).length / checks.length) * 100));
}

function hydrateDraft() {
  const draft = getDraft();
  if (!draft.title && !draft.department) return;

  setValue("jobTitle", draft.title);
  setValue("jobDepartment", draft.department);
  setValue("jobLocation", draft.location);
  setValue("jobDuration", draft.duration);
  setValue("coreSkills", (draft.coreSkills || []).join(", "));
  setValue("optionalSkills", (draft.optionalSkills || []).join(", "));
  setValue("skillLevel", draft.skillLevel || 2);
  replaceText("skillLevelValue", draft.skillLevelLabel || "Intermediate");
  setValue("minExperience", draft.minExperience);
  setValue("qualifications", draft.qualifications);
  setChecked("studentReady", draft.studentReady);
  setChecked("internshipFriendly", draft.internshipFriendly);
  setChecked("needsSenior", draft.needsSenior);
  setValue("salaryRange", draft.salaryRange);
  setValue("remoteFlex", draft.remoteFlex || 60);
  replaceText("remoteFlexValue", `${draft.remoteFlex || 60}%`);
  setMultiActive("[data-benefit]", draft.benefits);
}

function applySmartCompanyDefaults() {
  const company = getCompanySetup();
  if (!company.companyName) return;

  if (!getValue("jobDepartment")) setValue("jobDepartment", company.roles?.includes("Data") ? "Data" : "Engineering");
  if (!getValue("jobLocation")) setValue("jobLocation", company.workStyle || "Hybrid");
  if (!getValue("jobDuration")) setValue("jobDuration", company.internshipFriendly ? "Internship" : "Full-time");
  if (!getValue("coreSkills") && Array.isArray(company.coreTech)) setValue("coreSkills", company.coreTech.slice(0, 4).join(", "));
}

function saveDraft(published) {
  const job = buildJob(published);
  window.localStorage.setItem(JOB_DRAFT_KEY, JSON.stringify(job));
}

function saveCurrentStep(step) {
  const draft = buildJob(false);
  draft.currentStep = step;
  window.localStorage.setItem(JOB_DRAFT_KEY, JSON.stringify(draft));
}

function getDraft() {
  try {
    return JSON.parse(window.localStorage.getItem(JOB_DRAFT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getPostedJobs() {
  try {
    return JSON.parse(window.localStorage.getItem(POSTED_JOBS_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function getCompanySetup() {
  try {
    return JSON.parse(window.localStorage.getItem(COMPANY_SETUP_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function mapSkillLevel(value) {
  if (String(value) === "1") return "Beginner";
  if (String(value) === "3") return "Advanced";
  return "Intermediate";
}

function mapSkillLevelToPercent(value) {
  if (String(value) === "1") return 58;
  if (String(value) === "3") return 88;
  return 74;
}

function mapConfidence(value) {
  if (value >= 80) return "Strong";
  if (value >= 65) return "Good";
  return "Growing";
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.value = value;
}

function setChecked(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = !!value;
}

function getActiveValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}.active`)).map((button) =>
    button.getAttribute("data-benefit")
  ).filter(Boolean);
}

function setMultiActive(selector, values) {
  const list = Array.isArray(values) ? values : [];
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", list.includes(button.getAttribute("data-benefit")));
  });
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(message) {
  const toast = document.getElementById("postJobToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
