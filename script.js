const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");

const fromName = document.getElementById("fromName");
fromName.textContent = "Yisus"; // cámbialo por tu nombre

// Modal
yesBtn.addEventListener("click", () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
});

// Cerrar modal
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});

// No se escapa 😈
function moveNoButton() {
  const padding = 16;

  const wrap = document.querySelector(".card");
  const rect = wrap.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = 120; // limita el movimiento para que no se vaya muy lejos

  const x = Math.floor(Math.random() * (maxX + 1)) - maxX / 2;
  const y = Math.floor(Math.random() * (maxY + 1)) - maxY / 2;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// Bonus: si insiste mucho, lo ablandamos 😭
let tries = 0;
noBtn.addEventListener("mouseover", () => {
  tries++;
  if (tries === 6) {
    noBtn.textContent = "¿Segura? 🥺";
  }
  if (tries === 10) {
    noBtn.textContent = "Ok… ya 😭";
    noBtn.style.opacity = "0.35";
  }
});
