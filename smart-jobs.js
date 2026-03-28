const studentJobs = [
  {
    id: "job-1",
    title: "Junior Data Analyst",
    company: "TechNova",
    match: 82,
    chance: "high",
    reason: "مناسبة لك لأن عندك Analytical Skills قوية ونتيجة Talent DNA قريبة من احتياجات الدور.",
    tags: ["remote", "internship", "data"],
    tagsLabel: ["Remote", "Internship", "Data"],
    location: "Cairo / Remote",
    founded: "2019",
    industry: "Data Products",
    employees: "45",
    email: "jobs@technova.com",
    website: "technova.ai",
    companyInterests: ["Data dashboards", "Business insights", "Automation"],
    description: "تحليل البيانات وبناء تقارير واضحة لفريق المنتج والإدارة.",
    requirements: ["Python", "SQL", "Dashboards"],
    missing: ["Advanced SQL"],
    socialProof: "ناس شبهك قدموا هنا خلال آخر 48 ساعة",
    urgency: "باقي 3 أيام",
    fitTrack: "data"
  },
  {
    id: "job-2",
    title: "BI Intern",
    company: "InsightFlow",
    match: 76,
    chance: "medium",
    reason: "أنت مناسب لأنك قوي في التحليل لكن تحتاج مشروع Dashboard أوضح.",
    tags: ["full-time", "internship", "data"],
    tagsLabel: ["Full-time", "Internship", "BI"],
    location: "Cairo",
    founded: "2017",
    industry: "Business Intelligence",
    employees: "120",
    email: "talent@insightflow.com",
    website: "insightflow.io",
    companyInterests: ["Power BI", "SQL reporting", "KPI tracking"],
    description: "مساعدة فريق BI في بناء تقارير شهرية ومتابعة KPIs.",
    requirements: ["Excel", "SQL", "Power BI"],
    missing: ["Power BI Project"],
    socialProof: "5 قدموا قبلك",
    urgency: "فرصتك عالية",
    fitTrack: "data"
  },
  {
    id: "job-3",
    title: "Product Operations Intern",
    company: "BridgeLab",
    match: 68,
    chance: "medium",
    reason: "مناسب إذا كنت تريد دورًا يجمع بين التحليل والتنفيذ العملي.",
    tags: ["hybrid", "internship", "operations"],
    tagsLabel: ["Hybrid", "Operations", "Internship"],
    location: "Alexandria / Hybrid",
    founded: "2020",
    industry: "Operations Tech",
    employees: "32",
    email: "careers@bridgelab.com",
    website: "bridgelab.co",
    companyInterests: ["Operations", "Ownership", "Execution"],
    description: "تنسيق عمليات المنتج وتحليل الأداء ومتابعة التنفيذ.",
    requirements: ["Communication", "Excel", "Ownership"],
    missing: ["Operations Case Study"],
    socialProof: "AI Suggestion: جرب الوظيفة دي كمان",
    urgency: "Quick Apply",
    fitTrack: "operations"
  }
];

const companyCandidates = [
  {
    id: "candidate-1",
    name: "جمال الليثي",
    track: "Data Analysis",
    trackKey: "data",
    university: "Cairo University",
    match: 91,
    level: "Level 3 Analyzer",
    skills: ["Python", "SQL", "Power BI"],
    dna: { analytical: 82, creative: 44, social: 58 },
    projects: ["Customer Insights Dashboard", "Retail SQL Analyzer"],
    email: "gamal@email.com",
    profile: "candidate-passport.html"
  },
  {
    id: "candidate-2",
    name: "Abdulrahman Al-Qist ",
    track: "Product Design",
    trackKey: "design",
    university: "Ain Shams University",
    match: 84,
    level: "Level 3 Creator",
    skills: ["UX", "Figma", "Research"],
    dna: { analytical: 48, creative: 84, social: 61 },
    projects: ["Hiring Funnel Story", "Mobile App Redesign"],
    email: "Abdulrahman Al-Qist@email.com",
    profile: "candidate-passport.html"
  },
  {
    id: "candidate-3",
    name: "Amr Abbas ",
    track: "Software Engineering",
    trackKey: "software",
    university: "Helwan University",
    match: 79,
    level: "Level 3 Builder",
    skills: ["JavaScript", "APIs", "React"],
    dna: { analytical: 60, creative: 52, social: 49 },
    projects: ["Task Manager", "API Dashboard"],
    email: "omar@email.com",
    profile: "candidate-passport.html"
  }
];

