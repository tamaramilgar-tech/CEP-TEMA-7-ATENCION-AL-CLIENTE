const STORAGE_KEY = "cep_tema7_progress_v2";
const PASS_SCORE = 8;
const QUESTIONS_PER_TEST = 10;
const MAX_ATTEMPTS = 2;
const TEACHER_PASSWORD = "tmilgar";
let pendingValidation = null;

function createDefaultState() {
  const phases = {};
  for (const phase of window.TEMA7_DATA.phases) {
    phases[phase.id] = {
      practiceDone: false,
      practiceNotes: "",
      practiceValidated: false,
      progressionValidated: false,
      attempts: 0,
      bestScore: 0,
      passed: false,
      currentAnswers: {},
      currentQuestions: []
    };
  }
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teacherVerified: false,
    prephase: {
      mapDone: false,
      notes: "",
      mapPuzzleAnswers: ["", "", "", "", "", ""],
      mapPuzzleSolved: false,
      validated: false
    },
    phases
  };
}

function mergeState(base, saved) {
  const merged = structuredClone(base);
  Object.assign(merged, saved || {});
  merged.prephase = { ...base.prephase, ...(saved?.prephase || {}) };
  for (const phase of window.TEMA7_DATA.phases) {
    merged.phases[phase.id] = { ...base.phases[phase.id], ...(saved?.phases?.[phase.id] || {}) };
  }
  return merged;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return mergeState(createDefaultState(), JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

let state = loadState();

const PROFILE_KEY = "tema7_student_profile_v1";

function defaultProfile() {
  return {
    studentName: "",
    centerName: "",
    moduleName: "Atención al cliente",
    courseName: ""
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return { ...defaultProfile(), ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return defaultProfile();
  }
}

let profile = loadProfile();

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
window.addEventListener("beforeunload", () => { saveState(); saveProfile(); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") { saveState(); saveProfile(); }
});

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(array, rng = Math.random) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}
function makeSeed() { return Math.floor(Date.now() * Math.random()) >>> 0; }

function buildTestForPhase(phaseId) {
  const phase = window.TEMA7_DATA.phases.find((item) => item.id === phaseId);
  const phaseState = state.phases[phaseId];
  const rng = seededRandom(makeSeed());
  phaseState.currentQuestions = shuffle(phase.questions, rng).slice(0, QUESTIONS_PER_TEST).map((question, index) => ({
    id: `${phaseId}_q${index + 1}`,
    prompt: question.prompt,
    explanation: question.explanation,
    figure: question.figure || null,
    options: shuffle([question.correct, ...question.wrongs].map((text) => ({ text, isCorrect: text === question.correct })), rng)
  }));
  phaseState.currentAnswers = {};
  saveState();
  return phaseState.currentQuestions;
}

function getQuestionsForPhase(phaseId) {
  const current = state.phases[phaseId].currentQuestions;
  return current && current.length === QUESTIONS_PER_TEST ? current : buildTestForPhase(phaseId);
}

function phaseUnlocked(index) {
  if (index === 0) return state.prephase.validated;
  const prev = state.phases[window.TEMA7_DATA.phases[index - 1].id];
  return prev.progressionValidated;
}

function completionStats() {
  const entries = window.TEMA7_DATA.phases.map((p) => state.phases[p.id]);
  const totalPhases = entries.length;
  const passedTests = entries.filter((p) => p.passed).length;
  const validatedPractices = entries.filter((p) => p.practiceValidated).length;
  const validatedProgressions = entries.filter((p) => p.progressionValidated).length;
  const mapComplete = state.prephase.mapDone ? 1 : 0;
  const mapValidated = state.prephase.validated ? 1 : 0;
  const finished = state.prephase.mapDone && state.prephase.validated && entries.every((p) => p.practiceValidated && p.passed);
  const completedUnits = mapComplete + mapValidated + validatedPractices + passedTests + validatedProgressions;
  const totalUnits = 2 + totalPhases * 3;
  return { totalPhases, passedTests, validatedPractices, validatedProgressions, mapComplete, mapValidated, finished, percent: Math.round((completedUnits / totalUnits) * 100) };
}

function updateProgressUI() {
  const fill = document.querySelector("#globalProgressFill");
  const label = document.querySelector("#globalProgressLabel");
  if (!fill || !label) return;
  const s = completionStats();
  fill.style.width = `${s.percent}%`;
  label.textContent = `Progreso global: ${s.percent}% · mapa ${s.mapValidated ? "validado" : "pendiente"} · prácticas ${s.validatedPractices}/${s.totalPhases} · test ${s.passedTests}/${s.totalPhases}`;
}

function renderHome() {
  const app = document.querySelector("#app");
  const pre = window.TEMA7_DATA.prephase;
  app.innerHTML = `
    <section class="card">
      <p class="eyebrow">Identificación del alumnado</p>
      <h2 class="section-title">Ficha del estudiante</h2>
      <div class="profile-grid">
        <label><span>Nombre y apellidos</span><input type="text" id="profileStudentName" value="${escapeHtml(profile.studentName)}" placeholder="Nombre y apellidos" /></label>
        <label><span>Centro educativo</span><input type="text" id="profileCenterName" value="${escapeHtml(profile.centerName)}" placeholder="Nombre del centro" /></label>
        <label><span>Módulo</span><input type="text" id="profileModuleName" value="${escapeHtml(profile.moduleName)}" placeholder="Módulo" /></label>
        <label><span>Curso / grupo</span><input type="text" id="profileCourseName" value="${escapeHtml(profile.courseName)}" placeholder="Curso o grupo" /></label>
      </div>
      <p class="muted">Estos datos se guardan en este navegador y se usan en el certificado y en el resumen docente.</p>
    </section>

    <section class="card">
      <p class="eyebrow">Misión del alumnado</p>
      <h2 class="section-title">Aventura de aprendizaje</h2>
      <div class="intro-grid">
        <div>
          <div class="progress-bar"><span id="globalProgressFill"></span></div>
          <p id="globalProgressLabel" class="muted"></p>
        </div>
        <div class="chips">
          <span class="chip">Mapa conceptual manuscrito</span>
          <span class="chip">Prácticas por apartados</span>
          <span class="chip">Test</span>
          <span class="chip">Figuras y diagramas</span>
          <span class="chip">Guardado automático</span>
        </div>
      </div>
    </section>

    <section class="card" id="aventura">
      <p class="eyebrow">Fase previa</p>
      <h2>${pre.title}</h2>
      <p>${pre.goal}</p>
      <div class="intro-grid">
        <article class="module">
          <h3>Indicaciones</h3>
          <ul>${pre.instructions.map((item) => `<li>${item}</li>`).join("")}</ul>
          <p><strong>Entrega:</strong> ${pre.deliverable}</p>
        </article>
        <article class="module">
          <h3>Checklist del mapa</h3>
          <ul>${pre.checks.map((item) => `<li>${item}</li>`).join("")}</ul>
          <label class="practice__checkbox">
            <input type="checkbox" id="mapDoneCheckbox" ${state.prephase.mapDone ? "checked" : ""}/>
            <span>Confirmo que he realizado el mapa conceptual de forma manuscrita.</span>
          </label>
          <label for="mapNotes">Observaciones</label>
          <textarea id="mapNotes" rows="4">${escapeHtml(state.prephase.notes || "")}</textarea>
          <div class="practice__actions" style="margin-top:14px">
            <button class="btn btn--secondary" type="button" data-request-validation="prephase" ${!state.prephase.mapDone ? "disabled" : ""}>Solicitud del código docente</button>
          </div>
          <p class="status ${state.prephase.validated ? "status--ok" : "status--warn"}">${state.prephase.validated ? "Mapa validado. Ya puedes acceder a la fase 1." : "Pendiente de validación docente para abrir la fase 1."}</p>
        </article>
      </div>

      <article class="module">
        <h3>Minirreto visual: completa el mapa del tema</h3>
        <p>Selecciona el concepto adecuado en cada hueco.</p>
        <div class="quest-map">
          ${renderPuzzleNode(0, "El cliente y su importancia")}
          ${renderPuzzleNode(1, "Motivaciones y necesidades")}
          ${renderPuzzleNode(2, "Proceso de decisión")}
          ${renderPuzzleNode(3, "Elementos de atención")}
          ${renderPuzzleNode(4, "Departamento de atención")}
          ${renderPuzzleNode(5, "Comunicación y asesoramiento")}
        </div>
        <div class="practice__actions" style="margin-top:16px">
          <button class="btn btn--secondary" id="checkPuzzleBtn">Comprobar mapa</button>
          <button class="btn btn--ghost" id="resetPuzzleBtn">Reiniciar huecos</button>
        </div>
        <p id="puzzleStatus" class="status"></p>
      </article>
    </section>
  `;
  bindPrephase();
  renderPhases(app);
  updateProgressUI();
}

function renderPuzzleNode(index, title) {
  const optionsByIndex = [
    ["cliente", "mercado", "empresa", "consumidor"],
    ["motivaciones", "precio", "publicidad", "competencia"],
    ["decisión de compra", "producto", "inventario", "surtido"],
    ["atención al cliente", "promoción", "financiación", "logística"],
    ["departamento", "mostrador", "proveedor", "almacén"],
    ["comunicación", "asesoramiento", "facturación", "cobro"]
  ];
  const values = state.prephase.mapPuzzleAnswers;
  return `<div class="map-node"><h4>${title}</h4><p>Completa el hueco clave.</p><select data-puzzle-index="${index}" class="puzzle-select"><option value="">Selecciona...</option>${optionsByIndex[index].map((opt) => `<option value="${opt}" ${values[index] === opt ? "selected" : ""}>${capitalize(opt)}</option>`).join("")}</select></div>`;
}

function bindPrephase() {
  document.querySelector("#mapDoneCheckbox")?.addEventListener("change", (e) => { state.prephase.mapDone = e.target.checked; saveState(); refresh(); });
  document.querySelector("#mapNotes")?.addEventListener("input", (e) => { state.prephase.notes = e.target.value; saveState(); });
  document.querySelectorAll(".puzzle-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.prephase.mapPuzzleAnswers[Number(event.target.dataset.puzzleIndex)] = event.target.value;
      saveState();
    });
  });
  const puzzleStatus = document.querySelector("#puzzleStatus");
  const correct = ["cliente", "motivaciones", "decisión de compra", "atención al cliente", "departamento", "comunicación"];
  document.querySelector("#checkPuzzleBtn")?.addEventListener("click", () => {
    const ok = correct.every((answer, i) => state.prephase.mapPuzzleAnswers[i] === answer);
    state.prephase.mapPuzzleSolved = ok;
    puzzleStatus.textContent = ok ? "Mapa completado correctamente." : "Revisa algunos huecos y vuelve a intentarlo.";
    puzzleStatus.className = `status ${ok ? "status--ok" : "status--warn"}`;
    saveState();
  });
  document.querySelector("#resetPuzzleBtn")?.addEventListener("click", () => {
    state.prephase.mapPuzzleAnswers = ["", "", "", "", "", ""];
    state.prephase.mapPuzzleSolved = false;
    saveState();
    refresh();
  });
  if (state.prephase.mapPuzzleSolved) {
    puzzleStatus.textContent = "Mapa completado correctamente.";
    puzzleStatus.className = "status status--ok";
  }
}

