let score = localStorage.getItem("score") || 0;

function jawab(btn, benar) {
  if (benar) {
    score++;
    localStorage.setItem("score", score);
    alert("BENAR 🔥");
  } else {
    alert("SALAH ❌");
  }
  tampilBadge();
}

function tampilBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;

  if (score >= 5) badge.innerText = "🏆 Cyber Rookie";
  if (score >= 10) badge.innerText = "⚡ Cyber Hacker";
}
