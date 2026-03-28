const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const DRAFT_KEY = "skillbridgeOnboardingDraft";

const TRACKS = {
  business: {
    label: "Business",
    icon: "💼",
    helper: "إدارة، تسويق، مبيعات",
    subs: [
      { id: "marketing", label: "Marketing", title: "Marketing Specialist" },
      { id: "sales", label: "Sales", title: "Sales Development Rep" },
      { id: "hr", label: "HR", title: "HR Coordinator" },
      { id: "product", label: "Product", title: "Product Coordinator" }
    ],
    skills: ["Communication", "Leadership", "Negotiation", "Presentation", "Excel", "Market Research", "CRM"],
    strengths: ["التواصل", "التأثير", "تنظيم الأولويات"],
    weaknesses: ["Technical Depth", "Deep Solo Work"],
    paths: ["Business Development", "Marketing", "Product Operations"],
    styles: "Thinking Style: Social / Strategic. Work Style: Team / Fast-moving.",
    dna: [{ label: "Social", value: 84 }, { label: "Execution", value: 72 }, { label: "Analysis", value: 58 }],
    questions: [
      ["أكثر شيء تحبه في الشغل", ["الإقناع والبيع", "تنظيم العمليات", "بناء خطة نمو"]],
      ["اشتغلت في تيم قبل كده؟", ["أيوه وكنت منسق", "أيوه كعضو أساسي", "لسه لكن جاهز"]]
    ]
  },
  technology: {
    label: "Technology",
    icon: "💻",
    helper: "برمجة، بيانات، أنظمة",
    subs: [
      { id: "web", label: "Web Development", title: "Frontend Developer" },
      { id: "data", label: "Data", title: "Data Analyst" },
      { id: "ai", label: "AI", title: "AI / Data Analyst" },
      { id: "cyber", label: "Cybersecurity", title: "Cybersecurity Analyst" }
    ],
    skills: ["HTML", "CSS", "JavaScript", "React", "Python", "SQL", "Git", "Problem Solving"],
    strengths: ["التحليل", "حل المشكلات", "التنفيذ العملي"],
    weaknesses: ["Presentation", "Stakeholder Communication"],
    paths: ["Frontend Development", "Data Analysis", "Cybersecurity"],
    styles: "Thinking Style: Analytical / Practical. Work Style: Structured / Builder.",
    dna: [{ label: "Analytical", value: 82 }, { label: "Execution", value: 78 }, { label: "Social", value: 48 }],
    questions: [
      ["أقرب لك أكثر", ["البرمجة وبناء شيء يعمل", "تحليل البيانات والنتائج", "حماية الأنظمة"]],
      ["جربت تعمل مشروع قبل كده؟", ["أيوه مشروع كامل", "مشروع صغير أو تدريب", "لسه لكن جاهز أبدأ"]]
    ]
  },
  design: {
    label: "Design",
    icon: "🎨",
    helper: "UI/UX، جرافيك، موشن",
    subs: [
      { id: "uiux", label: "UI/UX", title: "Product Designer" },
      { id: "graphic", label: "Graphic Design", title: "Graphic Designer" },
      { id: "motion", label: "Motion Design", title: "Motion Designer" }
    ],
    skills: ["Figma", "UX Research", "Wireframing", "Visual Design", "Typography", "Prototyping", "Storytelling"],
    strengths: ["الإبداع", "التبسيط", "الحس البصري"],
    weaknesses: ["Routine", "Rigid Structure"],
    paths: ["UI/UX", "Product Design", "Brand Experience"],
    styles: "Thinking Style: Creative / Empathetic. Work Style: Flexible / Experience-driven.",
    dna: [{ label: "Creative", value: 86 }, { label: "Empathy", value: 74 }, { label: "Analysis", value: 52 }],
    questions: [
      ["أكثر شيء يحمسك", ["حل مشكلة المستخدم", "الشكل البصري", "الحركة والموشن"]],
      ["أول شيء تلاحظه في تطبيق ضعيف", ["التجربة مربكة", "الشكل ضعيف", "الفكرة محتاجة ترتيب"]]
    ]
  },
  media: {
    label: "Media",
    icon: "🎥",
    helper: "محتوى، فيديو، سوشيال",
    subs: [
      { id: "content", label: "Content Creation", title: "Content Creator" },
      { id: "video", label: "Video Production", title: "Video Editor" },
      { id: "social", label: "Social Media", title: "Social Media Specialist" }
    ],
    skills: ["Content Writing", "Editing", "Storytelling", "Canva", "Social Media", "Video Basics", "Research"],
    strengths: ["السرعة", "التعبير", "التأثير"],
    weaknesses: ["Deep Technical Work", "Long Solo Analysis"],
    paths: ["Content Creation", "Social Media", "Media Production"],
    styles: "Thinking Style: Expressive / Social. Work Style: Fast / Trend-aware.",
    dna: [{ label: "Social", value: 80 }, { label: "Creative", value: 78 }, { label: "Analysis", value: 50 }],
    questions: [
      ["أقرب لك", ["كتابة وصناعة فكرة", "تصوير ومونتاج", "إدارة منصات وتفاعل"]],
      ["أكثر شيء تستمتع به", ["التأثير على الناس", "تحويل الفكرة لقصة", "متابعة الترندات"]]
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupReveal();
  setupOnboarding();
});

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

function setupOnboarding() {
  const passport = readJson(PASSPORT_KEY, {});
  const assessment = readJson(ASSESSMENT_KEY, {});
  let state = buildInitialState(passport, assessment);
  let currentStep = 0;

  const intro = document.getElementById("introScreen");
  const wizard = document.getElementById("wizardShell");
  const result = document.getElementById("resultScreen");
  const stepBody = document.getElementById("stepBody");
  const stepCounter = document.getElementById("stepCounter");
  const progressPercent = document.getElementById("progressPercent");
  const progressBar = document.getElementById("progressBar");
  const questionType = document.getElementById("questionType");
  const questionHint = document.getElementById("questionHint");
  const questionTitle = document.getElementById("questionTitle");
  const questionDescription = document.getElementById("questionDescription");
  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");

  const resumeBtn = document.getElementById("resumeDraftBtn");
  if (readJson(DRAFT_KEY, null)) resumeBtn.classList.remove("hidden");

  document.getElementById("startFullMode").addEventListener("click", () => start("full"));
  document.getElementById("startQuickMode").addEventListener("click", () => start("quick"));
  resumeBtn.addEventListener("click", () => {
    const draft = readJson(DRAFT_KEY, null);
    if (!draft) return;
    state = draft;
    currentStep = Math.min(draft.currentStep || 0, getSteps().length - 1);
    openWizard();
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    renderStep();
  });

  nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;
    if (currentStep === getSteps().length - 1) {
      finish();
      return;
    }
    currentStep += 1;
    renderStep();
  });

  function start(mode) {
    state = buildInitialState(passport, assessment);
    state.mode = mode;
    currentStep = 0;
    openWizard();
  }

  function openWizard() {
    intro.classList.add("hidden");
    result.classList.add("hidden");
    wizard.classList.remove("hidden");
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getSteps() {
    return state.mode === "quick"
      ? ["profile", "specialization", "questions"]
      : ["profile", "specialization", "skills", "experience", "questions"];
  }

  function renderStep() {
    const step = getSteps()[currentStep];
    const progress = Math.round(((currentStep + 1) / getSteps().length) * 100);
    replaceText("previewModeLabel", state.mode === "quick" ? "Quick Mode" : "Full Mode");
    replaceTextByEl(stepCounter, `الخطوة ${currentStep + 1} من ${getSteps().length}`);
    replaceTextByEl(progressPercent, `${progress}%`);
    progressBar.style.width = `${progress}%`;
    prevBtn.classList.toggle("hidden", currentStep === 0);
    nextBtn.textContent = currentStep === getSteps().length - 1 ? "Finish" : "Next";
    renderStepIndicator();

    if (step === "profile") renderProfile();
    if (step === "specialization") renderSpecialization();
    if (step === "skills") renderSkills();
    if (step === "experience") renderExperience();
    if (step === "questions") renderQuestions();

    updatePreview();
    saveDraft();
  }

  function renderStepIndicator() {
    const titles = { profile: "معلوماتك", specialization: "تخصصك", skills: "مهاراتك", experience: "خبراتك", questions: "جاهز للعمل" };
    document.getElementById("stepIndicator").innerHTML = getSteps().map((step, index) => `
      <div class="step-item ${index === currentStep ? "is-active" : index < currentStep ? "is-done" : ""}">
        <span class="step-index">${index + 1}</span>
        <span>${titles[step]}</span>
      </div>
    `).join("");
  }

  function renderProfile() {
    questionType.textContent = "Step 1";
    questionHint.textContent = "الهدف هنا بسيط جدًا";
    questionTitle.textContent = "معلوماتك الأساسية";
    questionDescription.textContent = "اكتب البيانات الأساسية فقط. دي أول خطوة، ونكمل بعدها بالتخصص والمهارات.";
    setAssistant("ابدأ من هنا", "الاسم والإيميل ورقم التليفون والنوع مطلوبين قبل ما نكمل.");
    stepBody.innerHTML = `
      <div class="field-grid">
        <div class="field-card">
          <label class="field-label" for="studentName">الاسم</label>
          <input id="studentName" type="text" value="${esc(state.profile.name)}" placeholder="اسمك الكامل">
        </div>
        <div class="field-card">
          <label class="field-label" for="studentEmail">البريد الإلكتروني</label>
          <input id="studentEmail" type="email" value="${esc(state.profile.email)}" placeholder="you@email.com">
        </div>
        <div class="field-card">
          <label class="field-label" for="studentPhone">رقم التليفون</label>
          <input id="studentPhone" type="tel" value="${esc(state.profile.phone)}" placeholder="01xxxxxxxxx">
        </div>
        <div class="field-card">
          <label class="field-label" for="studentLocation">المدينة</label>
          <input id="studentLocation" type="text" value="${esc(state.profile.location)}" placeholder="القاهرة">
        </div>
        <div class="field-card wide">
          <label class="field-label">النوع</label>
          <div class="gender-grid">
            ${genderButton("male", "👨 ذكر")}
            ${genderButton("female", "👩 أنثى")}
          </div>
          <span class="field-note">لو لم ترفع صورة، سنستخدم icon مناسب تلقائيًا.</span>
        </div>
      </div>
    `;
    bindInput("studentName", (v) => state.profile.name = v);
    bindInput("studentEmail", (v) => state.profile.email = v);
    bindInput("studentPhone", (v) => state.profile.phone = v);
    bindInput("studentLocation", (v) => state.profile.location = v);
    bindButtons("[data-gender]", (btn) => {
      state.profile.gender = btn.getAttribute("data-gender");
      renderProfile();
    });
  }

  function renderSpecialization() {
    questionType.textContent = "Step 2";
    questionHint.textContent = "أهم نقطة في الرحلة";
    questionTitle.textContent = "اختار تخصصك";
    questionDescription.textContent = "اختَر المجال الرئيسي ثم التخصصات الفرعية الأقرب لك. يمكنك اختيار 3 فقط.";
    setAssistant("نحدد اتجاهك", "اختيار المجال هنا سيغيّر المهارات المقترحة والأسئلة الذكية التي ستظهر لك.");
    stepBody.innerHTML = `
      <div class="choices-grid">
        ${Object.entries(TRACKS).map(([key, item]) => `
          <button class="choice-btn ${state.specialization.category === key ? "selected" : ""}" type="button" data-category="${key}">
            <span>${item.icon}</span>
            <span class="choice-copy"><strong>${item.label}</strong><span>${item.helper}</span></span>
          </button>
        `).join("")}
      </div>
      <div class="smart-box">
        <div class="skills-head"><strong>التخصصات الفرعية</strong><span class="count-chip">اختر 3 كحد أقصى</span></div>
        <div class="sub-grid" id="subGrid">${renderSubs()}</div>
      </div>
      <div class="smart-box">
        <div class="skills-head"><strong>اقتراح ذكي</strong><span class="badge-chip">${state.specialization.category ? TRACKS[state.specialization.category].label : "اختر المجال أولًا"}</span></div>
        <p class="field-note">${state.specialization.category ? `سنقترح عليك مهارات مثل: ${TRACKS[state.specialization.category].skills.slice(0, 4).join(" - ")}` : "بعد اختيار المجال سنقترح المهارات والأسئلة المناسبة تلقائيًا."}</p>
      </div>
    `;
    bindButtons("[data-category]", (btn) => {
      state.specialization.category = btn.getAttribute("data-category");
      state.specialization.subs = [];
      if (!state.skills.selected.length) state.skills.selected = TRACKS[state.specialization.category].skills.slice(0, 5);
      renderSpecialization();
    });
    bindButtons("[data-sub]", (btn) => {
      const value = btn.getAttribute("data-sub");
      const exists = state.specialization.subs.includes(value);
      if (!exists && state.specialization.subs.length >= 3) {
        setAssistant("اختيار 3 تخصصات كفاية", "احذف تخصصًا فرعيًا أولًا لو تريد اختيار غيره.");
        return;
      }
      state.specialization.subs = exists
        ? state.specialization.subs.filter((item) => item !== value)
        : [...state.specialization.subs, value];
      renderSpecialization();
    });
  }

  function renderSkills() {
    const suggestions = state.specialization.category ? TRACKS[state.specialization.category].skills : ["Communication", "Problem Solving", "Excel", "Research", "Presentation", "Leadership"];
    questionType.textContent = "Step 3";
    questionHint.textContent = "5 مهارات على الأقل";
    questionTitle.textContent = "اختار مهاراتك";
    questionDescription.textContent = "اختيارات على شكل buttons بدل الكتابة. اختر 5 مهارات على الأقل.";
    setAssistant("اختر مهاراتك", `اختر ${Math.max(0, 5 - state.skills.selected.length)} مهارات كمان لو لسه ماوصلتش للحد الأدنى.`);
    stepBody.innerHTML = `
      <div class="smart-box">
        <div class="skills-head"><strong>اختار المهارات اللي عندك</strong><span class="count-chip">${state.skills.selected.length} selected</span></div>
        <p class="field-note">لو محتار، هنقترح عليك مهارات حسب التخصص اللي اخترته.</p>
        <div class="skills-grid">
          ${suggestions.map((skill) => `<button class="skill-btn ${state.skills.selected.includes(skill) ? "selected" : ""}" type="button" data-skill="${esc(skill)}">${skill}</button>`).join("")}
        </div>
      </div>
    `;
    bindButtons("[data-skill]", (btn) => {
      const skill = btn.getAttribute("data-skill");
      state.skills.selected = state.skills.selected.includes(skill)
        ? state.skills.selected.filter((item) => item !== skill)
        : [...state.skills.selected, skill];
      renderSkills();
    });
  }

  function renderExperience() {
    questionType.textContent = "Step 4";
    questionHint.textContent = "اختياري لكن مفيد";
    questionTitle.textContent = "خبراتك السابقة";
    questionDescription.textContent = "اكتب مشروعًا أو تجربة، وارفع ملفات لو عندك. لو ماعندكش، تقدر تكمل.";
    setAssistant("ثبت شغلك", "أي مشروع بسيط أو وصف لتجربة سابقة يرفع الثقة في بروفايلك أمام الشركات.");
    stepBody.innerHTML = `
      <div class="field-grid">
        <div class="field-card wide">
          <label class="field-label" for="experienceSummary">الخبرات أو المشاريع</label>
          <textarea id="experienceSummary" placeholder="اكتب أي تدريب أو مشروع أو خبرة سابقة">${esc(state.experience.summary)}</textarea>
          <span class="field-note">ارفع مشروعك أو سيبها فاضية لو معندكش.</span>
        </div>
        <div class="field-card">
          <label class="field-label" for="portfolioLink">Portfolio Link</label>
          <input id="portfolioLink" type="url" value="${esc(state.experience.portfolio)}" placeholder="https://...">
        </div>
        <div class="field-card">
          <label class="field-label" for="avatarUrl">صورة شخصية (اختياري)</label>
          <input id="avatarUrl" type="url" value="${esc(state.experience.avatarUrl)}" placeholder="رابط صورة">
        </div>
      </div>
      <div class="smart-box">
        <div class="upload-head"><strong>رفع ملفات</strong><span class="badge-chip">PDF / Images / Projects</span></div>
        <label class="dropzone">
          <strong>اسحب الملفات هنا أو اضغط للاختيار</strong>
          <span class="dropzone-note">هنعرض أسماء الملفات فقط داخل البروفايل المبدئي.</span>
          <input id="supportingFiles" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.zip">
        </label>
        <div class="upload-list" id="uploadList">${state.experience.files.length ? state.experience.files.map((f) => `<span>${f}</span>`).join("") : '<span class="empty-note">لا توجد ملفات مرفوعة حتى الآن</span>'}</div>
      </div>
    `;
    bindInput("experienceSummary", (v) => state.experience.summary = v);
    bindInput("portfolioLink", (v) => state.experience.portfolio = v);
    bindInput("avatarUrl", (v) => state.experience.avatarUrl = v);
    const fileInput = document.getElementById("supportingFiles");
    fileInput?.addEventListener("change", () => {
      state.experience.files = Array.from(fileInput.files || []).map((file) => file.name);
      renderExperience();
    });
  }

  function renderQuestions() {
    const questions = state.specialization.category ? TRACKS[state.specialization.category].questions : [["أكثر شيء تحبه", ["التحليل", "التنفيذ", "التواصل"]]];
    questionType.textContent = state.mode === "quick" ? "Final Step" : "Step 5";
    questionHint.textContent = "أسئلة ذكية حسب تخصصك";
    questionTitle.textContent = "جاهز للعمل";
    questionDescription.textContent = "أسئلة قليلة لكنها تحدد أفضل مسار لك والخطوة التالية بوضوح.";
    setAssistant("هذه أهم لحظة", "إجاباتك هنا ستحدد التخصص النهائي والخطة الشخصية بعد النتيجة.");
    stepBody.innerHTML = questions.map((question, index) => `
      <article class="smart-question-card">
        <span class="step-chip">Question ${index + 1}</span>
        <h3>${question[0]}</h3>
        <div class="smart-answer-list">
          ${question[1].map((answer) => `<button class="smart-answer-btn ${(state.smartAnswers[index] || "") === answer ? "selected" : ""}" type="button" data-question="${index}" data-answer="${esc(answer)}">${answer}</button>`).join("")}
        </div>
      </article>
    `).join("");
    bindButtons("[data-question]", (btn) => {
      state.smartAnswers[Number(btn.getAttribute("data-question"))] = btn.getAttribute("data-answer");
      renderQuestions();
    });
  }

  function renderSubs() {
    if (!state.specialization.category) return '<p class="empty-note">اختر المجال الرئيسي أولًا.</p>';
    return TRACKS[state.specialization.category].subs.map((sub) => `
      <button class="sub-btn ${state.specialization.subs.includes(sub.id) ? "selected" : ""}" type="button" data-sub="${sub.id}">${sub.label}</button>
    `).join("");
  }

  function updatePreview() {
    const track = state.specialization.category ? TRACKS[state.specialization.category] : null;
    const sub = track?.subs.find((item) => state.specialization.subs.includes(item.id));
    replaceText("previewName", state.profile.name || "اسمك");
    replaceText("previewField", sub?.title || track?.label || "التخصص سيظهر هنا");
    replaceText("previewPhone", state.profile.phone || "--");
    replaceText("previewGender", state.profile.gender === "male" ? "ذكر" : state.profile.gender === "female" ? "أنثى" : "--");
    replaceText("previewSkills", `${state.skills.selected.length} selected`);
    replaceText("previewExperience", state.experience.files.length ? `${state.experience.files.length} file(s)` : state.experience.summary ? "Summary added" : "No files yet");
    const avatar = document.getElementById("previewAvatar");
    if (avatar) avatar.textContent = state.experience.avatarUrl ? "🖼️" : state.profile.gender === "male" ? "👨" : state.profile.gender === "female" ? "👩" : "🙂";
    const tags = document.getElementById("previewTags");
    tags.innerHTML = state.skills.selected.slice(0, 5).map((item) => `<span>${item}</span>`).join("");
  }

  function validateStep() {
    const step = getSteps()[currentStep];
    if (step === "profile") {
      if (!state.profile.name || !state.profile.email || !state.profile.phone || !state.profile.gender) return setAssistant("كمّل بياناتك الأساسية", "الاسم والإيميل ورقم التليفون والنوع مطلوبين قبل المتابعة."), false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.profile.email)) return setAssistant("الإيميل غير صحيح", "اكتب بريدًا إلكترونيًا صحيحًا قبل المتابعة."), false;
    }
    if (step === "specialization" && (!state.specialization.category || !state.specialization.subs.length)) return setAssistant("حدد تخصصك أولًا", "اختَر مجالًا رئيسيًا ثم تخصصًا فرعيًا واحدًا على الأقل."), false;
    if (step === "skills" && state.skills.selected.length < 5) return setAssistant("اختار مهارات أكثر", `اختار ${5 - state.skills.selected.length} مهارات كمان علشان تكمل.`), false;
    if (step === "questions" && Object.keys(state.smartAnswers).length < (state.specialization.category ? TRACKS[state.specialization.category].questions.length : 1)) return setAssistant("باقي سؤال أو أكثر", "جاوب على كل الأسئلة الذكية عشان نطلع لك نتيجة أدق."), false;
    return true;
  }

  function finish() {
    if (state.mode === "quick" && state.skills.selected.length < 5 && state.specialization.category) {
      state.skills.selected = TRACKS[state.specialization.category].skills.slice(0, 5);
    }
    const final = buildResult(state);
    persistResult(state, final);
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = "student-dashboard.html";
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...state, currentStep }));
  }

  function setAssistant(title, copy) {
    replaceText("assistantTitle", title);
    replaceText("assistantCopy", copy);
  }

  function genderButton(value, label) {
    return `<button class="gender-btn ${state.profile.gender === value ? "selected" : ""}" type="button" data-gender="${value}">${label}</button>`;
  }

  function bindInput(id, handler) {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      handler(input.value.trim());
      updatePreview();
      saveDraft();
    });
  }

  function bindButtons(selector, handler) {
    document.querySelectorAll(selector).forEach((button) => {
      button.addEventListener("click", () => {
        handler(button);
        updatePreview();
        saveDraft();
      });
    });
  }
}