const learningRecommendations = [
  {
    skill: "SQL المتقدم",
    impact: "وظائف الـ Data Analysis وBI",
    result: "وبالتالي سترتفع نسبة قبولك في الوظائف التي تحتاج تحليل بيانات أعمق."
  },
  {
    skill: "Power BI أو Tableau",
    impact: "بناء dashboards وتقارير احترافية",
    result: "وبالتالي ستكون أقرب للشركات التي تهتم بالـ reporting وKPIs."
  },
  {
    skill: "مشروع عملي منشور",
    impact: "تحويل المهارة إلى دليل واضح أمام الشركة",
    result: "وبالتالي تزيد الثقة فيك وترتفع فرص دعوتك للمقابلة."
  }
];

const ROLE_KEY = "skillbridgeUserRole";
const PASSPORT_KEY = "skillbridgeTalentPassport";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupRoleFlow();
  setupModals();
  setupApplyForm();
  setupJobFilters();
});

function setupMenu() {
  const topbar = document.getElementById("jobsTopbar");
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

function setupRoleFlow() {
  const roleGate = document.getElementById("roleGate");
  const authStage = document.getElementById("authStage");
  const jobsShell = document.getElementById("jobsShell");
  const loginForm = document.getElementById("roleLoginForm");
  const roleEmail = document.getElementById("roleEmail");
  const rolePassword = document.getElementById("rolePassword");
  const backToRolesBtn = document.getElementById("backToRolesBtn");
  const changeModeBtn = document.getElementById("changeModeBtn");
  const roleButtons = document.querySelectorAll("[data-role-select]");

  let selectedRole = window.localStorage.getItem(ROLE_KEY) === "company" ? "company" : "student";

  showJobsView(selectedRole);

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedRole = button.getAttribute("data-role-select");
      renderAuthCopy(selectedRole);
      roleGate?.classList.add("hidden");
      jobsShell?.classList.add("hidden");
      authStage?.classList.remove("hidden");
    });
  });

  changeModeBtn?.addEventListener("click", () => {
    if (roleEmail) roleEmail.value = "";
    if (rolePassword) rolePassword.value = "";
    jobsShell?.classList.add("hidden");
    authStage?.classList.add("hidden");
    roleGate?.classList.remove("hidden");
  });

  backToRolesBtn?.addEventListener("click", () => {
    authStage?.classList.add("hidden");
    roleGate?.classList.remove("hidden");
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailValue = roleEmail?.value.trim() || "";
    const passwordValue = rolePassword?.value.trim() || "";

    if (!selectedRole) {
      showToast("اختر هل أنت طالب أم شركة أولًا");
      return;
    }

    if (!emailValue || !passwordValue) {
      showToast("أدخل الإيميل وكلمة المرور أولًا");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showToast("الإيميل غير صحيح");
      return;
    }

    window.localStorage.setItem(ROLE_KEY, selectedRole);
    showJobsView(selectedRole);
    showToast(selectedRole === "student" ? "تم فتح واجهة الطالب" : "تم فتح واجهة الشركة");
  });

  function showJobsView(role) {
    document.body.classList.toggle("company-mode", role === "company");
    roleGate?.classList.add("hidden");
    authStage?.classList.add("hidden");
    jobsShell?.classList.remove("hidden");
    renderRoleView(role);
  }
}

