const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderTalentDna();
});

function setupMenu() {
  const topbar = document.getElementById("dnaTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");

  toggle?.addEventListener("click", () => {
    topbar?.classList.toggle("is-open");
  });

  window.addEventListener("scroll", () => {
    topbar?.classList.toggle("is-scrolled", window.scrollY > 24);
  });
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

function renderTalentDna() {
  const passport = readJson(PASSPORT_KEY, {});
  const assessment = readJson(ASSESSMENT_KEY, {});
  const profile = buildProfile(passport, assessment);

  replaceText("dnaHeroTitle", `أنت الأقرب إلى ${profile.track}`);
  replaceText("dnaHeroCopy", profile.summary);
  replaceText("dnaPersona", profile.persona);
  replaceText("dnaTrack", profile.track);
  replaceText("dnaMatch", `${profile.match}% Match`);
  replaceText("profileName", profile.name);
  replaceText("profileAvatar", profile.avatar);
  replaceText("journeyStageTitle", profile.stageTitle);
  replaceText("journeyStageCopy", profile.stageCopy);
  replaceText("journeyProgressValue", `${profile.progress}%`);
  replaceText("profileCompletionValue", `${profile.completion}%`);
  replaceText("dnaStyles", profile.styles);
  replaceText("dnaNextStep", profile.nextStep);
  replaceText("finalCtaCopy", profile.ctaCopy);

  setWidth("journeyProgressBar", profile.progress);
  setWidth("profileCompletionBar", profile.completion);

  fillList("dnaStrengths", profile.strengths);
  fillList("dnaWeaknesses", profile.weaknesses);
  fillList("dnaPaths", profile.paths);
  fillDnaBars(profile.dna);
  fillRoadmap(profile.roadmap);
  fillBadges(profile.badges);
  fillProjects(profile.projects);
  fillPassportSummary(profile);
  renderFlowState(profile.progress);
}

function buildProfile(passport, assessment) {
  const name = passport.name || "Student";
  const track = passport.track || assessment.careerPath || "Data Analysis";
  const strengths = takeList(
    assessment.strengths,
    passport.strengths,
    ["التفكير التحليلي", "حل المشكلات", "التنفيذ العملي"]
  );
  const weaknesses = takeList(
    assessment.weaknesses,
    passport.weaknesses,
    ["Presentation", "Portfolio Depth", "Advanced Tools"]
  );
  const paths = takeList(
    assessment.paths,
    [track],
    ["Data Analysis", "Business Intelligence", "Product Analytics"]
  );
  const dna = Array.isArray(assessment.dna) && assessment.dna.length
    ? assessment.dna
    : inferDna(track);
  const skills = Array.isArray(passport.skills) && passport.skills.length
    ? passport.skills
    : strengths.slice(0, 3);
  const projects = Array.isArray(passport.projects) && passport.projects.length
    ? passport.projects.slice(0, 3)
    : [];
  const badges = Array.isArray(passport.badges) && passport.badges.length
    ? passport.badges.slice(0, 4)
    : ["Explorer"];

  const progress = Math.max(Number(passport.learningProgress || passport.jobReadiness || 0), 38);
  const completion = buildCompletion(passport, assessment, skills, projects);
  const stage = getStage(progress);

  return {
    name,
    avatar: passport.avatar || initials(name),
    track,
    persona: formatPersona(assessment.persona, track),
    match: Math.min(94, Math.max(Number(passport.jobReadiness || 0), inferMatch(dna))),
    summary: assessment.copy || `واضح من بياناتك الحالية إن مسارك الأقرب هو ${track}، والخطوة الأهم الآن هي تحويل النتيجة إلى تنفيذ فعلي.`,
    styles: assessment.styles || inferStyles(track),
    strengths,
    weaknesses,
    paths,
    dna,
    progress,
    completion,
    stageTitle: stage.title,
    stageCopy: stage.copy,
    nextStep: assessment.next || `ابدأ بتقوية ${weaknesses[0] || skills[0] || "أهم مهارة"} ثم ارجع للـ Dashboard أو افتح الوظائف المناسبة.`,
    roadmap: buildRoadmap(track, skills, weaknesses, projects.length > 0),
    projects,
    badges,
    ctaCopy: progress >= 70
      ? "أنت قريب من مرحلة التقديم، فابدأ من الوظائف المناسبة ثم راقب الـ match."
      : "أنت في مرحلة بناء القوة. ابدأ من خطة التعلم ثم ارجع للوظائف بعد الخطوة التالية."
  };
}

function buildCompletion(passport, assessment, skills, projects) {
  let completion = 24;

  if (passport.name) completion += 12;
  if (passport.email) completion += 10;
  if (passport.phone) completion += 10;
  if (passport.track || assessment.careerPath) completion += 16;
  if (skills.length >= 3) completion += 14;
  if (passport.about || passport.experience) completion += 8;
  if (projects.length) completion += 14;

  return Math.min(completion, 96);
}

function getStage(progress) {
  if (progress >= 75) {
    return {
      title: "Apply",
      copy: "أنت قريب من التقديم على وظائف مناسبة. راجع الفرص الحالية ثم حدّث الـ Passport لو لزم."
    };
  }

  if (progress >= 45) {
    return {
      title: "Build Skills",
      copy: "النتيجة ظهرت، والخطوة الأهم الآن هي تقوية المهارة التالية ثم التحرك نحو أول فرصة مناسبة."
    };
  }

  return {
    title: "Discover Path",
    copy: "أنت لسه في أول الرحلة. ثبّت تخصصك ومهاراتك الأساسية قبل الانتقال لمرحلة التقديم."
  };
}

function renderFlowState(progress) {
  const skillsStep = document.getElementById("skillsStep");
  const applyStep = document.getElementById("applyStep");
  const hireStep = document.getElementById("hireStep");

  if (!skillsStep || !applyStep || !hireStep) return;

  skillsStep.classList.toggle("is-done", progress >= 70);
  skillsStep.classList.toggle("is-active", progress >= 35 && progress < 70);
  applyStep.classList.toggle("is-active", progress >= 70 && progress < 90);
  applyStep.classList.toggle("is-done", progress >= 90);
  hireStep.classList.toggle("is-active", progress >= 90);
}

function fillList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function fillDnaBars(items) {
  const el = document.getElementById("dnaBars");
  if (!el) return;

  el.innerHTML = items.map((item) => `
    <div class="dna-bar">
      <div class="dna-bar-head">
        <span>${item.label}</span>
        <span>${item.value}%</span>
      </div>
      <div class="progress-track compact">
        <span style="width:${item.value}%"></span>
      </div>
    </div>
  `).join("");
}

function fillRoadmap(items) {
  const el = document.getElementById("roadmapList");
  if (!el) return;

  el.innerHTML = items.map((item, index) => `
    <article class="roadmap-step">
      <span>${index + 1}</span>
      <div>
        <strong>${item.title}</strong>
        <p>${item.copy}</p>
      </div>
    </article>
  `).join("");
}

function fillBadges(items) {
  const el = document.getElementById("badgeList");
  if (!el) return;

  el.innerHTML = items.map((item) => `<span>${item}</span>`).join("");
}

function fillProjects(items) {
  const el = document.getElementById("projectList");
  if (!el) return;

  if (!items.length) {
    el.innerHTML = `
      <article class="project-item empty">
        <strong>لا يوجد مشروع مضاف بعد</strong>
        <p>إضافة مشروع واحد فقط سترفع قوة البروفايل بسرعة.</p>
      </article>
    `;
    return;
  }

  el.innerHTML = items.map((project) => `
    <article class="project-item">
      <strong>${project.title || "Project"}</strong>
      <p>${project.summary || "Project added to support your profile."}</p>
    </article>
  `).join("");
}

function fillPassportSummary(profile) {
  const el = document.getElementById("passportSummary");
  if (!el) return;

  el.innerHTML = `
    <div><span>Top Skill</span><strong>${profile.strengths[0] || "--"}</strong></div>
    <div><span>Next Focus</span><strong>${profile.weaknesses[0] || "--"}</strong></div>
    <div><span>Projects</span><strong>${profile.projects.length}</strong></div>
    <div><span>Readiness</span><strong>${profile.match}%</strong></div>
  `;
}

function buildRoadmap(track, skills, weaknesses, hasProject) {
  return [
    {
      title: `قوّي ${weaknesses[0] || skills[0] || "أهم مهارة"}`,
      copy: "ابدأ بالخطوة التي ترفع الـ match بسرعة بدل توزيع مجهودك على حاجات كثيرة."
    },
    {
      title: `ثبّت ${skills[0] || "مهارة أساسية"} بمشروع صغير`,
      copy: hasProject ? "حدّث مشروعك الحالي ليكون أوضح للشركات." : "أنشئ مشروعًا بسيطًا يثبت أنك قريب من هذا المسار."
    },
    {
      title: `قدّم على وظائف ${track}`,
      copy: "بعد تقوية الخطوتين السابقتين، افتح Smart Jobs وابدأ التقديم على الفرص المناسبة."
    }
  ];
}

function inferDna(track) {
  const lower = String(track || "").toLowerCase();

  if (lower.includes("design")) {
    return [
      { label: "Creativity", value: 84 },
      { label: "Empathy", value: 73 },
      { label: "Execution", value: 62 }
    ];
  }

  if (lower.includes("business") || lower.includes("marketing") || lower.includes("product")) {
    return [
      { label: "Communication", value: 82 },
      { label: "Leadership", value: 74 },
      { label: "Analysis", value: 58 }
    ];
  }

  return [
    { label: "Analysis", value: 82 },
    { label: "Execution", value: 76 },
    { label: "Focus", value: 68 }
  ];
}

function inferStyles(track) {
  const lower = String(track || "").toLowerCase();

  if (lower.includes("design")) {
    return "Thinking Style: Creative / Empathetic. Work Style: Flexible / Experience-driven.";
  }

  if (lower.includes("business") || lower.includes("marketing") || lower.includes("product")) {
    return "Thinking Style: Social / Strategic. Work Style: Team / Fast-moving.";
  }

  return "Thinking Style: Analytical / Practical. Work Style: Structured / Builder.";
}

function inferMatch(dna) {
  if (!Array.isArray(dna) || !dna.length) return 68;
  return Math.round(dna.reduce((total, item) => total + Number(item.value || 0), 0) / dna.length);
}

function formatPersona(persona, track) {
  const personaMap = {
    analyst: "Analyst Mindset",
    builder: "Builder Mindset",
    creator: "Creator Mindset",
    communicator: "Communicator Mindset"
  };

  if (personaMap[persona]) return personaMap[persona];

  if (String(track || "").toLowerCase().includes("design")) return "Creator Mindset";
  if (String(track || "").toLowerCase().includes("business")) return "Communicator Mindset";
  return "Builder Mindset";
}

function takeList(first, second, fallback) {
  if (Array.isArray(first) && first.length) return first.slice(0, 4);
  if (Array.isArray(second) && second.length) return second.slice(0, 4);
  return fallback.slice(0, 4);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) {
    el.textContent = value;
  }
}

function setWidth(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.style.width = `${value}%`;
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
