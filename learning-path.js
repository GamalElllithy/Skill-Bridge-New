const PATH_STORAGE_KEY = "skillbridgeLearningPath";

const steps = [
  {
    id: "foundations",
    title: "Learn Python Basics",
    subtitle: "Step 1 — Foundations",
    description: "هتفهم أساسيات البرمجة التي ستحتاجها في تحليل البيانات.",
    duration: "5 أيام",
    skills: ["Python", "Logic"],
    why: "الخطوة دي هتزود فرصة قبولك في وظائف Data بنسبة 20%",
    jobs: ["Data Intern", "Junior Data Analyst"],
    xp: 50,
    badge: "Python Beginner",
    tasks: [
      "افهم variables, loops, conditions",
      "حل 3 مسائل logic بسيطة",
      "جهز notebook فيه أول analysis بسيط"
    ],
    resources: [
      "Video: Python Basics",
      "Practice: Simple Exercises",
      "Template: First Notebook"
    ]
  },
  {
    id: "practice",
    title: "Data Analysis Project",
    subtitle: "Step 2 — Practice",
    description: "تطبيق عملي يبني أول مشروع واضح يمكن عرضه داخل Portfolio.",
    duration: "4 أيام",
    skills: ["Mini Project", "EDA", "Storytelling"],
    why: "الخطوة دي هترفع ثقة الشركة فيك لأنك هتتحول من متعلم إلى شخص طبّق فعلًا",
    jobs: ["Data Intern", "Business Analyst Intern"],
    xp: 70,
    badge: "Project Explorer",
    tasks: [
      "اختر dataset مناسبة",
      "اعمل cleaning وتحليل أساسي",
      "اطلع 3 insights واضحة"
    ],
    resources: [
      "Dataset Pack",
      "Project Checklist",
      "Portfolio Upload Guide"
    ]
  },
  {
    id: "advanced",
    title: "SQL + Visualization",
    subtitle: "Step 3 — Advanced",
    description: "هتتعلم SQL وVisualization لتكون أقرب لوظائف الـ BI وData Analysis.",
    duration: "6 أيام",
    skills: ["SQL", "Visualization", "Dashboards"],
    why: "الخطوة دي هتزود فرص التوظيف بشكل مباشر لأن أغلب الوظائف المناسبة لك تحتاج Reporting واضح",
    jobs: ["Junior Analyst", "BI Intern", "Reporting Associate"],
    xp: 90,
    badge: "Dashboard Builder",
    tasks: [
      "اكتب 5 queries أساسية",
      "اعمل dashboard واحدة",
      "اربط النتائج بـ business insight"
    ],
    resources: [
      "SQL Cheat Sheet",
      "Dashboard Examples",
      "Visualization Best Practices"
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupPath();
  setupModal();
});

function setupMenu() {
  const topbar = document.getElementById("pathTopbar");
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

function setupPath() {
  const timelineTrack = document.getElementById("timelineTrack");
  const resumeBtn = document.getElementById("resumePathBtn");
  if (!timelineTrack || !resumeBtn) return;

  let state = getPathState();

  function render() {
    const completedCount = state.completed.length;
    const progress = Math.round((completedCount / steps.length) * 100);
    const xp = 100 + steps
      .filter((step) => state.completed.includes(step.id))
      .reduce((sum, step) => sum + step.xp, 0);
    const level = getLevelName(completedCount);

    replaceText("xpValue", `${xp} XP`);
    replaceText("levelValue", level.label);
    replaceText("dailyGoalValue", `${Math.min(completedCount + 1, steps.length)} / ${steps.length}`);
    replaceText("progressPercent", `${progress}%`);
    replaceText("aiInsight", progress >= 67
      ? "أنت قريب جدًا من أول فرصة قوية. خطوة أخيرة وقد تفتح لك وظائف أعلى."
      : progress >= 34
        ? "لو كملت الخطوة الجاية، فرصتك في التوظيف هتزيد 40%."
        : "ابدأ الآن، أول خطوة فقط ستفتح لك وظائف جديدة وتزود ثقتك.");
    replaceText("reminderCopy", completedCount === 0
      ? "لم تبدأ المسار بعد. خلص أول Task اليوم وابدأ تبني momentum."
      : completedCount === steps.length
        ? "أنت خلصت المسار. راجع الوظائف المناسبة وابدأ التقديم الآن."
        : "كمّل الخطوة الحالية حتى لا يبرد التقدم. خطوة واحدة اليوم كفاية.");
    replaceText("portfolioHint", completedCount === 0
      ? "أول Step تخلصها ستضيف أول دليل حقيقي في الـ Portfolio."
      : `أنت أضفت ${completedCount} عناصر حتى الآن داخل الـ Portfolio. كل خطوة جديدة تقوّي البروفايل أكثر.`);

    const progressBar = document.getElementById("progressBar");
    const progressCircle = document.getElementById("progressCircle");
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressCircle) {
      const circumference = 301.59;
      const offset = circumference - (circumference * progress) / 100;
      progressCircle.style.strokeDashoffset = `${offset}`;
    }

    const badgeList = document.getElementById("badgeList");
    if (badgeList) {
      const badges = state.badges.length ? state.badges : ["Explorer"];
      badgeList.innerHTML = badges.map((badge) => `<span class="badge-pill">${badge}</span>`).join("");
    }

    const unlockList = document.getElementById("unlockList");
    if (unlockList) {
      unlockList.innerHTML = `
        <div>
          <strong>Unlocked</strong>
          <span>${completedCount >= 1 ? "Data Intern Jobs" : "Basic Path Access"}</span>
        </div>
        <div>
          <strong>Next Unlock</strong>
          <span>${completedCount >= 2 ? "Interview-ready recommendations" : "Dashboard Project Access"}</span>
        </div>
      `;
    }

    timelineTrack.innerHTML = steps.map((step, index) => {
      const isComplete = state.completed.includes(step.id);
      const isActive = !isComplete && index === completedCount;
      const isLocked = !isComplete && index > completedCount;
      const stepProgress = isComplete ? 100 : isActive ? 55 : 0;

      return `
        <article class="timeline-step ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""} ${isLocked ? "is-locked" : ""}">
          <div class="timeline-step-header">
            <div>
              <div class="step-number">${index + 1}</div>
            </div>
            <div style="flex:1;">
              <span class="eyebrow">${step.subtitle}</span>
              <h3>${step.title}</h3>
              <p class="step-copy">${step.description}</p>
            </div>
            <div class="step-meta">
              <span class="meta-pill ${isComplete ? "complete" : isActive ? "active" : "locked"}">
                ${isComplete ? "Completed" : isActive ? "In Progress" : "Locked"}
              </span>
              <span class="meta-pill">${step.duration}</span>
            </div>
          </div>

          <div class="step-progress">
            <div class="mini-progress"><span style="width:${stepProgress}%"></span></div>
          </div>

          <div class="step-grid">
            <div class="why-box">
              <strong>Why This Step Matters</strong>
              <p class="why-copy">${step.why}</p>
              <p class="step-copy">Skills: ${step.skills.join(" • ")}</p>
            </div>

            <div class="jobs-unlock">
              <strong>وظائف هتفتح لك بعد الخطوة دي</strong>
              <div class="jobs-unlock-list">
                ${step.jobs.map((job) => `<span class="jobs-pill">${job}</span>`).join("")}
              </div>
            </div>
          </div>

          <div class="step-actions" style="margin-top:16px;">
            <button class="primary-btn" type="button" data-start-step="${step.id}" ${isLocked ? "disabled" : ""}>Start Learning</button>
            <button class="ghost-btn" type="button" data-complete-step="${step.id}" ${isLocked || isComplete ? "disabled" : ""}>Mark Complete</button>
            <a class="ghost-btn" href="smart-jobs.html">View Jobs</a>
          </div>
        </article>
      `;
    }).join("");

    bindStepActions();
  }

  function bindStepActions() {
    document.querySelectorAll("[data-start-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const stepId = button.getAttribute("data-start-step");
        openLearningModal(stepId);
      });
    });

    document.querySelectorAll("[data-complete-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const stepId = button.getAttribute("data-complete-step");
        if (state.completed.includes(stepId)) return;

        state.completed.push(stepId);
        const step = steps.find((item) => item.id === stepId);
        if (step && !state.badges.includes(step.badge)) {
          state.badges.push(step.badge);
        }
        setPathState(state);
        render();
        showToast(`تم إنهاء ${step?.title || "الخطوة"} بنجاح +${step?.xp || 0} XP`);
      });
    });
  }

  resumeBtn.addEventListener("click", () => {
    const nextStep = steps.find((step) => !state.completed.includes(step.id)) || steps[steps.length - 1];
    openLearningModal(nextStep.id);
  });

  render();
}

