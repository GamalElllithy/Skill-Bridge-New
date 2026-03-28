const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const ROLE_KEY = "skillbridgeUserRole";

let currentPassportView = null;

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderPassport();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("passportTopbar");
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

function renderPassport() {
  const passport = getPassport();
  const assessment = getAssessment();
  const merged = buildPassportView(passport, assessment);
  currentPassportView = merged;

  replaceText("heroGreeting", `${merged.firstName}, You’re ${merged.jobReadiness}% Job Ready 🔥`);
  replaceText("heroRole", merged.roleTitle);
  replaceText("heroLocation", merged.location);
  replaceText("talentSummary", merged.summary);
  replaceText("jobReadyPercent", `${merged.jobReadiness}%`);
  replaceText("talentScore", `${merged.talentScore} / 100`);
  replaceText("xpValue", `${merged.xp} XP`);
  replaceText("levelValue", merged.levelLabel);
  replaceText("smartInsight", merged.smartInsight);
  replaceText("savedJobsCount", String(merged.savedJobs.length));
  replaceText("applicationsCount", String(merged.applications.length));
  replaceText("projectsCount", String(merged.projects.length));
  replaceText("careerProgressLabel", `${merged.jobReadiness}%`);
  replaceText("nextGoalText", merged.nextGoal);
  replaceText("qrLabel", `QR • Updated ${merged.lastUpdated}`);
  replaceText("shareHubMeta", `Updated ${merged.lastUpdated} with your latest skills, badges, and readiness.`);

  const avatar = document.getElementById("passportAvatar");
  if (avatar) avatar.textContent = merged.avatar;

  const readinessRing = document.getElementById("readinessRing");
  if (readinessRing) {
    const circumference = 301.59;
    const offset = circumference - (circumference * merged.jobReadiness) / 100;
    readinessRing.style.strokeDashoffset = `${offset}`;
  }

  const progressBar = document.getElementById("careerProgressBar");
  if (progressBar) progressBar.style.width = `${merged.jobReadiness}%`;

  renderDnaBars(merged.dna);
  renderSkills(merged.skillsWithLevels, merged.badges);
  renderProjects(merged.projects);
  renderMatchJobs(merged.matchJobs);
  renderTimeline(merged.timeline);
  renderStrengthGap(merged.strengths, merged.gaps);
  renderRecruiterMode(merged);
  renderPdfPreview(merged);
}

function buildPassportView(passport, assessment) {
  const name = passport.name || "Gamal Ellithy";
  const firstName = name.split(" ")[0];
  const track = passport.track || assessment?.careerPath || "Data Analysis";
  const skills = Array.isArray(passport.skills) && passport.skills.length
    ? passport.skills
    : ["Python", "SQL", "Excel", "Data Cleaning"];
  const strengths = Array.isArray(assessment?.strengths) && assessment.strengths.length
    ? assessment.strengths
    : skills.slice(0, 3);
  const gaps = Array.isArray(assessment?.weaknesses) && assessment.weaknesses.length
    ? assessment.weaknesses
    : ["SQL Advanced", "Presentation", "Dashboard Depth"];
  const xp = Number(passport.xp || 1240);
  const applications = Array.isArray(passport.applications) ? passport.applications : [];
  const savedJobs = Array.isArray(passport.savedJobs) ? passport.savedJobs : [];
  const projects = buildProjects(passport.projects, track);
  const jobReadiness = Math.max(Number(passport.jobReadiness || 0), 68);
  const talentScore = Math.min(100, Math.round(jobReadiness + Math.min(strengths.length * 4, 12)));
  const roleTitle = `Aspiring ${track === "Talent in Progress" ? "Data Analyst" : track}`;
  const dna = buildDna(skills, strengths);

  return {
    firstName,
    fullName: name,
    avatar: passport.avatar || getInitials(name),
    roleTitle,
    location: passport.location || "Cairo, Egypt",
    summary: generateSummary(track, strengths, passport.status || "Available"),
    smartInsight: generateInsight(track, gaps),
    xp,
    levelLabel: passport.levelLabel || "Explorer",
    jobReadiness,
    talentScore,
    lastUpdated: formatDate(new Date()),
    skillsWithLevels: skills.map((skill, index) => ({
      name: skill,
      level: Math.max(58, 82 - index * 6)
    })),
    dna,
    strengths,
    gaps,
    badges: Array.isArray(passport.badges) && passport.badges.length
      ? passport.badges
      : ["Python Starter", "Fast Learner", "Data Explorer"],
    projects,
    savedJobs,
    applications,
    matchJobs: buildMatchJobs(track, applications, savedJobs),
    nextGoal: gaps.length ? `تعلم ${gaps[0]} لزيادة فرصك 20%` : "كمّل مشاريعك العملية لرفع القبول",
    timeline: buildTimeline(passport, assessment, applications)
  };
}

