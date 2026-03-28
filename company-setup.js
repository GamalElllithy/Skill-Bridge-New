const COMPANY_SETUP_KEY = "skillbridgeCompanySetup";
const ROLE_KEY = "skillbridgeUserRole";

const industryMap = {
  default: {
    subfields: ["General Tech", "Digital Products", "Services"],
    skills: ["Communication", "Problem Solving", "Ownership"],
    suggestions: [
      "ابدأ بتحديد 2-3 أدوار أساسية فقط",
      "اختَر حد أدنى واضح للـ match",
      "أضف قيم الشركة لرفع جودة الترشيح"
    ]
  },
  tech: {
    subfields: ["SaaS", "Web Products", "Developer Tools"],
    skills: ["JavaScript", "React", "APIs", "Problem Solving"],
    suggestions: [
      "Technology teams usually benefit from fast learners",
      "Frontend + Backend roles give better candidate variety",
      "حدد الـ core stack لزيادة دقة الـ matching"
    ]
  },
  ai: {
    subfields: ["Machine Learning", "Data Platforms", "Analytics"],
    skills: ["Python", "SQL", "Data Visualization", "Analytical Thinking"],
    suggestions: [
      "AI / Data companies often need analytical candidates with projects",
      "Internship-friendly hiring opens a stronger junior pool",
      "أضف SQL وPython ضمن preferred skills"
    ]
  },
  fintech: {
    subfields: ["Payments", "Lending", "Risk", "Banking Tech"],
    skills: ["SQL", "Accuracy", "Ownership", "Compliance Mindset"],
    suggestions: [
      "Fintech teams benefit from careful hiring and high consistency",
      "حدد work style بوضوح لأن بعض الأدوار حساسة جدًا",
      "أضف culture tags مثل reliable وstructured"
    ]
  },
  design: {
    subfields: ["Brand", "Product Design", "Creative Studio"],
    skills: ["Figma", "Research", "Storytelling", "Creative Thinking"],
    suggestions: [
      "Design companies benefit from visible portfolios and presentation skills",
      "أضف UI/UX وMarketing لو محتاج hybrid creatives",
      "Use culture tags like innovative and flexible"
    ]
  }
};

const stepMessages = [
  "ابدأ بهوية الشركة، فهي أساس كل الترشيحات الذكية.",
  "حدد المجال بدقة ليقترح لك النظام roles وskills مناسبة.",
  "حجم الشركة وأسلوب التوظيف يغيران نوعية المرشحين المتوقعة.",
  "اختَر الوظائف الأساسية التي تريد المنصة أن تخدمها أولًا.",
  "هنا يتكون Company DNA الذي سيؤثر على matching لاحقًا.",
  "آخر خطوة قبل تشغيل الترشيحات الذكية والـ dashboard."
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupIntro();
  setupWizard();
});

function setupMenu() {
  const topbar = document.getElementById("setupTopbar");
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
  const intro = document.getElementById("setupIntro");
  const start = document.getElementById("startSetupBtn");
  const continueBtn = document.getElementById("continueSavedBtn");
  const saved = getCompanySetup();

  if (continueBtn && (!saved.companyName && !saved.industry)) {
    continueBtn.textContent = "Use Smart Defaults";
  }

  if (start) {
    start.addEventListener("click", () => closeIntro());
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      closeIntro();
      if (saved.companyName || saved.industry) {
        showToast("تم تحميل الإعداد المحفوظ.");
      } else {
        applySmartDefaults();
        showToast("تم تطبيق إعدادات ذكية كبداية.");
      }
    });
  }

  function closeIntro() {
    if (!intro) return;
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
  }
}

function setupWizard() {
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const next = document.getElementById("nextStepBtn");
  const prev = document.getElementById("prevStepBtn");
  const finish = document.getElementById("finishSetupBtn");
  const reset = document.getElementById("resetSetupBtn");
  const saveLater = document.getElementById("saveLaterBtn");
  const saveLaterTop = document.getElementById("saveLaterTopBtn");

  if (!steps.length || !next || !prev || !finish) return;

  hydrateFromStorage();
  wireDynamicInputs();
  updatePreview();

  let current = Math.max(0, Math.min(steps.length - 1, Number(getCompanySetup().currentStep || 0)));

  function render() {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));

    const progress = Math.round(((current + 1) / steps.length) * 100);
    const score = calculateSetupScore();

    replaceText("progressLabel", `Step ${current + 1} / ${steps.length}`);
    replaceText("progressCopy", stepMessages[current]);
    replaceText("setupScoreValue", `${score}%`);

    const progressBar = document.getElementById("setupProgressBar");
    if (progressBar) progressBar.style.width = `${progress}%`;

    prev.classList.toggle("hidden", current === 0);
    next.classList.toggle("hidden", current === steps.length - 1);
    finish.classList.toggle("hidden", current !== steps.length - 1);

    persistCurrentStep(current);
    updatePreview();
  }

  next.addEventListener("click", () => {
    if (!validateStep(current)) return;
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
    if (!validateStep(current)) return;
    const profile = buildCompanyProfile(true);
    window.localStorage.setItem(ROLE_KEY, "company");
    window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(profile));
    showToast("Your Smart Hiring Profile is ready!");
    setTimeout(() => {
      window.location.href = "company-dashboard.html";
    }, 1000);
  });

  if (reset) {
    reset.addEventListener("click", () => {
      window.localStorage.removeItem(COMPANY_SETUP_KEY);
      window.location.reload();
    });
  }

  [saveLater, saveLaterTop].forEach((button) => {
    if (!button) return;
    button.addEventListener("click", () => {
      window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(buildCompanyProfile(false)));
      showToast("تم حفظ الإعداد ويمكنك العودة لاحقًا.");
    });
  });

  render();
}

