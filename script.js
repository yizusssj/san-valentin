const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const fromName = document.getElementById("fromName");
const audioBtn = document.getElementById("audioBtn");
const music = document.getElementById("bgMusic");

const secret = document.getElementById("secret");
const backBtn = document.getElementById("backBtn");

// Personaliza nombre aquí
if (fromName) fromName.textContent = "Yisus";

/* ---------------------------
   AUDIO (iPhone friendly)
---------------------------- */
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
    // Safari puede bloquear hasta interacción; lo intentamos cuando se pueda.
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
    if (!music) return;
    if (audioOn) stopMusic();
    else await startMusic();
  });
}
setAudioIcon();

/* ---------------------------
   MODAL PRO
---------------------------- */
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

if (yesBtn) {
  yesBtn.addEventListener("click", async () => {
    // música en interacción ✅
    await startMusic();

    // corazoncitos 🎉
    heartsBurst();

    // modal
    openModal();
  });
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);

// Cerrar tocando afuera del modal-card
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ESC para cerrar
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ---------------------------
   CONFETTI DE CORAZONES
---------------------------- */
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
      {
        duration: 1100 + Math.random() * 450,
        easing: "cubic-bezier(.2,.8,.2,1)"
      }
    );

    setTimeout(() => s.remove(), 1700);
  }
}

/* ---------------------------
   BOTÓN NO (smooth escape)
---------------------------- */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

let tries = 0;

function moveNoButton() {
  if (!noBtn) return;

  const card = document.querySelector(".card");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // área para moverse dentro de la card (aprox)
  const padding = 18;
  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = 160;

  // movimiento suave y no tan loco
  const x = (Math.random() * maxX) - (maxX / 2);
  const y = (Math.random() * maxY) - (maxY / 2);

  noBtn.style.transform = `translate(${clamp(x, -maxX/2, maxX/2)}px, ${clamp(y, -maxY/2, maxY/2)}px)`;

  tries++;
  if (tries === 5) noBtn.textContent = "¿Segura? 🥺";
  if (tries === 9) noBtn.textContent = "Ándale… 😭";
  if (tries === 12) {
    noBtn.textContent = "ya ps 😶";
    noBtn.style.opacity = "0.55";
  }
}

// escritorio
if (noBtn) noBtn.addEventListener("mouseenter", moveNoButton);

// móvil: cuando intenta tocar
if (noBtn) {
  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      moveNoButton();
    },
    { passive: false }
  );
}

/* ---------------------------
   EASTER EGG: long press en Sí
   (1s abre la pantalla sorpresa)
---------------------------- */
let pressTimer = null;

function openSecret() {
  if (!secret) return;
  secret.hidden = false;
  // cerrar modal si estuviera
  closeModal();
}

function closeSecret() {
  if (!secret) return;
  secret.hidden = true;
}

if (backBtn) backBtn.addEventListener("click", closeSecret);

if (yesBtn) {
  const startPress = () => {
    clearTimeout(pressTimer);
    pressTimer = setTimeout(openSecret, 1000);
  };
  const endPress = () => {
    clearTimeout(pressTimer);
  };

  yesBtn.addEventListener("mousedown", startPress);
  yesBtn.addEventListener("mouseup", endPress);
  yesBtn.addEventListener("mouseleave", endPress);

  yesBtn.addEventListener("touchstart", startPress, { passive: true });
  yesBtn.addEventListener("touchend", endPress);
  yesBtn.addEventListener("touchcancel", endPress);
}
