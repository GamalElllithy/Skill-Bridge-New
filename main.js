const heroMessages = [
  "90% من الطلاب لا يعرفون مسارهم الحقيقي من البداية",
  "ابدأ من 3 أسئلة فقط بدل ما تتوه في تفاصيل كثيرة",
  "SkillBridge يفهمك ثم يوجّهك للخطوة التالية مباشرة"
];

const quizMicroFeedback = {
  data: ["اختيار منطقي", "واضح إنك تميل للتحليل", "أنت أقرب للوضوح والقياس"],
  design: ["واضح إن عندك حس بصري", "أنت تميل للتجربة والشكل", "اختيارك فيه لمسة إبداع"],
  business: ["واضح إنك تتحرك مع الناس", "عندك ميل للتأثير", "أنت أقرب للأدوار القيادية"]
};

const loadingMessages = [
  "Analyzing your skills...",
  "Building your Talent DNA...",
  "Preparing your first result..."
];

const PASSPORT_KEY = "skillbridgeTalentPassport";
const QUICK_ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const DRAFT_KEY = "skillbridgeOnboardingDraft";

const quizQuestions = [
  {
    question: "تفضل العمل مع:",
    options: [
      { label: "أرقام وتحليل", track: "data" },
      { label: "تصميم وتجربة", track: "design" },
      { label: "ناس وتنظيم", track: "business" }
    ]
  },
  {
    question: "أنت أكثر:",
    options: [
      { label: "تحليلي", track: "data" },
      { label: "مبدع", track: "design" },
      { label: "قيادي", track: "business" }
    ]
  },
  {
    question: "أكثر مهمة تستمتع بها:",
    options: [
      { label: "حل مشكلة معقدة", track: "data" },
      { label: "بناء تجربة جميلة", track: "design" },
      { label: "تنظيم الفريق واتخاذ القرار", track: "business" }
    ]
  }
];

const quizResults = {
  data: {
    title: "أنت مناسب لمجال Data بنسبة 82%",
    fullTitle: "أنت مناسب لـ Data Analysis بنسبة 82%",
    description: "طريقتك تميل للتحليل، قراءة الأنماط، وتحويل المعلومات إلى قرارات واضحة.",
    personalized: "من إجاباتك واضح إنك تميل إلى التفكير التحليلي والعمل المنظم. هذا يجعلك قريبًا من مسارات مثل Data Analysis وBusiness Intelligence.",
    strengths: ["تفكير تحليلي", "ملاحظة التفاصيل", "راحة مع الأرقام"],
    paths: ["Data Analysis", "Business Intelligence", "Reporting"],
    nextStep: "ابدأ بتعلم Python أو SQL ثم افتح الـ Dashboard لتكمل الرحلة بخطة أوضح.",
    retentionHooks: [
      "نتيجتك تقرّبك من وظائف تحليل البيانات",
      "يمكنك الآن فتح Dashboard بخطوة واحدة",
      "التحليل الكامل سيعطيك قراءة أعمق"
    ],
    dnaBars: [
      { label: "Analysis", value: 82 },
      { label: "Focus", value: 76 },
      { label: "Execution", value: 68 }
    ]
  },
  design: {
    title: "أنت مناسب لمجال Design بنسبة 79%",
    fullTitle: "أنت مناسب لـ Product Design بنسبة 79%",
    description: "إجاباتك تشير إلى حس بصري قوي وقدرة على تبسيط التجربة.",
    personalized: "أنت تميل إلى صنع تجربة مفهومة وجذابة، وهذا يجعلك قريبًا من Product Design وUI/UX.",
    strengths: ["حس بصري", "تفكير إبداعي", "تبسيط التجربة"],
    paths: ["Product Design", "UI/UX", "Brand Experience"],
    nextStep: "ابدأ بتحليل منتجات تحبها ثم انتقل للـ Dashboard أو أكمل التحليل الكامل.",
    retentionHooks: [
      "نتيجتك تقرّبك من مسارات التصميم الرقمي",
      "يمكنك الآن مشاهدة المسار الأنسب لك بوضوح",
      "التحليل الكامل سيعطيك تفاصيل أكثر عن أسلوبك"
    ],
    dnaBars: [
      { label: "Creativity", value: 79 },
      { label: "Empathy", value: 72 },
      { label: "Visual Sense", value: 84 }
    ]
  },
  business: {
    title: "أنت مناسب لمجال Business بنسبة 76%",
    fullTitle: "أنت مناسب لـ Business & Operations بنسبة 76%",
    description: "لديك ميل للتواصل والقيادة وتحريك الفرق نحو أهداف واضحة.",
    personalized: "إجاباتك توضح أنك تميل إلى التنظيم والتأثير والعمل مع الناس، وهذا يقربك من Business وOperations.",
    strengths: ["القيادة", "التواصل", "تنظيم الأولويات"],
    paths: ["Operations", "Business Development", "Product Coordination"],
    nextStep: "ابدأ بفهم أساسيات العمليات أو إدارة المنتج ثم كمل رحلتك من الـ Dashboard.",
    retentionHooks: [
      "نتيجتك تقرّبك من أدوار التنظيم والتشغيل",
      "يمكنك الآن الانتقال مباشرة للخطوة التالية",
      "التحليل الكامل سيوضح نقاط قوتك بشكل أعمق"
    ],
    dnaBars: [
      { label: "Leadership", value: 76 },
      { label: "Communication", value: 82 },
      { label: "Strategy", value: 71 }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupLoadingScreen();
  setupHeader();
  setupReveal();
  setupHeroTicker();
  setupStudentFlowCtas();
  setupQuiz();
});

function setupLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingMessage = document.getElementById("loadingMessage");
  const loadingBar = document.getElementById("loadingBar");

  if (!loadingScreen || !loadingMessage || !loadingBar) return;

  let messageIndex = 0;
  let progress = 0;

  const messageInterval = window.setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingMessage.textContent = loadingMessages[messageIndex];
  }, 850);

  const progressInterval = window.setInterval(() => {
    progress += 4;
    loadingBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      window.clearInterval(progressInterval);
      window.clearInterval(messageInterval);
      loadingScreen.classList.add("is-hidden");
    }
  }, 70);
}

function setupHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
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
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
}

function setupHeroTicker() {
  const target = document.getElementById("heroDynamicText");
  if (!target) return;

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % heroMessages.length;
    target.textContent = heroMessages[index];
  }, 2400);
}

function setupStudentFlowCtas() {
  const flow = getStudentFlowState();
  const mappings = [
    { id: "landingAccessLink", href: flow.entryUrl, label: flow.entryLabel },
    { id: "nextPrimaryCta", href: flow.entryUrl, label: flow.entryLabel },
    { id: "nextSecondaryCta", href: flow.secondaryUrl, label: flow.secondaryLabel },
    { id: "resultPrimaryCta", href: flow.entryUrl, label: flow.entryLabel },
    { id: "resultSecondaryCta", href: flow.secondaryUrl, label: flow.secondaryLabel },
    { id: "footerStudentCta", href: flow.entryUrl, label: flow.entryLabel }
  ];

  mappings.forEach((item) => {
    const element = document.getElementById(item.id);
    if (!element) return;
    element.href = item.href;
    element.textContent = item.label;
  });
}

function setupQuiz() {
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const progressEl = document.getElementById("quizProgress");
  const stageEl = document.getElementById("quizStage");
  const resultEl = document.getElementById("quizResult");
  const resultOverlay = document.getElementById("resultOverlay");
  const resultBackdrop = document.getElementById("resultBackdrop");
  const resultClose = document.getElementById("resultClose");
  const resultTitle = document.getElementById("resultTitle");
  const resultAiCopy = document.getElementById("resultAiCopy");
  const resultStrengths = document.getElementById("resultStrengths");
  const resultPaths = document.getElementById("resultPaths");
  const resultNextStep = document.getElementById("resultNextStep");
  const resultProgressText = document.getElementById("resultProgressText");
  const resultHooks = document.getElementById("resultHooks");
  const dnaBars = document.getElementById("dnaBars");
  const quizFeedback = document.getElementById("quizFeedback");

  if (!questionEl || !optionsEl || !progressEl || !stageEl || !resultEl) return;

  let currentIndex = 0;
  const scores = { data: 0, design: 0, business: 0 };

  function renderQuestion() {
    const currentQuestion = quizQuestions[currentIndex];
    const progressValue = ((currentIndex + 1) / quizQuestions.length) * 100;

    stageEl.textContent = `سؤال ${currentIndex + 1} من ${quizQuestions.length}`;
    questionEl.textContent = currentQuestion.question;
    progressEl.style.width = `${progressValue}%`;
    resultEl.classList.add("hidden");

    if (quizFeedback) {
      quizFeedback.textContent = "كل اختيار هنا يقربنا لصورتك الحقيقية.";
    }

    optionsEl.innerHTML = currentQuestion.options.map((option, index) => `
      <button class="quiz-option" type="button" data-option-index="${index}">
        ${option.label}
      </button>
    `).join("");
  }

  function renderResult() {
    const bestTrack = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const result = quizResults[bestTrack];

    persistQuickAssessment(bestTrack, result);
    setupStudentFlowCtas();

    stageEl.textContent = "النتيجة جاهزة";
    questionEl.textContent = result.title;
    progressEl.style.width = "100%";
    optionsEl.innerHTML = "";
    resultEl.classList.remove("hidden");
    resultEl.innerHTML = `
      <p>${result.description}</p>
      <div class="result-actions">
        <a class="btn btn-primary" href="student-auth.html">ابدأ رحلتك الآن</a>
        <a class="btn btn-ghost" href="student-dashboard.html">شاهد الـ Dashboard</a>
      </div>
    `;

    showResultOverlay(result);
  }

  function showResultOverlay(result) {
    if (!resultOverlay || !resultTitle || !resultAiCopy || !resultStrengths || !resultPaths || !resultNextStep || !resultProgressText || !resultHooks || !dnaBars) {
      return;
    }

    resultTitle.textContent = result.fullTitle;
    resultAiCopy.textContent = result.personalized;
    resultStrengths.innerHTML = result.strengths.map((item) => `<li>${item}</li>`).join("");
    resultPaths.innerHTML = result.paths.map((item) => `<li>${item}</li>`).join("");
    resultNextStep.textContent = result.nextStep;
    resultProgressText.textContent = "أنت خلصت أول خطوة من الرحلة";
    resultHooks.innerHTML = result.retentionHooks.map((item) => `<li>${item}</li>`).join("");
    dnaBars.innerHTML = result.dnaBars.map((item) => `
      <div class="dna-bar">
        <div class="dna-bar-head">
          <span>${item.label}</span>
          <span>${item.value}%</span>
        </div>
        <div class="dna-bar-track"><span style="width:${item.value}%"></span></div>
      </div>
    `).join("");

    resultOverlay.classList.remove("hidden");
    resultOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeResultOverlay() {
    if (!resultOverlay) return;
    resultOverlay.classList.add("hidden");
    resultOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  resultClose?.addEventListener("click", closeResultOverlay);
  resultBackdrop?.addEventListener("click", closeResultOverlay);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeResultOverlay();
  });

  optionsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option-index]");
    if (!button) return;

    const optionIndex = Number(button.dataset.optionIndex);
    const selectedOption = quizQuestions[currentIndex].options[optionIndex];
    scores[selectedOption.track] += 1;

    if (quizFeedback) {
      const feedbackSet = quizMicroFeedback[selectedOption.track];
      quizFeedback.textContent = feedbackSet[Math.min(currentIndex, feedbackSet.length - 1)];
    }

    currentIndex += 1;

    if (currentIndex >= quizQuestions.length) {
      renderResult();
      return;
    }

    renderQuestion();
  });

  renderQuestion();
}

