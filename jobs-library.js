const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") === "saved" ? "saved" : "applied";
  const key = activeTab === "saved" ? "savedJobs" : "appliedJobs";
  const title = document.getElementById("libraryTitle");
  const copy = document.getElementById("libraryCopy");
  const count = document.getElementById("libraryCount");
  const grid = document.getElementById("libraryGrid");
  const empty = document.getElementById("libraryEmpty");
  const appliedTab = document.getElementById("libraryAppliedTab");
  const savedTab = document.getElementById("librarySavedTab");
  const items = getStoredList(key);

  appliedTab?.classList.toggle("active", activeTab === "applied");
  savedTab?.classList.toggle("active", activeTab === "saved");

  if (title) {
    title.textContent = activeTab === "applied" ? "Applied Jobs" : "Saved Jobs";
  }

  if (copy) {
    copy.textContent = activeTab === "applied"
      ? "كل الوظائف التي قدّمت عليها محفوظة هنا مع الحالة الحالية والخطوة التالية."
      : "كل الوظائف التي حفظتها لمراجعتها لاحقًا موجودة هنا في نفس المكتبة.";
  }

  if (count) {
    count.textContent = `${items.length} ${activeTab === "applied" ? "Applied" : "Saved"}`;
  }

  if (!grid || !empty) return;

  if (!items.length) {
    grid.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.classList.remove("hidden");
  grid.innerHTML = items.map((item) => `
    <article class="library-card">
      <div class="library-head">
        <div>
          <strong>${item.title}</strong>
          <div class="library-meta">${item.company}</div>
        </div>
        <span class="match-pill">${item.match || 0}% Match</span>
      </div>
      <p class="library-meta">${item.location || "Job from your flow"}</p>
      <div class="library-tags">${(item.tagsLabel || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
      ${activeTab === "applied" ? `<span class="status-pill">${item.status || "Pending Review"}</span>` : ""}
      <div class="library-actions">
        <button class="primary-btn" type="button" data-open-job-id="${item.id}">Open Job Details</button>
        <a class="ghost-btn" href="candidate-passport.html">Open Passport</a>
        ${activeTab === "saved" ? `<button class="ghost-btn" type="button" data-remove-id="${item.id}">Remove</button>` : ""}
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-open-job-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-open-job-id");
      if (!id) return;
      window.localStorage.setItem(JOB_SELECTION_KEY, id);
      window.location.href = "job-details.html";
    });
  });

  document.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-remove-id");
      const next = items.filter((item) => item.id !== id);
      window.localStorage.setItem(key, JSON.stringify(next));
      syncPassportSavedJobs(next);
      window.location.reload();
    });
  });
});

function getStoredList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function syncPassportSavedJobs(savedJobs) {
  let passport = {};

  try {
    passport = JSON.parse(window.localStorage.getItem("skillbridgeTalentPassport") || "null") || {};
  } catch (error) {
    passport = {};
  }

  if (!passport.name) return;

  passport.savedJobs = savedJobs;
  passport.lastSeenAt = new Date().toISOString();
  window.localStorage.setItem("skillbridgeTalentPassport", JSON.stringify(passport));
}