function renderAuthCopy(role) {
  replaceText("authEyebrow", role === "company" ? "Company Login" : "Student Login");
  replaceText("authTitle", role === "company" ? "سجّل دخولك كشركة" : "سجّل دخولك كطالب");
  replaceText(
    "authCopy",
    role === "company"
      ? "ادخل إيميل الشركة وكلمة المرور ثم شاهد أفضل المرشحين المناسبين لاحتياجاتك."
      : "ادخل الإيميل وكلمة المرور الخاصة بك ثم انتقل مباشرة إلى الوظائف المناسبة لك."
  );
  replaceText("emailLabel", role === "company" ? "Company Email" : "Student Email");

  const roleEmail = document.getElementById("roleEmail");
  if (roleEmail) {
    roleEmail.placeholder = role === "company" ? "company@email.com" : "student@email.com";
  }

  const authBenefits = document.getElementById("authBenefits");
  if (authBenefits) {
    authBenefits.innerHTML = role === "company"
      ? "<span>Talent DNA</span><span>Fast Hiring</span><span>Top Matches</span>"
      : "<span>Smart Match</span><span>Quick Access</span><span>Saved Progress</span>";
  }
}

function renderRoleView(role) {
  const studentView = document.getElementById("studentView");
  const companyView = document.getElementById("companyView");
  const dashboardLink = document.getElementById("dashboardLink");

  if (studentView) studentView.classList.toggle("hidden", role !== "student");
  if (companyView) companyView.classList.toggle("hidden", role !== "company");

  if (role === "company") {
    window.localStorage.setItem(ROLE_KEY, "company");
    replaceText("heroEyebrow", "Company Smart Match");
    replaceText("heroTitle", "مرشحين أذكى بدل CV تقليدي");
    replaceText("heroCopy", "اعرض أفضل المرشحين حسب الـ Match والـ Talent DNA والمشاريع الجاهزة للمراجعة.");
    replaceText("insightCopy", "المرشحين ظاهرين مباشرة مع الوظائف المرتبطة بهم.");
    if (dashboardLink) dashboardLink.href = "company-dashboard.html";
    renderCompanyCandidates();
    return;
  }

  window.localStorage.setItem(ROLE_KEY, "student");
  replaceText("heroEyebrow", "Student Smart Jobs");
  replaceText("heroTitle", "وظائف ذكية وشركات مناسبة لك");
  replaceText("heroCopy", "دلوقتي هتشوف الوظائف المناسبة ليك وكمان الشركات نفسها ظاهرة قدامك من أول شاشة.");
  replaceText("insightCopy", "دي Preview أوضح للشركات + الوظائف + الخطوة التعليمية الجاية.");
  if (dashboardLink) dashboardLink.href = "student-dashboard.html";
  renderStudentJobs();
}

function setupJobFilters() {
  document.querySelectorAll("[data-job-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-job-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderStudentJobs();
    });
  });
}