function buildInitialState(passport, assessment) {
  const track = String(passport.track || assessment.careerPath || "").toLowerCase();
  let category = "";
  if (track.includes("design")) category = "design";
  else if (track.includes("business") || track.includes("marketing") || track.includes("product")) category = "business";
  else if (track.includes("media") || track.includes("content")) category = "media";
  else if (track.includes("data") || track.includes("software") || track.includes("developer") || track.includes("ai")) category = "technology";
  const initialSub = getInitialSub(category, track);

  return {
    mode: "full",
    profile: {
      name: passport.name || "",
      email: passport.email || "",
      phone: passport.phone || "",
      gender: passport.gender || "",
      location: passport.location || "القاهرة"
    },
    specialization: { category, subs: initialSub ? [initialSub] : [] },
    skills: { selected: Array.isArray(passport.skills) ? [...passport.skills] : [] },
    experience: {
      summary: passport.experience || passport.about || "",
      portfolio: passport.portfolio || "",
      avatarUrl: passport.avatarUrl || "",
      files: []
    },
    smartAnswers: {}
  };
}

function buildResult(state) {
  const track = TRACKS[state.specialization.category] || TRACKS.technology;
  const sub = track.subs.find((item) => state.specialization.subs.includes(item.id)) || track.subs[0];
  const strengths = [...new Set([...track.strengths, ...state.skills.selected.slice(0, 2)])].slice(0, 4);
  const weaknesses = [...new Set([...track.weaknesses, ...track.skills.filter((skill) => !state.skills.selected.includes(skill)).slice(0, 2)])].slice(0, 3);
  return {
    persona: track.label === "Design" ? "creator" : track.label === "Business" || track.label === "Media" ? "communicator" : sub.id === "data" || sub.id === "ai" ? "analyst" : "builder",
    bestFit: sub.title,
    fullTitle: `You are best fit for: ${sub.title}`,
    careerPath: sub.title,
    copy: `اختياراتك توضح أنك أقرب إلى ${sub.title} لأنك اخترت ${track.label} ومعك أساس واضح في ${strengths.slice(0, 2).join(" و")}.`,
    personality: `${track.label} mindset مع ميل واضح إلى ${sub.label}. أنت تفضّل ${Object.values(state.smartAnswers).slice(0, 2).join(" و") || "العمل العملي المنظم"}.`,
    strengths,
    weaknesses,
    paths: [sub.title, ...track.paths].slice(0, 4),
    next: "افتح الـ Dashboard لتراجع Talent DNA وتبدأ الخطوة التالية المناسبة لك.",
    styles: track.styles,
    dna: track.dna,
    roadmap: buildRoadmap(sub.title, state.skills.selected),
    selectedSkills: state.skills.selected,
    mode: state.mode,
    jobReadiness: state.mode === "quick" ? 62 : 74
  };
}