function openLearningModal(stepId) {
  const step = steps.find((item) => item.id === stepId);
  const modal = document.getElementById("learningModal");
  const content = document.getElementById("modalContent");
  if (!step || !modal || !content) return;

  content.innerHTML = `
    <div>
      <span class="eyebrow">${step.subtitle}</span>
      <h2>${step.title}</h2>
      <p>${step.description}</p>
    </div>
    <div class="modal-blocks">
      <section class="modal-block">
        <strong>Tasks</strong>
        <ul>${step.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
      </section>
      <section class="modal-block">
        <strong>Resources</strong>
        <ul>${step.resources.map((resource) => `<li>${resource}</li>`).join("")}</ul>
      </section>
      <section class="modal-block">
        <strong>Why This Step Matters</strong>
        <p>${step.why}</p>
      </section>
      <section class="modal-block">
        <strong>Jobs Unlocked</strong>
        <ul>${step.jobs.map((job) => `<li>${job}</li>`).join("")}</ul>
      </section>
    </div>
    <div class="step-actions" style="margin-top:18px;">
      <button class="primary-btn" type="button" data-modal-complete="${step.id}">Mark Complete</button>
      <a class="ghost-btn" href="smart-jobs.html">Go to Jobs</a>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const completeButton = content.querySelector("[data-modal-complete]");
  if (completeButton) {
    completeButton.addEventListener("click", () => {
      const state = getPathState();
      if (!state.completed.includes(step.id)) {
        state.completed.push(step.id);
        if (!state.badges.includes(step.badge)) {
          state.badges.push(step.badge);
        }
        setPathState(state);
        showToast(`تم إنهاء ${step.title} +${step.xp} XP`);
      }
      closeModal();
      window.location.reload();
    });
  }
}

function setupModal() {
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
}

function closeModal() {
  const modal = document.getElementById("learningModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function getPathState() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PATH_STORAGE_KEY) || "null");
    if (parsed && Array.isArray(parsed.completed) && Array.isArray(parsed.badges)) {
      return parsed;
    }
  } catch (error) {
    // noop
  }
  return {
    completed: [],
    badges: ["Explorer"]
  };
}

function setPathState(state) {
  window.localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(state));
}

function getLevelName(completedCount) {
  if (completedCount >= 3) return { label: "Level 4 — Ready" };
  if (completedCount >= 2) return { label: "Level 3 — Builder" };
  if (completedCount >= 1) return { label: "Level 2 — Explorer" };
  return { label: "Level 1 — Beginner" };
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showToast(message) {
  const toast = document.getElementById("pathToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