function renderStudentJobs() {
  const grid = document.getElementById("jobGrid");
  const learningGrid = document.getElementById("learningRecommendations");
  const companyPreviewGrid = document.getElementById("companyPreviewGrid");
  if (!grid || !learningGrid || !companyPreviewGrid) return;

  const assessment = getAssessment();
  const activeFilter = document.querySelector("[data-job-filter].active")?.getAttribute("data-job-filter") || "all";
  const savedJobs = getStoredList(SAVED_JOBS_KEY);
  const appliedJobs = getStoredList(APPLIED_JOBS_KEY);
  const filteredJobs = studentJobs.filter((job) => activeFilter === "all" || job.tags.includes(activeFilter));
  const topJob = filteredJobs[0] || studentJobs[0];

  replaceText("topJobTitle", topJob.title);
  replaceText("topJobCompany", topJob.company);
  replaceText("topJobMatch", `${topJob.match}% Match`);
  replaceText("topJobReason", assessment?.personality || topJob.reason);

  grid.innerHTML = filteredJobs.map((job, index) => {
    const isSaved = savedJobs.some((item) => item.id === job.id);
    const isApplied = appliedJobs.some((item) => item.id === job.id);
    const strengths = Array.isArray(assessment?.strengths) && assessment.strengths.length
      ? assessment.strengths.join(" • ")
      : job.requirements.join(" • ");

    return `
      <article class="job-card student-job-card variant-${(index % 3) + 1}">
        <div class="card-top">
          <div>
            <strong>${job.title}</strong>
            <div class="meta-line">${job.company}</div>
          </div>
          <span class="match-pill">${job.match}%</span>
        </div>
        <div class="match-progress"><span style="width:${job.match}%"></span></div>
        <p>${job.reason}</p>
        <div class="ai-match-box">
          <strong>Why matched</strong>
          <ul class="ai-match-list">
            <li>التوافق الحالي قريب من ${job.match}%</li>
            <li>المهارات المطلوبة قريبة من مسارك الحالي</li>
            <li>نقاط قوتك الحالية: ${strengths}</li>
          </ul>
        </div>
        <div class="job-tags">${job.tagsLabel.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="meta-line">${job.location}</div>
        <div class="job-extra">
          <div>
            <strong>الشركة</strong>
            <p>${job.industry}</p>
          </div>
          <div>
            <strong>اهتمامات الشركة</strong>
            <p>${job.companyInterests.join(" • ")}</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="primary-btn ${isApplied ? "applied-state" : ""}" type="button" data-apply-job="${job.id}">
            ${isApplied ? "Applied" : "Apply Now"}
          </button>
          <button class="ghost-btn" type="button" data-open-job="${job.id}">View Details</button>
          <button class="ghost-btn ${isSaved ? "saved-state" : ""}" type="button" data-save-job="${job.id}">
            ${isSaved ? "Saved" : "Save"}
          </button>
        </div>
        <span class="chance-badge ${job.chance}">${formatChance(job.chance)}</span>
      </article>
    `;
  }).join("");

  const uniqueCompanies = Array.from(new Map(studentJobs.map((job) => [job.company, job])).values());
  companyPreviewGrid.innerHTML = uniqueCompanies.map((company) => `
    <article class="company-preview-card">
      <div class="company-preview-head">
        <div>
          <strong>${company.company}</strong>
          <p>${company.industry}</p>
        </div>
        <span class="company-match-pill">${company.match}% Match</span>
      </div>
      <div class="company-preview-meta">
        <span>${company.location}</span>
        <span>${company.employees} موظف</span>
        <span>من ${company.founded}</span>
      </div>
      <p class="company-preview-copy">${company.reason}</p>
      <div class="company-preview-tags">
        ${company.companyInterests.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="primary-btn" type="button" data-open-job="${company.id}">شوف الوظيفة</button>
        <a class="ghost-btn" href="${company.website.startsWith("http") ? company.website : `https://${company.website}`}" target="_blank" rel="noreferrer">موقع الشركة</a>
      </div>
    </article>
  `).join("");

  learningGrid.innerHTML = learningRecommendations.map((item) => `
    <article class="learn-card">
      <strong>نوصي بتعلم <span class="learn-highlight">${item.skill}</span></strong>
      <p>لأن ده هيساعدك في ${item.impact}</p>
      <p>${item.result}</p>
    </article>
  `).join("");

  bindStudentActions();
}

function renderCompanyCandidates(filterTrack) {
  const grid = document.getElementById("candidateGrid");
  const companyJobsList = document.getElementById("companyJobsList");
  if (!grid || !companyJobsList) return;

  const visibleCandidates = filterTrack
    ? companyCandidates.filter((item) => item.trackKey === filterTrack)
    : companyCandidates;

  companyJobsList.innerHTML = studentJobs.map((job) => {
    const recommended = companyCandidates.filter((candidate) => {
      if (job.fitTrack === "operations") {
        return candidate.trackKey === "software" || candidate.trackKey === "data";
      }
      return candidate.trackKey === job.fitTrack;
    });

    return `
      <article class="company-job-card">
        <div class="company-job-top">
          <strong>${job.title}</strong>
          <div class="company-meta">${job.company} • ${job.location} • ${job.website}</div>
          <p>الشركة مهتمة بـ ${job.companyInterests.join(" • ")}</p>
        </div>
        <div class="recommended-candidates">
          ${recommended.map((candidate) => `
            <div class="recommended-mini">
              <strong>${candidate.name}</strong>
              <p>${candidate.track}</p>
              <span class="mini-match">${candidate.match}% Match</span>
              <button class="ghost-btn" type="button" data-open-candidate="${candidate.id}">عرض المرشح</button>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");

  grid.innerHTML = visibleCandidates.map((candidate) => `
    <article class="candidate-card">
      <div class="card-top">
        <div>
          <strong>${candidate.name}</strong>
          <div class="meta-line">${candidate.track}</div>
        </div>
        <span class="match-pill">${candidate.match}%</span>
      </div>
      <p>${candidate.level} • ${candidate.university}</p>
      <div class="candidate-tags">${candidate.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
      <div class="candidate-dna">
        <span>Analytical ${candidate.dna.analytical}%</span>
        <span>Creative ${candidate.dna.creative}%</span>
        <span>Social ${candidate.dna.social}%</span>
      </div>
      <div class="card-actions">
        <button class="primary-btn" type="button" data-open-candidate="${candidate.id}">Candidate Details</button>
        <button class="ghost-btn" type="button" data-invite-candidate="${candidate.id}">Invite</button>
        <button class="ghost-btn" type="button" data-save-candidate="${candidate.id}">Save</button>
      </div>
    </article>
  `).join("");

  bindCompanyActions();
}

function bindStudentActions() {
  document.querySelectorAll("[data-open-job]").forEach((button) => {
    button.addEventListener("click", () => goToJobDetails(button.getAttribute("data-open-job")));
  });

  document.querySelectorAll("[data-apply-job]").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-apply-job");
      if (getStoredList(APPLIED_JOBS_KEY).some((job) => job.id === jobId)) {
        window.location.href = "applied-jobs.html?tab=applied";
        return;
      }
      openApplyModal(jobId);
    });
  });

  document.querySelectorAll("[data-save-job]").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-save-job");
      toggleSavedJob(jobId);
      renderStudentJobs();
      showToast(isJobSaved(jobId) ? "تم حفظ الوظيفة" : "تمت إزالة الوظيفة من المحفوظة");
    });
  });
}

function goToJobDetails(id) {
  const job = findJobById(id);
  if (!job) return;
  window.localStorage.setItem(JOB_SELECTION_KEY, job.id);
  window.location.href = "job-details.html";
}

function bindCompanyActions() {
  document.querySelectorAll("[data-open-candidate]").forEach((button) => {
    button.addEventListener("click", () => openCandidateDetails(button.getAttribute("data-open-candidate")));
  });

  document.querySelectorAll("[data-invite-candidate]").forEach((button) => {
    button.addEventListener("click", () => showToast("تم إرسال دعوة مقابلة مبدئية"));
  });

  document.querySelectorAll("[data-save-candidate]").forEach((button) => {
    button.addEventListener("click", () => showToast("تم حفظ المرشح في قائمة المتابعة"));
  });

  document.querySelectorAll("[data-filter-candidates]").forEach((button) => {
    button.addEventListener("click", () => renderCompanyCandidates(button.getAttribute("data-filter-candidates")));
  });
}

function openJobDetails(id) {
  const job = findJobById(id);
  if (!job) return;

  const assessment = getAssessment();
  const strengths = Array.isArray(assessment?.strengths) && assessment.strengths.length
    ? assessment.strengths
    : job.requirements;

  const nextLearn = learningRecommendations.find((item) => {
    return job.missing.some((missing) => item.skill.toLowerCase().includes(missing.split(" ")[0].toLowerCase()));
  }) || learningRecommendations[0];

  const modalContent = document.getElementById("modalContent");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <div class="apply-head">
      <span class="eyebrow">Job Details</span>
      <h2>${job.title}</h2>
      <p>${job.company} • ${job.location}</p>
    </div>
    <div class="modal-grid">
      <section class="modal-section">
        <strong>معلومات الوظيفة</strong>
        <p>${job.description}</p>
        <p>Requirements: ${job.requirements.join(" • ")}</p>
        <p>${job.socialProof}</p>
      </section>
      <section class="modal-section">
        <strong>معلومات الشركة</strong>
        <p>تاريخ التأسيس: ${job.founded}</p>
        <p>المجال: ${job.industry}</p>
        <p>عدد الموظفين: ${job.employees}</p>
        <p>Email: ${job.email}</p>
        <p>Website: ${job.website}</p>
      </section>
      <section class="modal-section">
        <strong>Why Matched</strong>
        <p>التوافق الحالي قريب من ${job.match}%</p>
        <p>نقاط القوة الحالية: ${strengths.join(" • ")}</p>
        <p>المطلوب: ${job.requirements.join(" • ")}</p>
      </section>
      <section class="modal-section">
        <strong>الخطوة الجاية</strong>
        <p>نوصي بتعلم ${nextLearn.skill}</p>
        <p>${nextLearn.result}</p>
      </section>
    </div>
    <div class="card-actions" style="margin-top:18px;">
      <button class="primary-btn" type="button" data-modal-apply="${job.id}">Apply Now</button>
      <button class="ghost-btn" type="button" data-modal-save="${job.id}">Save Job</button>
      <button class="ghost-btn" type="button" data-modal-dna="${job.id}">Improve Match</button>
    </div>
  `;

  openModal("detailsModal");

  modalContent.querySelector("[data-modal-apply]")?.addEventListener("click", () => {
    closeModal("detailsModal");
    openApplyModal(job.id);
  });

  modalContent.querySelector("[data-modal-save]")?.addEventListener("click", () => {
    toggleSavedJob(job.id);
    closeModal("detailsModal");
    renderStudentJobs();
    showToast(isJobSaved(job.id) ? "تم حفظ الوظيفة" : "تمت إزالة الوظيفة من المحفوظة");
  });

  modalContent.querySelector("[data-modal-dna]")?.addEventListener("click", () => {
    window.localStorage.setItem(JOB_SELECTION_KEY, mapToJobDnaId(job.title));
    window.location.href = "job-dna.html";
  });
}

function openCandidateDetails(id) {
  const candidate = companyCandidates.find((item) => item.id === id);
  if (!candidate) return;

  const modalContent = document.getElementById("modalContent");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <div class="apply-head">
      <span class="eyebrow">Candidate Details</span>
      <h2>${candidate.name}</h2>
      <p>${candidate.track} • ${candidate.university}</p>
    </div>
    <div class="modal-grid">
      <section class="modal-section">
        <strong>بيانات المرشح</strong>
        <p>Email: ${candidate.email}</p>
        <p>Level: ${candidate.level}</p>
        <p>Track: ${candidate.track}</p>
      </section>
      <section class="modal-section">
        <strong>Talent DNA</strong>
        <p>Analytical: ${candidate.dna.analytical}%</p>
        <p>Creative: ${candidate.dna.creative}%</p>
        <p>Social: ${candidate.dna.social}%</p>
      </section>
      <section class="modal-section">
        <strong>Skills</strong>
        <p>${candidate.skills.join(" • ")}</p>
      </section>
      <section class="modal-section">
        <strong>Projects</strong>
        <p>${candidate.projects.join(" • ")}</p>
      </section>
    </div>
    <div class="card-actions" style="margin-top:18px;">
      <button class="primary-btn" type="button">Invite to Interview</button>
      <button class="ghost-btn" type="button">Contact</button>
      <a class="ghost-btn" href="${candidate.profile}">Open Profile</a>
    </div>
  `;

  openModal("detailsModal");
}

function openApplyModal(id) {
  const modal = document.getElementById("applyModal");
  const success = document.getElementById("applySuccess");
  const form = document.getElementById("applyForm");
  const submitBtn = document.getElementById("submitApplicationBtn");
  if (!modal || !success || !form || !submitBtn) return;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  form.classList.remove("hidden");
  success.classList.add("hidden");
  submitBtn.setAttribute("data-current-job", id);
}

function setupApplyForm() {
  const form = document.getElementById("applyForm");
  const success = document.getElementById("applySuccess");
  if (!form || !success) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentJobId = document.getElementById("submitApplicationBtn")?.getAttribute("data-current-job");
    if (currentJobId) saveAppliedJob(currentJobId);
    form.classList.add("hidden");
    success.classList.remove("hidden");
    showToast("تم التقديم بنجاح");
    setTimeout(() => {
      window.location.href = "applied-jobs.html?tab=applied";
    }, 1000);
  });
}

function setupModals() {
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal("detailsModal"));
  });

  document.querySelectorAll("[data-close-apply]").forEach((button) => {
    button.addEventListener("click", () => closeModal("applyModal"));
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function getAssessment() {
  try {
    return JSON.parse(window.localStorage.getItem("skillbridgeAssessmentResult") || "null");
  } catch (error) {
    return null;
  }
}

function getPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function savePassport(passport) {
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function getStoredList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function setStoredList(key, list) {
  window.localStorage.setItem(key, JSON.stringify(list));
}

function findJobById(id) {
  return studentJobs.find((job) => job.id === id);
}

function mapToJobDnaId(title) {
  if (title === "Junior Data Analyst" || title === "BI Intern") return "data-analyst";
  if (title === "Product Operations Intern") return "product-ops";
  return "frontend-dev";
}

function isJobSaved(id) {
  return getStoredList(SAVED_JOBS_KEY).some((job) => job.id === id);
}

function toggleSavedJob(id) {
  const job = findJobById(id);
  if (!job) return;
  const saved = getStoredList(SAVED_JOBS_KEY);
  const exists = saved.some((item) => item.id === id);
  const next = exists ? saved.filter((item) => item.id !== id) : [...saved, job];
  setStoredList(SAVED_JOBS_KEY, next);
  syncPassportSavedJobs(next);
}

function saveAppliedJob(id) {
  const job = findJobById(id);
  if (!job) return;
  const applied = getStoredList(APPLIED_JOBS_KEY);
  if (applied.some((item) => item.id === id)) return;
  const next = [...applied, { ...job, status: "Pending Review", appliedAt: new Date().toISOString() }];
  setStoredList(APPLIED_JOBS_KEY, next);
  syncPassportApplications(next);
}

function syncPassportSavedJobs(savedJobs) {
  const passport = getPassport();
  if (!passport.name) return;
  passport.savedJobs = savedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    match: job.match
  }));
  passport.lastSeenAt = new Date().toISOString();
  savePassport(passport);
}

function syncPassportApplications(applications) {
  const passport = getPassport();
  if (!passport.name) return;
  passport.applications = applications.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    status: job.status,
    appliedAt: job.appliedAt,
    match: job.match
  }));
  passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 68);
  passport.xp = Math.max(Number(passport.xp || 0), 140) + 20;
  passport.badges = Array.from(new Set([...(passport.badges || []), "Job Hunter"]));
  passport.lastSeenAt = new Date().toISOString();
  savePassport(passport);
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
}

function formatChance(level) {
  if (level === "high") return "High Chance";
  if (level === "medium") return "Medium";
  return "Low";
}

function showToast(message) {
  const toast = document.getElementById("jobsToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