function buildProjects(projects, track) {
  if (Array.isArray(projects) && projects.length) {
    return projects.slice(0, 3).map((project, index) => ({
      title: project.title || `Project ${index + 1}`,
      summary: project.summary || "مشروع عملي يثبت القدرة على التطبيق وليس التعلم فقط.",
      stack: Array.isArray(project.skills) && project.skills.length ? project.skills : ["Python", "SQL", "Insights"]
    }));
  }

  if (track.toLowerCase().includes("software")) {
    return [
      { title: "Task Manager App", summary: "تطبيق لإدارة المهام مع APIs وواجهة واضحة.", stack: ["React", "APIs", "State"] },
      { title: "Portfolio Website", summary: "موقع شخصي يعرض الأعمال والمهارات بشكل احترافي.", stack: ["HTML", "CSS", "JS"] }
    ];
  }

  return [
    { title: "Customer Insights Dashboard", summary: "تحليل بيانات مبيعات واستخراج insights تساعد القرار.", stack: ["Python", "SQL", "Dashboard"] },
    { title: "Retail Performance Report", summary: "تقرير مرئي يوضح الاتجاهات الرئيسية ونقاط التحسن.", stack: ["Excel", "Visualization", "Storytelling"] }
  ];
}

function buildDna(skills, strengths) {
  return [
    { label: strengths[0] || "Problem Solving", value: 85 },
    { label: skills[0] || "Python", value: 75 },
    { label: "Communication", value: 60 }
  ];
}

function buildMatchJobs(track, applications, savedJobs) {
  const base = track.toLowerCase().includes("software")
    ? [
        { title: "Frontend Intern", match: 80 },
        { title: "Junior Developer", match: 73 }
      ]
    : [
        { title: "Data Intern", match: 82 },
        { title: "Junior Analyst", match: 75 }
      ];

  const dynamic = applications.concat(savedJobs).slice(0, 1).map((job) => ({
    title: job.title,
    match: job.match || 78
  }));

  return [...dynamic, ...base].slice(0, 3);
}

function buildTimeline(passport, assessment, applications) {
  const items = [];

  if (assessment?.careerPath || assessment?.fullTitle) {
    items.push({
      title: "تم إنشاء Talent DNA",
      copy: assessment.fullTitle || assessment.careerPath || "تم تحديد اتجاهك المهني الأولي"
    });
  }

  if (Array.isArray(passport.completedSteps) && passport.completedSteps.length) {
    passport.completedSteps.slice(0, 3).forEach((stepId) => {
      items.push({
        title: "تم إنهاء خطوة تعلم",
        copy: `أنهيت ${formatStepName(stepId)} وتمت إضافتها للبروفايل تلقائيًا`
      });
    });
  }

  if (applications.length) {
    items.push({
      title: "قدّمت على وظيفة",
      copy: `آخر تقديم كان على ${applications[applications.length - 1].title}`
    });
  }

  if (!items.length) {
    items.push(
      { title: "بدأت رحلتك", copy: "تم إنشاء Passport ذكي يربط التعلم والوظائف والتقدم." },
      { title: "الخطوة التالية", copy: "كمّل Learning Path لرفع Job Readiness بسرعة." }
    );
  }

  return items;
}