function wireDynamicInputs() {
  const industry = document.getElementById("companyIndustry");
  const minimumMatch = document.getElementById("minimumMatch");
  const timeline = document.getElementById("hiringTimeline");

  document.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
  });

  document.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => {
      setSingleActive("[data-size]", button);
      applySizeDefaults(button.getAttribute("data-size"));
      updatePreview();
    });
  });

  document.querySelectorAll("[data-style]").forEach((button) => {
    button.addEventListener("click", () => {
      setSingleActive("[data-style]", button);
      updatePreview();
    });
  });

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      updatePreview();
    });
  });

  document.querySelectorAll("[data-personality]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      updatePreview();
    });
  });

  document.querySelectorAll("[data-culture]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      updatePreview();
    });
  });

  if (industry) {
    industry.addEventListener("change", () => {
      updateIndustryUi(industry.value || "default");
      updatePreview();
    });
  }

  if (minimumMatch) {
    minimumMatch.addEventListener("input", () => {
      replaceText("minimumMatchValue", `${minimumMatch.value}%`);
    });
  }

  if (timeline) {
    timeline.addEventListener("input", () => {
      replaceText("hiringTimelineValue", mapTimelineValue(timeline.value));
    });
  }
}

function updatePreview() {
  const profile = buildCompanyProfile(false);
  const industryData = industryMap[profile.industry || "default"] || industryMap.default;
  document.body.setAttribute("data-industry", profile.industry || "default");
  window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify({
    ...profile,
    currentStep: getCompanySetup().currentStep || 0
  }));

  const logo = document.getElementById("previewLogo");
  if (logo) logo.textContent = profile.logo || "SB";

  replaceText("previewCompanyName", profile.companyName || "Your Company");
  replaceText("previewIndustry", `${profile.industryLabel || "Industry"} • ${profile.subfield || "Focus"}`);
  replaceText("previewMission", profile.mission || "Your live company card appears here as you fill out the setup.");
  replaceText("previewLocation", profile.location || "Remote");
  replaceText("previewWebsite", profile.website || "company.com");
  replaceText("dnaStatus", profile.roles.length ? "Ready" : "Building");

  const roles = document.getElementById("previewRoles");
  if (roles) {
    roles.innerHTML = profile.roles.length
      ? profile.roles.map((role) => `<span>${role}</span>`).join("")
      : `<span>Roles will appear here</span>`;
  }

  renderSubfields(profile.industry || "default");
  renderSuggestions(industryData, profile);
  renderSimulation(profile);
  renderAiPreview(profile, industryData);

  replaceText("setupScoreValue", `${calculateSetupScore()}%`);
}

function renderSubfields(industryKey) {
  const subfield = document.getElementById("companySubfield");
  if (!subfield) return;

  const currentValue = subfield.value;
  const options = (industryMap[industryKey] || industryMap.default).subfields;
  subfield.innerHTML = `<option class="option_bg" value="">Choose Sub-field</option>${options.map((item) => `<option class="option_bg"   value="${item}">${item}</option>`).join("")}`;
  if (options.includes(currentValue)) subfield.value = currentValue;
}

function renderSuggestions(industryData, profile) {
  const skillsBox = document.getElementById("suggestedSkills");
  const suggestionList = document.getElementById("smartSuggestions");
  if (skillsBox) {
    skillsBox.innerHTML = industryData.skills.map((skill) => `<button class="role-tag active" type="button">${skill}</button>`).join("");
  }
  if (suggestionList) {
    suggestionList.innerHTML = industryData.suggestions.map((item) => `
      <article class="suggestion-item">
        <strong>${profile.companyName || "Your Company"}</strong>
        <span>${item}</span>
      </article>
    `).join("");
  }
}

