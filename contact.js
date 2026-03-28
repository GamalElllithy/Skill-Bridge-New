const CONTACT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyX7Xov4PeuQtb8fJHrhVWpWJ0Sum1i04YC-F27aLLqZmQnQ7ifvKwacXN0fxZkhJeBcw/exec";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupContactForm();
});

function setupMenu() {
  const topbar = document.getElementById("contactTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;

  toggle.addEventListener("click", () => {
    topbar.classList.toggle("is-open");
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  items.forEach((item) => observer.observe(item));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const submitButton = form?.querySelector(".submit-btn");
  const progressFill = document.getElementById("progressFill");
  const progressValue = document.getElementById("progressValue");
  const progressLabel = document.getElementById("progressLabel");
  const formMoodTitle = document.getElementById("formMoodTitle");
  const formMoodText = document.getElementById("formMoodText");
  const assuranceText = document.getElementById("assuranceText");
  const messageCounter = document.getElementById("messageCounter");
  const topicChips = document.querySelectorAll(".topic-chip");
  if (!form || !successMessage) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };

  const validators = {
    name: (value) => value.trim().length >= 3 ? "" : "من فضلك اكتب الاسم الكامل بشكل صحيح",
    email: (value) => validEmail(value) ? "" : "من فضلك اكتب بريد إلكتروني صحيح",
    subject: (value) => value.trim().length >= 3 ? "" : "من فضلك اكتب موضوعًا واضحًا",
    message: (value) => value.trim().length >= 10 ? "" : "من فضلك اكتب رسالة أوضح لا تقل عن 10 أحرف"
  };

  const fieldGuides = {
    name: "ابدأ باسمك فقط. لا تحتاج أي مقدمة رسمية.",
    email: "اكتب البريد الذي تفضّل أن نعود لك عليه.",
    subject: "اختصر الفكرة في سطر صغير، وسنكمل نحن الباقي.",
    message: "اكتب بطريقتك أنت. مختصر أو مفصل، كلاهما مناسب."
  };

  Object.entries(fields).forEach(([key, input]) => {
    if (!input) return;

    const shell = input.closest(".input-box");

    input.addEventListener("focus", () => {
      shell?.classList.add("is-focused");
      if (assuranceText && fieldGuides[key]) {
        assuranceText.textContent = fieldGuides[key];
      }
    });

    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      shell?.classList.remove("is-focused");
      validateField(key, input, validators[key], true);
      updateFormState(fields, validators, {
        progressFill,
        progressValue,
        progressLabel,
        formMoodTitle,
        formMoodText
      });
    });

    input.addEventListener("input", () => {
      if (key === "message") {
        updateMessageCounter(input, messageCounter);
      }

      const shouldValidate = input.dataset.touched === "true" || input.classList.contains("is-invalid");
      validateField(key, input, validators[key], shouldValidate);
      updateFieldShell(input);
      updateActiveTopic(topicChips, fields.subject);
      updateFormState(fields, validators, {
        progressFill,
        progressValue,
        progressLabel,
        formMoodTitle,
        formMoodText
      });
    });
  });

  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (!fields.subject) return;
      fields.subject.value = chip.dataset.subject || "";
      fields.subject.dataset.touched = "true";
      validateField("subject", fields.subject, validators.subject, true);
      updateFieldShell(fields.subject);
      updateActiveTopic(topicChips, fields.subject);
      updateFormState(fields, validators, {
        progressFill,
        progressValue,
        progressLabel,
        formMoodTitle,
        formMoodText
      });
      fields.message?.focus();
    });
  });

  updateMessageCounter(fields.message, messageCounter);
  updateActiveTopic(topicChips, fields.subject);
  updateFormState(fields, validators, {
    progressFill,
    progressValue,
    progressLabel,
    formMoodTitle,
    formMoodText
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.textContent = "";
    successMessage.dataset.state = "";

    const invalidInputs = Object.entries(fields)
      .map(([key, input]) => {
        if (!input) return { input, error: "" };
        input.dataset.touched = "true";
        return {
          input,
          error: validateField(key, input, validators[key], true)
        };
      })
      .filter(({ input, error }) => input && Boolean(error));

    if (invalidInputs.length) {
      invalidInputs[0].input.focus();
      if (assuranceText) {
        assuranceText.textContent = "كل شيء تمام، فقط نحتاج إكمال الخانات الأساسية وسننطلق.";
      }
      updateFormState(fields, validators, {
        progressFill,
        progressValue,
        progressLabel,
        formMoodTitle,
        formMoodText
      });
      return;
    }

    const payload = buildPayload(fields);
    setSubmitState(submitButton, true);
    if (assuranceText) {
      assuranceText.textContent = "ممتاز، يتم إرسال رسالتك الآن. هذه الخطوة لن تستغرق طويلًا.";
    }

    try {
      const response = await fetch(CONTACT_WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: new URLSearchParams(payload).toString()
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      successMessage.textContent = "تم إرسال رسالتك بنجاح. سنرجع لك في أقرب وقت.";
      form.reset();
      Object.values(fields).forEach((input) => {
        if (!input) return;
        input.dataset.touched = "";
        clearError(input);
        input.classList.remove("is-valid");
        updateFieldShell(input);
      });
      updateMessageCounter(fields.message, messageCounter);
      updateActiveTopic(topicChips, fields.subject);
      updateFormState(fields, validators, {
        progressFill,
        progressValue,
        progressLabel,
        formMoodTitle,
        formMoodText
      });
      if (assuranceText) {
        assuranceText.textContent = "وصلت الرسالة. يمكنك العودة لاحقًا أو إرسال رسالة أخرى وقت ما تحب.";
      }
    } catch (error) {
      successMessage.textContent = "حصلت مشكلة أثناء الإرسال. حاول مرة أخرى بعد قليل.";
      successMessage.dataset.state = "error";
      if (assuranceText) {
        assuranceText.textContent = "يبدو أن هناك مشكلة مؤقتة في الإرسال، لكن بياناتك ما زالت موجودة في النموذج.";
      }
      return;
    } finally {
      if (!successMessage.dataset.state) {
        successMessage.dataset.state = "success";
      }
      setSubmitState(submitButton, false);
    }
  });
}