function renderPhases(app) {
  window.TEMA7_DATA.phases.forEach((phase, index) => {
    const unlocked = phaseUnlocked(index);
    const phaseState = state.phases[phase.id];
    const badgePractice = phaseState.practiceValidated ? "Práctica validada" : "Práctica pendiente";
    const badgeTest = phaseState.passed ? "Test superado" : (phaseState.practiceValidated ? "Test disponible" : "Test bloqueado");
    const phaseImage = `<div class="phase__art art-${phase.id}"><div class="phase__art-icon">${phaseIcon(phase.id)}</div><p>${phase.scene}</p></div>`;
    const section = document.createElement("section");
    section.className = `phase card ${unlocked ? "" : "phase--locked"}`;
    section.dataset.phase = phase.id;
    section.id = phase.id;
    section.innerHTML = `
      <div class="phase__header">
        <div>
          <p class="phase__scene">${phase.scene}</p>
          <h3 class="phase__title">${phase.title}</h3>
        </div>
        <div class="phase__meta">
          <span>${badgePractice}</span>
          <span>${badgeTest}</span>
        </div>
      </div>
      <div class="phase__summary"><ul>${phase.summary.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      ${phaseImage}
      ${unlocked ? `<div class="phase__grid">${renderPractice(phase, index)}${renderTest(phase, index)}</div>` : renderLockedPhase(index)}
    `;
    app.appendChild(section);
  });
  bindPhaseEvents();
}

