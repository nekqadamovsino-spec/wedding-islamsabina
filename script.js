const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxjRIsiUPrfMavhKB55ItGLITBdYaaaZ83hWVW4ncznM43w6V4jf_FoofOiB6ZYTgdY9Q/exec";
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
const soundBtn = document.getElementById("soundBtn");
const music = document.getElementById("weddingMusic");

if (soundBtn && music) {
  soundBtn.onclick = async function () {
    try {
      if (music.paused) {
        await music.play();
        soundBtn.textContent = "Ⅱ";
      } else {
        music.pause();
        soundBtn.textContent = "♪";
      }
    } catch (err) {
      alert("Музыка не запустилась");
      console.log(err);
    }
  };
}