function persistQuickAssessment(track, result) {
  const personaMap = {
    data: "analyst",
    design: "creator",
    business: "communicator"
  };

  const weaknessMap = {
    data: ["Communication", "Speed Under Pressure"],
    design: ["Routine", "Rigid Structure"],
    business: ["Technical Depth", "Deep Solo Work"]
  };

  const stylesMap = {
    data: "Thinking Style: Analytical. Work Style: Structured / Insight-driven.",
    design: "Thinking Style: Creative. Work Style: Flexible / Experience-driven.",
    business: "Thinking Style: Social. Work Style: Team / Action-driven."
  };

  const assessmentState = {
    persona: personaMap[track] || "analyst",
    careerPath: result.fullTitle,
    title: result.title,
    fullTitle: result.fullTitle,
    copy: result.personalized,
    personality: result.description,
    strengths: result.strengths,
    weaknesses: weaknessMap[track] || ["Communication", "Focus"],
    paths: result.paths,
    next: result.nextStep,
    styles: stylesMap[track] || stylesMap.data,
    dna: result.dnaBars.map((item) => ({
      label: item.label,
      value: item.value
    })),
    completedAt: new Date().toISOString(),
    source: "quick-quiz"
  };

  try {
    window.localStorage.setItem(QUICK_ASSESSMENT_KEY, JSON.stringify(assessmentState));
  } catch (error) {
    console.warn("Unable to persist quick assessment result", error);
  }
}

function getStudentFlowState() {
  let passport = {};
  let assessment = {};
  let draft = {};

  try {
    passport = JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    passport = {};
  }

  try {
    assessment = JSON.parse(window.localStorage.getItem(QUICK_ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    assessment = {};
  }

  try {
    draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null") || {};
  } catch (error) {
    draft = {};
  }

  const completedSteps = Array.isArray(passport.completedSteps) ? passport.completedSteps.length : 0;
  const hasPassport = Boolean(passport.name || passport.email);
  const hasAssessment = Boolean(assessment.fullTitle || assessment.careerPath || assessment.persona);
  const hasDraft = Boolean(draft.profile || draft.currentStep >= 0);
  const isReturning = completedSteps >= 3 || (hasPassport && hasAssessment);

  if (isReturning) {
    return {
      entryUrl: "student-dashboard.html",
      entryLabel: "افتح الـ Dashboard",
      secondaryUrl: "talent-dna.html",
      secondaryLabel: "شاهد Talent DNA"
    };
  }

  if (!hasPassport && !hasDraft && hasAssessment) {
    return {
      entryUrl: "student-auth.html",
      entryLabel: "ابدأ رحلتك الآن",
      secondaryUrl: "student-dashboard.html",
      secondaryLabel: "شاهد الـ Dashboard"
    };
  }

  if (hasDraft || hasPassport) {
    return {
      entryUrl: "student-auth.html",
      entryLabel: "كمّل رحلتك",
      secondaryUrl: "student-onboarding.html",
      secondaryLabel: "كمّل الـ Onboarding"
    };
  }

  return {
    entryUrl: "student-auth.html",
    entryLabel: "ابدأ رحلتك الآن",
    secondaryUrl: "student-auth.html",
    secondaryLabel: "لديك حساب؟ سجل دخولك"
  };
}