function renderLockedPhase(index) {
  const prevTitle = index === 0 ? "fase previa" : window.TEMA7_DATA.phases[index - 1].title;
  return `<div class="module module--locked"><h4>Acceso bloqueado</h4><p>Esta fase se abrirá cuando el docente valide el avance de la ${prevTitle}.</p></div>`;
}

function renderPractice(phase, index) {
  const st = state.phases[phase.id];
  const heading = `Fase ${index + 1} · Práctica a entregar en EVAGD`;
  return `
    <article class="module module--practice-box">
      <h4>${heading}</h4>
      <p>${phase.practice.intro}</p>
      <ol>${phase.practice.parts.map((part) => `<li>${part}</li>`).join("")}</ol>
      <p><strong>Entrega:</strong> Entrega manuscrita obligatoria. Mínimo un folio.</p>
      <p><strong>Rúbrica:</strong> ${phase.practice.rubric.join(" · ")}</p>
      <label class="practice__checkbox">
        <input type="checkbox" data-practice="${phase.id}" ${st.practiceDone ? "checked" : ""} />
        <span>Confirmo que he entregado la práctica manuscrita.</span>
      </label>
      <label for="note_${phase.id}">Notas de seguimiento</label>
      <textarea id="note_${phase.id}" data-practice-note="${phase.id}" rows="4">${escapeHtml(st.practiceNotes || "")}</textarea>
      <div class="practice__actions" style="margin-top:14px">
        <button class="btn btn--secondary" type="button" data-request-validation="practice:${phase.id}" ${!st.practiceDone || st.practiceValidated ? "disabled" : ""}>Solicitud del código docente</button>
      </div>
      <p class="status ${st.practiceValidated ? "status--ok" : "status--warn"}">${st.practiceValidated ? "Práctica validada. El test ya está disponible." : "El test permanece bloqueado hasta la validación docente de la práctica."}</p>
      <div class="module" style="margin-top:14px">
        <h5>Recursos sugeridos</h5>
        <div class="resource-list">${phase.resources.map((item) => `<a href="${item.url}" target="_blank" rel="noopener noreferrer"><span>${item.label}</span><strong>↗</strong></a>`).join("")}</div>
      </div>
    </article>`;
}

