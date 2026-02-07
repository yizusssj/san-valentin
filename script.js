// ---------- refs ----------
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const fromName = document.getElementById("fromName");
const audioBtn = document.getElementById("audioBtn");
const music = document.getElementById("bgMusic");

const secret = document.getElementById("secret");
const backBtn = document.getElementById("backBtn");

const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const startBtn = document.getElementById("startBtn");
const mainContent = document.getElementById("mainContent");
const popSound = document.getElementById("popSound");

// nombre
if (fromName) fromName.textContent = "Yisus";

// ---------- AUDIO ----------
let audioOn = false;

function setAudioIcon() {
  if (!audioBtn) return;
  audioBtn.textContent = audioOn ? "🔊" : "🔇";
}

async function startMusic() {
  if (!music) return;
  try {
    music.volume = 0.6;
    await music.play();
    audioOn = true;
    setAudioIcon();
  } catch (e) {
    // Safari puede bloquear hasta interacción
  }
}

function stopMusic() {
  if (!music) return;
  music.pause();
  audioOn = false;
  setAudioIcon();
}

if (audioBtn) {
  audioBtn.addEventListener("click", async () => {
    if (audioOn) stopMusic();
    else await startMusic();
  });
}
setAudioIcon();

// ---------- MODAL ----------
function openModal() {
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ---------- SECRET ----------
function applySecretVisibility() {
  if (!secret) return;
  secret.style.display = secret.hidden ? "none" : "grid";
}

function openSecret() {
  if (!secret) return;
  closeModal();
  secret.hidden = false;
  applySecretVisibility();
}

function closeSecret() {
  if (!secret) return;
  secret.hidden = true;
  applySecretVisibility();
}

if (secret) {
  secret.hidden = true;
  applySecretVisibility();

  secret.addEventListener("click", (e) => {
    if (e.target === secret) closeSecret();
  });
}

if (backBtn) backBtn.addEventListener("click", closeSecret);

// ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeSecret();
  }
});

// ---------- HEART CONFETTI ----------
function heartsBurst() {
  const amount = 26;
  for (let i = 0; i < amount; i++) {
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.5 ? "💖" : "💘";
    s.style.position = "fixed";
    s.style.left = (window.innerWidth / 2 + (Math.random() * 160 - 80)) + "px";
    s.style.top = (window.innerHeight / 2 + (Math.random() * 100 - 50)) + "px";
    s.style.fontSize = (18 + Math.random() * 22) + "px";
    s.style.pointerEvents = "none";
    s.style.zIndex = "9999";
    document.body.appendChild(s);

    const x = (Math.random() * 2 - 1) * 260;
    const y = -(180 + Math.random() * 260);
    const rot = (Math.random() * 2 - 1) * 65;

    s.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: 1100 + Math.random() * 450, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    setTimeout(() => s.remove(), 1700);
  }
}

// ---------- NO BUTTON ----------
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
let tries = 0;

function moveNoButton() {
  if (!noBtn) return;
  const card = document.querySelector(".card");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 18;
  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = 160;

  const x = (Math.random() * maxX) - (maxX / 2);
  const y = (Math.random() * maxY) - (maxY / 2);

  noBtn.style.transform =
    `translate(${clamp(x, -maxX / 2, maxX / 2)}px, ${clamp(y, -maxY / 2, maxY / 2)}px)`;

  tries++;
  if (tries === 5) noBtn.textContent = "¿Segura? 🥺";
  if (tries === 9) noBtn.textContent = "Ándale… 😭";
  if (tries === 12) {
    noBtn.textContent = "ya ps 😶";
    noBtn.style.opacity = "0.55";
  }
}

if (noBtn) noBtn.addEventListener("mouseenter", moveNoButton);
if (noBtn) {
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });
}

/* ---------------------------
   BOTÓN SÍ: tap = modal | long press = sorpresa (ULTRA FIX)
---------------------------- */
let yesPressTimer = null;
let yesDidLongPress = false;
let yesTapHandled = false;

async function yesTapAction() {
  await startMusic();
  heartsBurst();
  openModal();
}

if (yesBtn) {
  yesBtn.style.touchAction = "manipulation";

  const startPress = (e) => {
    yesTapHandled = false;
    yesDidLongPress = false;
    clearTimeout(yesPressTimer);

    yesPressTimer = setTimeout(() => {
      yesDidLongPress = true;
      openSecret();
    }, 900);
  };

  const endPress = async (e) => {
    clearTimeout(yesPressTimer);

    // Si fue long press, NO hacer tap
    if (yesDidLongPress) return;

    // Tap normal
    yesTapHandled = true;
    await yesTapAction();
  };

  const cancelPress = () => clearTimeout(yesPressTimer);

  // Pointer (si jala)
  yesBtn.addEventListener("pointerdown", startPress);
  yesBtn.addEventListener("pointerup", endPress);
  yesBtn.addEventListener("pointercancel", cancelPress);
  yesBtn.addEventListener("pointerleave", cancelPress);

  // Touch fallback (iOS/Android raros)
  yesBtn.addEventListener("touchstart", startPress, { passive: true });
  yesBtn.addEventListener("touchend", endPress);
  yesBtn.addEventListener("touchcancel", cancelPress);

  // Mouse fallback (PC)
  yesBtn.addEventListener("mousedown", startPress);
  yesBtn.addEventListener("mouseup", endPress);
  yesBtn.addEventListener("mouseleave", cancelPress);

  // Click de respaldo (por si no cayó pointerup/touchend)
  yesBtn.addEventListener("click", async (e) => {
    if (yesDidLongPress) return;
    if (yesTapHandled) return; // ya se ejecutó en endPress
    await yesTapAction();
  });
}


// ---------- INTRO (envelope -> start -> main) ----------
function tryPlayPop() {
  if (!popSound) return;
  try {
    popSound.volume = 0.7;
    popSound.currentTime = 0;
    popSound.play();
  } catch (e) {}
}

let envelopeOpened = false;

function openEnvelope() {
  if (!envelope || envelopeOpened) return;
  envelopeOpened = true;

  envelope.classList.add("open");
  tryPlayPop();

  if (startBtn) {
    startBtn.classList.remove("hidden");
    startBtn.classList.add("shake");
  }
}

if (envelope) {
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("pointerdown", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });
}

async function startExperience() {
  if (intro) intro.classList.add("hidden");
  if (mainContent) mainContent.classList.remove("hidden");
  await startMusic();
}

if (startBtn) startBtn.addEventListener("click", startExperience);
