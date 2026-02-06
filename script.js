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

// ESC para cerrar modal (y secret también)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeSecret();
  }
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

  const padding = 18;
  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = 160;

  const x = (Math.random() * maxX) - (maxX / 2);
  const y = (Math.random() * maxY) - (maxY / 2);

  noBtn.style.transform = `translate(${clamp(x, -maxX / 2, maxX / 2)}px, ${clamp(y, -maxY / 2, maxY / 2)}px)`;

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
   SORPRESA (pantalla secreta)
   FIX: usamos hidden + style.display para que NUNCA se quede abierta
---------------------------- */
function applySecretVisibility() {
  if (!secret) return;
  // hidden a veces no gana vs CSS display, así que forzamos:
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

// arranque SIEMPRE cerrada
if (secret) {
  secret.hidden = true;
  applySecretVisibility();
}

// botón volver
if (backBtn) backBtn.addEventListener("click", closeSecret);

// cerrar tocando afuera del cuadro (tap en el overlay)
if (secret) {
  secret.addEventListener("click", (e) => {
    if (e.target === secret) closeSecret();
  });
}

/* ---------------------------
   EASTER EGG: long press en SÍ
---------------------------- */
let pressTimer = null;
let longPressFired = false;

if (yesBtn) {
  const startPress = () => {
    longPressFired = false;
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      longPressFired = true;
      openSecret();
    }, 900); // 0.9s se siente mejor que 1s
  };

  const endPress = () => {
    clearTimeout(pressTimer);
  };

  // mouse
  yesBtn.addEventListener("mousedown", startPress);
  yesBtn.addEventListener("mouseup", endPress);
  yesBtn.addEventListener("mouseleave", endPress);

  // touch
  yesBtn.addEventListener("touchstart", startPress, { passive: true });
  yesBtn.addEventListener("touchend", endPress);
  yesBtn.addEventListener("touchcancel", endPress);

  // Extra: si se activó long press, evitamos que el click normal abra modal
  yesBtn.addEventListener("click", (e) => {
  if (longPressFired) {
    // si fue long press, NO ejecutar click normal
    e.preventDefault();
    e.stopPropagation();
    longPressFired = false;
    return;
  }

  // click normal (tap rápido)
  // esto asegura que el modal SI se abra
  // (por si el navegador se pone mamón)
  openModal();
}, true);
}