function validateField(key, input, validator, shouldValidate) {
  if (!input || typeof validator !== "function") return "";

  const value = input.value.trim();
  const hasValue = value.length > 0;
  const error = validator(input.value);

  input.classList.remove("is-valid");

  if (!hasValue && !shouldValidate) {
    clearError(input);
    updateFieldShell(input);
    return "";
  }

  if (error) {
    if (shouldValidate) {
      showError(input, error);
    } else {
      clearError(input);
    }
    updateFieldShell(input);
    return error;
  }

  clearError(input);
  if (hasValue) {
    input.classList.add("is-valid");
  }
  updateFieldShell(input);
  return "";
}

function showError(input, message) {
  const errorNode = input.parentElement.querySelector(".error");
  if (errorNode) {
    errorNode.textContent = message;
  }
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const errorNode = input.parentElement.querySelector(".error");
  if (errorNode) {
    errorNode.textContent = "";
  }
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
}

function updateFieldShell(input) {
  const shell = input?.closest(".input-box");
  if (!shell) return;

  const hasValue = Boolean(input.value.trim());
  const isValid = input.classList.contains("is-valid");
  shell.classList.toggle("is-complete", hasValue && isValid);
}

function buildPayload(fields) {
  return {
    name: fields.name?.value.trim() || "",
    email: fields.email?.value.trim() || "",
    subject: fields.subject?.value.trim() || "",
    message: fields.message?.value.trim() || "",
    page: "contact",
    submittedAt: new Date().toISOString()
  };
}

function setSubmitState(button, isSubmitting) {
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "جارٍ الإرسال..." : "إرسال الرسالة";
}

function updateMessageCounter(input, counterNode) {
  if (!input || !counterNode) return;
  const count = input.value.trim().length;
  counterNode.textContent = `${count} / 500`;
}

function updateActiveTopic(chips, subjectInput) {
  const subjectValue = subjectInput?.value.trim();
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.subject === subjectValue);
  });
}

function updateFormState(fields, validators, elements) {
  const filledCount = Object.entries(fields).reduce((total, [key, input]) => {
    if (!input) return total;
    const hasValue = Boolean(input.value.trim());
    const hasError = Boolean(validators[key](input.value));
    return total + (hasValue && !hasError ? 1 : 0);
  }, 0);

  const percentage = Math.round((filledCount / Object.keys(fields).length) * 100);

  if (elements.progressFill) {
    elements.progressFill.style.width = `${percentage}%`;
  }

  if (elements.progressValue) {
    elements.progressValue.textContent = `${percentage}%`;
  }

  if (elements.progressLabel) {
    elements.progressLabel.textContent = `${filledCount} من 4 مكتمل`;
  }

  const mood = getFormMood(percentage);
  if (elements.formMoodTitle) {
    elements.formMoodTitle.textContent = mood.title;
  }
  if (elements.formMoodText) {
    elements.formMoodText.textContent = mood.text;
  }
}

function getFormMood(percentage) {
  if (percentage >= 100) {
    return {
      title: "جاهز للإرسال",
      text: "كل شيء واضح الآن. راجع الرسالة سريعًا واضغط إرسال وقتما تكون جاهزًا."
    };
  }

  if (percentage >= 75) {
    return {
      title: "أنت قريب جدًا",
      text: "باقي لمسة صغيرة فقط، وبعدها تصبح الرسالة جاهزة للوصول لفريقنا."
    };
  }

  if (percentage >= 50) {
    return {
      title: "المسار ممتاز",
      text: "الرسالة بدأت تتشكل بشكل واضح. أكمل بنفس البساطة التي بدأت بها."
    };
  }

  if (percentage >= 25) {
    return {
      title: "بداية جميلة",
      text: "تمام جدًا. لا تحتاج لصياغة مثالية، فقط وضّح ما تحتاجه وسنكمل معك."
    };
  }

  return {
    title: "المشهد هادئ هنا",
    text: "ابدأ باسمك أو موضوعك، والباقي سيكمل معك خطوة بخطوة."
  };
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
