const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnRFZz9wBOMFVxtXOHn3_W2UXxfGjj7Z9OHKFANf_IlXZt0wiWUKuCugJYIvAeHQWkzg/exec";
const weddingDate = new Date('2026-07-23T15:00:00+03:00');

function tick(){
  const now = new Date();
  let diff = weddingDate - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  document.getElementById('days').textContent = d;
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}

tick();
setInterval(tick, 1000);

const bar = document.getElementById('progressBar');

function updateProgress() {
  if (!bar) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;

  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("load", updateProgress);

updateProgress();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.25});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const form = document.getElementById("rsvpForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button");
    const result = document.getElementById("result");

    btn.disabled = true;
    btn.textContent = "Отправка...";

    try {
      const data = new FormData(form);

      await fetch(WEB_APP_URL, {
        method: "POST",
        body: data
      });

      result.textContent = "Спасибо! Ваш ответ получен ❤️";
      form.reset();

    } catch (err) {
      result.textContent = "Ошибка отправки";
    }

    btn.disabled = false;
    btn.textContent = "Подтвердить";
  });
}
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");

function updateMusicButton() {
    if (!musicBtn) return;
    musicBtn.innerHTML = music.paused ? "♪" : "❚❚";
}

function playMusic() {
    if (!music) return;

    music.play()
        .then(() => {
            updateMusicButton();
        })
        .catch(() => {
            // Автозапуск заблокирован браузером
        });
}

// Автозапуск после загрузки
window.addEventListener("load", () => {
    playMusic();
});

// Если браузер запретил — включится после первого касания
["click", "touchstart", "pointerdown"].forEach(event => {
    document.addEventListener(event, function firstTouch() {
        playMusic();
        document.removeEventListener(event, firstTouch);
    }, { once: true });
});

// Кнопка музыка
if (musicBtn) {
    musicBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
        updateMusicButton();
    });
}

// Если музыка закончилась
music.addEventListener("ended", updateMusicButton);

// При запуске
music.addEventListener("play", updateMusicButton);

// При паузе
music.addEventListener("pause", updateMusicButton);