function renderSimulation(profile) {
  const rolesWeight = Math.min(profile.roles.length * 7, 24);
  const minimumMatchValue = Number(profile.minimumMatch || 70);
  const learnersBoost = profile.acceptLearners ? 8 : 0;
  const internshipBoost = profile.internshipFriendly ? 6 : 0;
  const simulation = Math.max(52, Math.min(95, 48 + rolesWeight + learnersBoost + internshipBoost - Math.round((minimumMatchValue - 60) * 0.4)));

  replaceText("simulationValue", `${simulation}%`);
  replaceText("simulationCopy", `Based on your input, you will receive ${profile.hiringStyle.toLowerCase()} ${profile.skillLevel.toLowerCase()} ${profile.roles[0] || "talent"} candidates with stronger matching quality.`);

  const bar = document.getElementById("simulationBar");
  if (bar) bar.style.width = `${simulation}%`;
}

function renderAiPreview(profile, industryData) {
  const roleText = profile.roles.length ? profile.roles.join(" / ") : "talent";
  const personality = profile.personalities.length ? profile.personalities.join(", ") : "adaptable";
  const skillLevel = profile.skillLevel || "junior";
  replaceText(
    "aiPreviewText",
    `You will receive ${profile.hiringStyle.toLowerCase()} ${skillLevel.toLowerCase()} ${roleText.toLowerCase()} candidates with ${personality.toLowerCase()} traits and strong ${industryData.skills[0].toLowerCase()} fundamentals.`
  );
}

function validateStep(index) {
  const validations = [
    () => !!getValue("companyName") && !!getValue("companyLocation"),
    () => !!getValue("companyIndustry") && !!getValue("companySubfield"),
    () => hasActive("[data-size]") && hasActive("[data-style]"),
    () => getActiveValues("[data-role]").length > 0,
    () => !!getValue("skillLevel") && !!getValue("workStyle") && getActiveValues("[data-personality]").length > 0,
    () => true
  ];

  const ok = validations[index] ? validations[index]() : true;
  if (!ok) {
    showToast("أكمل بيانات الخطوة الحالية أولًا.");
  }
  return ok;
}

function buildCompanyProfile(markReady) {
  const industryKey = getValue("companyIndustry") || "default";
  const size = getSingleActiveValue("[data-size]") || "Startup";
  const hiringStyle = getSingleActiveValue("[data-style]") || "Fast";
  const profile = {
    companyName: getValue("companyName") || " Company",
    logo: getValue("companyLogo") || getInitials(getValue("companyName") || "Skill Bridge"),
    location: getValue("companyLocation") || "Remote",
    website: getValue("companyWebsite") || "company.com",
    mission: getValue("companyMission") || "A smart company profile focused on better matching and faster hiring.",
    industry: industryKey,
    industryLabel: toLabel(industryKey),
    subfield: getValue("companySubfield") || "General Tech",
    size,
    hiringStyle,
    roles: getActiveValues("[data-role]"),
    coreTech: splitTags(getValue("coreTech")),
    skillLevel: getValue("skillLevel") || "Beginner",
    workStyle: getValue("workStyle") || "Remote",
    personalities: getActiveValues("[data-personality]"),
    cultureTags: getActiveValues("[data-culture]"),
    minimumMatch: Number(getValue("minimumMatch") || 70),
    hiringTimeline: mapTimelineValue(getValue("hiringTimeline") || 2),
    acceptLearners: document.getElementById("acceptLearners")?.checked || false,
    internshipFriendly: document.getElementById("internshipFriendly")?.checked || false,
    setupScore: calculateSetupScore(),
    currentStep: Number(document.getElementById("progressLabel")?.textContent.match(/\d+/)?.[0] || 1) - 1,
    isReady: !!markReady,
    updatedAt: new Date().toISOString()
  };

  return profile;
}

function calculateSetupScore() {
  const checks = [
    !!getValue("companyName"),
    !!getValue("companyLocation"),
    !!getValue("companyWebsite"),
    !!getValue("companyIndustry"),
    !!getValue("companySubfield"),
    hasActive("[data-size]"),
    hasActive("[data-style]"),
    getActiveValues("[data-role]").length > 0,
    !!getValue("skillLevel"),
    !!getValue("workStyle"),
    getActiveValues("[data-personality]").length > 0,
    Number(getValue("minimumMatch") || 70) >= 50
  ];

  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return Math.max(score, 15);
}