function buildRoadmap(bestFit, skills) {
  return [
    { title: `Learn ${skills[0] || "HTML"}`, copy: "ابدأ بالأساسيات أو قوّي هذه المهارة خلال يومين أو ثلاثة." },
    { title: `Learn ${skills[1] || "CSS"}`, copy: "كمّل المهارة الثانية بحيث ترتبط بالمجال الذي ظهر لك." },
    { title: "Build Project", copy: `اعمل مشروعًا صغيرًا يثبت أنك قريب من مسار ${bestFit}.` },
    { title: "Apply to Jobs", copy: "حدّث البروفايل ثم ابدأ التقديم على الوظائف المناسبة." }
  ];
}

function persistResult(state, final) {
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify({
    persona: final.persona,
    title: final.fullTitle,
    fullTitle: final.fullTitle,
    careerPath: final.careerPath,
    copy: final.copy,
    personality: final.personality,
    strengths: final.strengths,
    weaknesses: final.weaknesses,
    paths: final.paths,
    next: final.next,
    styles: final.styles,
    dna: final.dna,
    completedAt: new Date().toISOString(),
    source: "smart-onboarding"
  }));

  const current = readJson(PASSPORT_KEY, {});
  const project = state.experience.summary || state.experience.portfolio || state.experience.files.length
    ? [{
        title: state.experience.portfolio ? "Portfolio Submission" : "Starter Project",
        summary: state.experience.summary || "Project added during onboarding.",
        link: state.experience.portfolio || "",
        files: state.experience.files || [],
        skills: final.selectedSkills.slice(0, 3)
      }]
    : current.projects || [];

  localStorage.setItem(PASSPORT_KEY, JSON.stringify({
    ...current,
    name: state.profile.name || current.name || "Student",
    email: state.profile.email || current.email || "",
    phone: state.profile.phone || current.phone || "",
    gender: state.profile.gender || current.gender || "",
    location: state.profile.location || current.location || "القاهرة",
    avatar: current.avatar || initials(state.profile.name || current.name || "Student"),
    avatarUrl: state.experience.avatarUrl || current.avatarUrl || "",
    track: final.careerPath,
    careerPath: final.careerPath,
    skills: final.selectedSkills,
    strengths: final.strengths,
    weaknesses: final.weaknesses,
    about: state.experience.summary || current.about || "Student profile generated from smart onboarding.",
    experience: state.experience.summary || current.experience || "",
    portfolio: state.experience.portfolio || current.portfolio || "",
    projects: project,
    jobReadiness: Math.max(Number(current.jobReadiness || 0), final.jobReadiness),
    learningProgress: Math.max(Number(current.learningProgress || 0), final.mode === "quick" ? 24 : 38),
    xp: Math.max(Number(current.xp || 0), final.mode === "quick" ? 260 : 480),
    level: Math.max(Number(current.level || 1), final.mode === "quick" ? 1 : 2),
    levelLabel: final.mode === "quick" ? "Level 1 - Starter" : "Level 2 - Explorer",
    badges: Array.from(new Set([...(current.badges || []), final.mode === "quick" ? "Quick Starter" : "Smart Explorer"])),
    completedSteps: final.mode === "quick" ? ["profile", "specialization", "questions"] : ["profile", "specialization", "skills", "experience", "questions"],
    lastSeenAt: new Date().toISOString()
  }));
}

function fillList(id, items) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function replaceTextByEl(el, value) {
  if (el && value !== undefined) el.textContent = value;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function getInitialSub(category, track) {
  if (!category || !track || !TRACKS[category]) return "";
  const match = TRACKS[category].subs.find((item) => {
    const id = item.id.toLowerCase();
    const label = item.label.toLowerCase();
    const title = item.title.toLowerCase();
    return track.includes(id) || track.includes(label) || track.includes(title);
  });
  return match?.id || "";
}

function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