function renderTest(phase, index) {
  const st = state.phases[phase.id];
  if (!st.practiceValidated) {
    return `<article class="module module--test-box"><h4>Test de fase</h4><div class="module module--locked"><p>Bloqueado hasta que el docente valide la práctica de esta fase.</p></div></article>`;
  }
  const questions = getQuestionsForPhase(phase.id);
  return `
    <article class="module module--test-box">
      <h4>Test de fase</h4>
      <p>Debes acertar al menos <strong>${PASS_SCORE}</strong> de ${QUESTIONS_PER_TEST}. Dispones de <strong>${MAX_ATTEMPTS}</strong> intentos.</p>
      <p class="muted">Intentos usados: ${st.attempts}/${MAX_ATTEMPTS} · Mejor nota: ${st.bestScore}/${QUESTIONS_PER_TEST}</p>
      ${questions.map((question, qIndex) => `<div class="question" data-question="${question.id}"><h5>${qIndex + 1}. ${question.prompt}</h5>${question.figure ? `<div class="figure">${question.figure}</div>` : ""}<div class="options">${question.options.map((option, oIndex) => `<button type="button" class="option ${st.currentAnswers[question.id] === option.text ? "is-selected" : ""}" data-option-for="${question.id}" data-value="${encodeURIComponent(option.text)}">${String.fromCharCode(65 + oIndex)}. ${option.text}</button>`).join("")}</div><p class="muted hidden" data-expl="${question.id}"></p></div>`).join("")}
      <div class="test__actions" style="margin-top:14px"><button class="btn btn--primary" data-submit-test="${phase.id}" ${st.attempts >= MAX_ATTEMPTS && !st.passed ? "disabled" : ""}>Corregir test</button></div>
      <p class="status ${st.passed ? "status--ok" : (st.attempts >= MAX_ATTEMPTS ? "status--bad" : "status--warn")}" id="status_${phase.id}">${st.passed ? `Test superado con una calificación válida para certificación.` : (st.attempts >= MAX_ATTEMPTS ? "Intentos agotados. El docente puede reiniciarlos desde el panel docente." : "Completa y corrige el test cuando estés preparado.")}</p>
      <div class="practice__actions" style="margin-top:14px"><button class="btn btn--secondary" type="button" data-request-validation="progress:${phase.id}" ${!st.passed || st.progressionValidated || index === window.TEMA7_DATA.phases.length - 1 ? "disabled" : ""}>Solicitud del código docente</button></div>
      ${index === window.TEMA7_DATA.phases.length - 1 ? `<p class="status ${st.passed ? "status--ok" : "status--warn"}">${st.passed ? "Última fase superada." : "Supera el test para completar el itinerario."}</p>` : `<p class="status ${st.progressionValidated ? "status--ok" : "status--warn"}">${st.progressionValidated ? "Acceso validado para la fase siguiente." : "La siguiente fase se abrirá cuando el docente valide este avance."}</p>`}
    </article>`;
}