function hydrateFromStorage() {
  const data = getCompanySetup();
  if (!data || (!data.companyName && !data.industry && !data.roles?.length)) return;

  setValue("companyName", data.companyName);
  setValue("companyLogo", data.logo);
  setValue("companyLocation", data.location);
  setValue("companyWebsite", data.website);
  setValue("companyMission", data.mission);
  setValue("companyIndustry", data.industry);
  updateIndustryUi(data.industry || "default");
  setValue("companySubfield", data.subfield);
  setSingleByValue("[data-size]", data.size, "data-size");
  setSingleByValue("[data-style]", data.hiringStyle, "data-style");
  setMultiByValue("[data-role]", data.roles, "data-role");
  setValue("coreTech", Array.isArray(data.coreTech) ? data.coreTech.join(", ") : "");
  setValue("skillLevel", data.skillLevel);
  setValue("workStyle", data.workStyle);
  setMultiByValue("[data-personality]", data.personalities, "data-personality");
  setMultiByValue("[data-culture]", data.cultureTags, "data-culture");
  setValue("minimumMatch", data.minimumMatch || 70);
  setValue("hiringTimeline", data.hiringTimeline === "Fast" ? 1 : data.hiringTimeline === "Careful" ? 3 : 2);
  setChecked("acceptLearners", data.acceptLearners);
  setChecked("internshipFriendly", data.internshipFriendly);
  replaceText("minimumMatchValue", `${data.minimumMatch || 70}%`);
  replaceText("hiringTimelineValue", data.hiringTimeline || "Balanced");
}

function updateIndustryUi(industryKey) {
  document.body.setAttribute("data-industry", industryKey || "default");
  renderSubfields(industryKey || "default");
}

function applySizeDefaults(size) {
  if (size === "Startup") {
    setSingleByValue("[data-style]", "Fast", "data-style");
    setChecked("acceptLearners", true);
    setChecked("internshipFriendly", true);
  }

  if (size === "Enterprise") {
    setSingleByValue("[data-style]", "Careful", "data-style");
    setChecked("acceptLearners", false);
  }
}

function applySmartDefaults() {
  setValue("companyName", "");
  setValue("companyLogo", "TN");
  setValue("companyLocation", "Cairo, Egypt");
  setValue("companyWebsite", "technova.ai");
  setValue("companyMission", "We build smart digital products and love hiring fast-learning talent.");
  setValue("companyIndustry", "tech");
  updateIndustryUi("tech");
  setValue("companySubfield", "SaaS");
  setSingleByValue("[data-size]", "Startup", "data-size");
  setSingleByValue("[data-style]", "Fast", "data-style");
  setMultiByValue("[data-role]", ["Frontend", "Data"], "data-role");
  setValue("coreTech", "React, Node.js, SQL");
  setValue("skillLevel", "Beginner");
  setValue("workStyle", "Hybrid");
  setMultiByValue("[data-personality]", ["Fast Learner", "Team Player"], "data-personality");
  setMultiByValue("[data-culture]", ["Innovative", "Flexible"], "data-culture");
  setValue("minimumMatch", 70);
  replaceText("minimumMatchValue", "70%");
  setValue("hiringTimeline", 1);
  replaceText("hiringTimelineValue", "Fast");
  setChecked("acceptLearners", true);
  setChecked("internshipFriendly", true);
  updatePreview();
}

function persistCurrentStep(current) {
  const data = buildCompanyProfile(false);
  data.currentStep = current;
  window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(data));
}

function getCompanySetup() {
  try {
    return JSON.parse(window.localStorage.getItem(COMPANY_SETUP_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.value = value;
  }
}

function setChecked(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = !!value;
}

function hasActive(selector) {
  return document.querySelector(`${selector}.active`) !== null;
}

function setSingleActive(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function getSingleActiveValue(selector) {
  const active = document.querySelector(`${selector}.active`);
  if (!active) return "";
  return active.getAttribute("data-size") || active.getAttribute("data-style") || "";
}

function getActiveValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}.active`)).map((button) =>
    button.getAttribute("data-role") ||
    button.getAttribute("data-personality") ||
    button.getAttribute("data-culture") ||
    ""
  ).filter(Boolean);
}

function setSingleByValue(selector, value, attr) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", button.getAttribute(attr) === value);
  });
}

function setMultiByValue(selector, values, attr) {
  const list = Array.isArray(values) ? values : [];
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", list.includes(button.getAttribute(attr)));
  });
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitials(value) {
  return String(value || "SB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");
}

function mapTimelineValue(value) {
  if (String(value) === "1") return "Fast";
  if (String(value) === "3") return "Careful";
  return "Balanced";
}

function toLabel(key) {
  if (key === "tech") return "Technology";
  if (key === "ai") return "AI / Data";
  if (key === "fintech") return "Fintech";
  if (key === "design") return "Design Studio";
  return "Industry";
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(message) {
  const toast = document.getElementById("setupToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