function generateSummary(track, strengths, status) {
  const focus = strengths.slice(0, 2).join(" و");
  return `${track.includes("Aspiring") ? track : `متخصص ${track}`} يمتلك نقاط قوة واضحة في ${focus}، وحالته الحالية ${status.toLowerCase() === "available" ? "جاهز للفرص" : status}، ويبحث عن فرصة عملية تطور مستواه بسرعة.`;
}

function generateInsight(track, gaps) {
  if (track.toLowerCase().includes("software")) {
    return "الشركات بتدور على مشاريع React وAPIs في أغلب الوظائف المشابهة لك.";
  }
  return `الشركات بتدور على مهارة ${gaps[0] || "SQL"} في 60% من الوظائف المشابهة لك.`;
}

function renderDnaBars(items) {
  const container = document.getElementById("dnaBars");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <div class="dna-item">
      <div class="dna-head">
        <strong>${item.label}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="dna-bar"><span style="width:${item.value}%"></span></div>
    </div>
  `).join("");
}

function renderSkills(skills, badges) {
  const skillsBox = document.getElementById("topSkills");
  const badgeBox = document.getElementById("badgeList");
  if (skillsBox) {
    skillsBox.innerHTML = skills.map((skill) => `
      <span class="skill-chip">${skill.name}<strong>${skill.level}%</strong></span>
    `).join("");
  }
  if (badgeBox) {
    badgeBox.innerHTML = badges.map((badge) => `<span class="badge-pill">${badge}</span>`).join("");
  }
}

function renderProjects(projects) {
  const container = document.getElementById("bestProjects");
  if (!container) return;

  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-cover"></div>
      <div class="project-head">
        <strong>${project.title}</strong>
      </div>
      <p>${project.summary}</p>
      <div class="project-tech">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
      <a class="project-link" href="talent-dna.html">View Project</a>
    </article>
  `).join("");
}

function renderMatchJobs(jobs) {
  const container = document.getElementById("matchReadyJobs");
  if (!container) return;

  container.innerHTML = jobs.map((job) => `
    <article class="match-card">
      <div class="match-head">
        <strong>${job.title}</strong>
        <span class="match-pill">${job.match}% Match</span>
      </div>
      <p class="match-percent">جاهز للتقديم مع قابلية تحسن واضحة</p>
      <a class="tiny-link" href="smart-jobs.html">View Jobs</a>
    </article>
  `).join("");
}