function bindPhaseEvents() {
  const bindProfile = (selector, key) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener("input", (event) => {
      profile[key] = event.target.value;
      saveProfile();
    });
  };
  bindProfile("#profileStudentName", "studentName");
  bindProfile("#profileCenterName", "centerName");
  bindProfile("#profileModuleName", "moduleName");
  bindProfile("#profileCourseName", "courseName");
  document.querySelectorAll("[data-practice]").forEach((checkbox) => checkbox.addEventListener("change", (event) => {
    const id = event.target.dataset.practice;
    state.phases[id].practiceDone = event.target.checked;
    saveState();
    refresh();
  }));
  document.querySelectorAll("[data-practice-note]").forEach((textarea) => textarea.addEventListener("input", (event) => {
    state.phases[event.target.dataset.practiceNote].practiceNotes = event.target.value;
    saveState();
  }));
  document.querySelectorAll("[data-option-for]").forEach((button) => button.addEventListener("click", (event) => {
    const qid = event.currentTarget.dataset.optionFor;
    const phaseId = qid.split("_q")[0];
    const value = decodeURIComponent(event.currentTarget.dataset.value);
    state.phases[phaseId].currentAnswers[qid] = value;
    saveState();
    document.querySelectorAll(`[data-option-for="${qid}"]`).forEach((btn) => btn.classList.toggle("is-selected", decodeURIComponent(btn.dataset.value) === value));
  }));
  document.querySelectorAll("[data-submit-test]").forEach((button) => button.addEventListener("click", () => submitTest(button.dataset.submitTest)));
  document.querySelectorAll("[data-request-validation]").forEach((button) => button.addEventListener("click", () => openValidationDialog(button.dataset.requestValidation)));
}

function submitTest(phaseId) {
  const st = state.phases[phaseId];
  if (st.attempts >= MAX_ATTEMPTS && !st.passed) return;
  const questions = getQuestionsForPhase(phaseId);
  st.attempts += 1;
  let score = 0;
  for (const question of questions) {
    const selected = st.currentAnswers[question.id];
    const correct = question.options.find((option) => option.isCorrect);
    const wrap = document.querySelector(`[data-question="${question.id}"]`);
    question.options.forEach((option) => {
      const btn = wrap?.querySelector(`[data-option-for="${question.id}"][data-value="${encodeURIComponent(option.text)}"]`);
      if (!btn) return;
      btn.classList.remove("is-correct", "is-wrong");
      if (option.isCorrect) btn.classList.add("is-correct");
      if (selected === option.text && !option.isCorrect) btn.classList.add("is-wrong");
    });
    if (selected === correct.text) score += 1;
    const expl = wrap?.querySelector(`[data-expl="${question.id}"]`);
    if (expl) {
      expl.classList.remove("hidden");
      expl.textContent = `Respuesta correcta: ${correct.text}. ${question.explanation}`;
    }
  }
  st.bestScore = Math.max(st.bestScore, score);
  if (score >= PASS_SCORE) st.passed = true;
  if (!st.passed && st.attempts < MAX_ATTEMPTS) buildTestForPhase(phaseId);
  saveState();
  refresh();
}

function currentValidationCode() {
  const dd = String(new Date().getDate()).padStart(2, "0");
  return `140877${dd}`;
}

function openValidationDialog(context) {
  pendingValidation = context;
  document.querySelector("#validationCode").value = "";
  const s = document.querySelector("#validationStatus");
  s.textContent = "";
  s.className = "dialog__status";
  document.querySelector("#validationDialog")?.showModal();
}

function applyValidation(context) {
  if (context === "prephase") state.prephase.validated = true;
  else {
    const [kind, phaseId] = context.split(":");
    if (kind === "practice") state.phases[phaseId].practiceValidated = true;
    if (kind === "progress") state.phases[phaseId].progressionValidated = true;
  }
  saveState();
  refresh();
}

function setupValidationDialog() {
  const dialog = document.querySelector("#validationDialog");
  document.querySelector("#closeValidationDialog")?.addEventListener("click", () => dialog.close());
  document.querySelector("#validationForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#validationCode");
    const status = document.querySelector("#validationStatus");
    if ((input.value || "").trim() !== currentValidationCode()) {
      status.textContent = "Código docente incorrecto.";
      status.className = "dialog__status status status--bad";
      return;
    }
    applyValidation(pendingValidation);
    status.textContent = "Validación correcta.";
    status.className = "dialog__status status status--ok";
    dialog.close();
  });
}

function setupTeacherPanel() {
  const dialog = document.querySelector("#teacherDialog");
  document.querySelector("#openTeacherPanelBtn")?.addEventListener("click", () => dialog.showModal());
  document.querySelector("#closeTeacherDialog")?.addEventListener("click", () => dialog.close());
  document.querySelector("#teacherForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#teacherPassword");
    const status = document.querySelector("#teacherStatus");
    const tools = document.querySelector("#teacherTools");
    if ((input.value || "").trim() !== TEACHER_PASSWORD) {
      status.textContent = "Contraseña incorrecta.";
      status.className = "dialog__status status status--bad";
      tools.hidden = true;
      return;
    }
    state.teacherVerified = true;
    saveState();
    status.textContent = "Acceso correcto. Herramientas docentes activadas.";
    status.className = "dialog__status status status--ok";
    tools.hidden = false;
  });
  document.querySelector("#unlockAllBtn")?.addEventListener("click", () => {
    state.prephase.mapDone = true;
    state.prephase.mapPuzzleSolved = true;
    state.prephase.validated = true;
    window.TEMA7_DATA.phases.forEach((phase) => {
      state.phases[phase.id].practiceDone = true;
      state.phases[phase.id].practiceValidated = true;
      state.phases[phase.id].passed = true;
      state.phases[phase.id].progressionValidated = true;
      state.phases[phase.id].bestScore = QUESTIONS_PER_TEST;
    });
    saveState();
    refresh(true);
  });
  document.querySelector("#resetAttemptsBtn")?.addEventListener("click", () => {
    window.TEMA7_DATA.phases.forEach((phase) => {
      state.phases[phase.id].attempts = 0;
      state.phases[phase.id].bestScore = 0;
      state.phases[phase.id].passed = false;
      state.phases[phase.id].currentAnswers = {};
      state.phases[phase.id].currentQuestions = [];
      state.phases[phase.id].progressionValidated = false;
    });
    saveState();
    refresh();
  });
  const renderTeacherSummary = () => {
    const box = document.querySelector("#teacherSummaryBox");
    if (!box) return;
    const stats = completionStats();
    const rows = window.TEMA7_DATA.phases.map((phase, index) => {
      const st = state.phases[phase.id];
      return `F${index + 1}: práctica ${st.practiceValidated ? "ok" : "pendiente"}, test ${st.passed ? `${st.bestScore}/${QUESTIONS_PER_TEST}` : "pendiente"}, acceso ${index === window.TEMA7_DATA.phases.length - 1 ? "final" : (st.progressionValidated ? "ok" : "pendiente")}`;
    });
    box.className = "status status--ok";
    box.innerHTML = `<strong>Resumen del alumno</strong><br>${escapeHtml(profile.studentName || "Sin nombre") } · ${escapeHtml(profile.centerName || "Centro sin indicar")}<br>Módulo: ${escapeHtml(profile.moduleName || "No indicado")} · Curso: ${escapeHtml(profile.courseName || "No indicado")}<br>Mapa: ${state.prephase.validated ? "validado" : "pendiente"} · Prácticas: ${stats.validatedPractices}/${stats.totalPhases} · Test: ${stats.passedTests}/${stats.totalPhases} · Progreso: ${stats.percent}%<br>${rows.map(escapeHtml).join("<br>")}`;
  };

  document.querySelector("#teacherSummaryBtn")?.addEventListener("click", renderTeacherSummary);
  document.querySelector("#exportProgressBtn")?.addEventListener("click", () => {
    const payload = { profile, progress: state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tema7-atencion-al-cliente-progreso.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.querySelector("#clearProgressBtn")?.addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar todo el progreso guardado?")) return;
    state = createDefaultState();
    saveState();
    refresh(true);
  });
  if (state.teacherVerified) {
    document.querySelector("#teacherStatus").textContent = "Acceso correcto. Herramientas docentes activadas.";
    document.querySelector("#teacherStatus").className = "dialog__status status status--ok";
    document.querySelector("#teacherTools").hidden = false;
    const summaryBox = document.querySelector("#teacherSummaryBox"); if (summaryBox) summaryBox.textContent = "Pulsa en Ver resumen del alumno para cargar el estado actual.";
  }
}