function renderTimeline(items) {
  const container = document.getElementById("growthTimeline");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <article class="timeline-item">
      <span class="timeline-dot"></span>
      <div>
        <strong>${item.title}</strong>
        <span>${item.copy}</span>
      </div>
    </article>
  `).join("");
}

function renderStrengthGap(strengths, gaps) {
  const strengthBox = document.getElementById("strengthList");
  const gapBox = document.getElementById("gapList");
  if (strengthBox) {
    strengthBox.innerHTML = strengths.map((item) => `<span class="stack-badge">${item}</span>`).join("");
  }
  if (gapBox) {
    gapBox.innerHTML = gaps.map((item) => `<span class="stack-gap">${item}</span>`).join("");
  }
}

function renderRecruiterMode(view) {
  const recruiterPanel = document.getElementById("recruiterPanel");
  if (!recruiterPanel) return;

  const isCompany = window.localStorage.getItem(ROLE_KEY) === "company";
  recruiterPanel.classList.toggle("hidden", !isCompany);

  if (isCompany) {
    replaceText("recruiterCopy", `المرشح مناسب للمقابلة المبدئية ويظهر توافقًا واضحًا مع أدوار ${view.matchJobs[0]?.title || "Data Intern"}.`);
  }
}

function renderPdfPreview(view) {
  const container = document.getElementById("passportPdfPreview");
  if (!container) return;

  container.innerHTML = `
    <article class="pdf-preview-card">
      <div class="pdf-preview-head">
        <div>
          <h3>${view.fullName}</h3>
          <p>${view.roleTitle}</p>
        </div>
        <span class="match-pill">${view.jobReadiness}% Ready</span>
      </div>
      <div class="pdf-preview-meta">
        <strong>Talent Summary</strong>
        <p>${view.summary}</p>
      </div>
      <div class="pdf-preview-skills">
        ${view.skillsWithLevels.map((skill) => `<span class="skill-chip">${skill.name}<strong>${skill.level}%</strong></span>`).join("")}
      </div>
      <div class="pdf-preview-timeline">
        <strong>Growth Timeline</strong>
        ${view.timeline.slice(0, 3).map((item) => `<span>${item.title} — ${item.copy}</span>`).join("")}
      </div>
    </article>
  `;
}

function setupActions() {
  const shareButtons = [
    "copyProfileBtn",
    "hubCopyBtn"
  ];

  shareButtons.forEach((id) => {
    const button = document.getElementById(id);
    button?.addEventListener("click", copyProfileLink);
  });

  const openShareHubButtons = ["shareProfileBtn", "heroShareBtn"];
  openShareHubButtons.forEach((id) => {
    const button = document.getElementById(id);
    button?.addEventListener("click", () => openModal("passportShareModal"));
  });

  const previewButtons = ["downloadPassportBtn", "downloadCvBtn", "hubPreviewPdfBtn"];
  previewButtons.forEach((id) => {
    const button = document.getElementById(id);
    button?.addEventListener("click", () => openModal("passportPdfModal"));
  });

  document.getElementById("confirmPrintBtn")?.addEventListener("click", () => {
    window.print();
  });

  ["qrPreviewBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => openModal("passportShareModal"));
  });

  ["whatsAppShareBtn", "hubWhatsAppBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", shareViaWhatsApp);
  });

  ["emailShareBtn", "hubEmailBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", shareViaEmail);
  });

  const inviteBtn = document.getElementById("inviteInterviewBtn");
  if (inviteBtn) {
    inviteBtn.addEventListener("click", () => showToast("تم تجهيز دعوة المقابلة المبدئية."));
  }

  const contactBtn = document.getElementById("contactCandidateBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => showToast("تم تجهيز وسيلة التواصل مع المرشح."));
  }

  document.querySelectorAll("[data-close-share]").forEach((button) => {
    button.addEventListener("click", () => closeModal("passportShareModal"));
  });

  document.querySelectorAll("[data-close-pdf]").forEach((button) => {
    button.addEventListener("click", () => closeModal("passportPdfModal"));
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

function shareViaWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check my Candidate Passport on Skill Bridge — ${currentPassportView?.roleTitle || "Candidate Passport"}`);
  window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
}

function shareViaEmail() {
  const subject = encodeURIComponent("Candidate Passport");
  const body = encodeURIComponent(`Here is my Candidate Passport: ${window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copyProfileLink() {
  const url = window.location.href;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("تم نسخ رابط البروفايل.");
    }).catch(() => {
      showToast("تعذر نسخ الرابط، لكن يمكنك نسخه يدويًا.");
    });
    return;
  }

  showToast("تعذر نسخ الرابط، لكن يمكنك نسخه يدويًا.");
}

function getPassport() {
  return getStoredJson(PASSPORT_KEY, {});
}

function getAssessment() {
  return getStoredJson(ASSESSMENT_KEY, {});
}

function getStoredJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function formatStepName(stepId) {
  if (stepId === "foundations") return "Step 1 — Foundations";
  if (stepId === "practice") return "Step 2 — Practice";
  if (stepId === "advanced") return "Step 3 — Advanced";
  return stepId;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function showToast(message) {
  const toast = document.getElementById("passportToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