function setupCertificatePage() {
  const statsWrap = document.querySelector("#certificateStats");
  if (!statsWrap) return;
  const stats = completionStats();
  const avgBest = (window.TEMA7_DATA.phases.map((phase) => state.phases[phase.id].bestScore).reduce((a, b) => a + b, 0) / window.TEMA7_DATA.phases.length).toFixed(1);
  document.querySelector("#todayDate").textContent = new Date().toLocaleDateString("es-ES");
  document.querySelector("#completionState").textContent = stats.finished ? "Itinerario completado" : "Itinerario aún en progreso";
  statsWrap.innerHTML = `
    <article class="stat"><strong>Mapa conceptual</strong><p>${stats.mapValidated ? "Validado" : "Pendiente"}</p></article>
    <article class="stat"><strong>Prácticas validadas</strong><p>${stats.validatedPractices}/${stats.totalPhases}</p></article>
    <article class="stat"><strong>Test superados</strong><p>${stats.passedTests}/${stats.totalPhases}</p></article>
    <article class="stat"><strong>Media mejor test</strong><p>${avgBest}/${QUESTIONS_PER_TEST}</p></article>
    <article class="stat"><strong>Criterio mínimo</strong><p>80%</p></article>
    <article class="stat"><strong>Progreso global</strong><p>${stats.percent}%</p></article>`;
  const studentName = document.querySelector("#studentName");
  const centerName = document.querySelector("#centerName");
  const moduleName = document.querySelector("#moduleName");
  const courseName = document.querySelector("#courseName");
  studentName.value = profile.studentName || "";
  centerName.value = profile.centerName || "";
  moduleName.value = profile.moduleName || "Atención al cliente";
  courseName.value = profile.courseName || "";
  const syncField = (element, key) => element?.addEventListener("input", () => { profile[key] = element.value; saveProfile(); });
  syncField(studentName, "studentName");
  syncField(centerName, "centerName");
  syncField(moduleName, "moduleName");
  syncField(courseName, "courseName");
  const detailWrap = document.querySelector("#certificateDetail");
  if (detailWrap) {
    detailWrap.innerHTML = window.TEMA7_DATA.phases.map((phase, index) => {
      const st = state.phases[phase.id];
      return `<article class="stat"><strong>Fase ${index + 1}</strong><p>${escapeHtml(phase.title)}</p><p>Práctica: ${st.practiceValidated ? "Validada" : "Pendiente"}</p><p>Test: ${st.passed ? `Superado (${st.bestScore}/${QUESTIONS_PER_TEST})` : "Pendiente"}</p></article>`;
    }).join("");
  }
  document.querySelector("#printCertificateBtn")?.addEventListener("click", () => window.print());
}

function phaseIcon(id) {
  return ({fase1:"🧭", fase2:"🧠", fase3:"🛒", fase4:"🤝", fase5:"🏢", fase6:"💬"}[id]) || "⭐";
}
function escapeHtml(text) { return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function capitalize(text) { return text.charAt(0).toUpperCase() + text.slice(1); }
function refresh(scrollToTop = false) { const y = scrollToTop ? 0 : window.scrollY; renderHome(); if (!scrollToTop) window.scrollTo({ top: y }); }

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  setupTeacherPanel();
  setupValidationDialog();
  setupCertificatePage();
});
