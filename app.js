const STORAGE_KEY = "class_emotions";
let emotions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const panel = document.getElementById("emojiPanel");
const statsEl = document.getElementById("stats");
const logEl = document.getElementById("log");
const chartEl = document.getElementById("chart");
const calendarEl = document.getElementById("calendar");

const toggleBtn = document.getElementById("toggleRole");
const studentPanel = document.getElementById("studentPanel");
const teacherPanel = document.getElementById("teacherPanel");

// 🔑 пароль для входа
const TEACHER_PASSWORD = "1234"; // можно поменять

let role = "student"; // по умолчанию ученик

// ученик отправляет эмоцию
panel.querySelectorAll(".emoji").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const entry = {emoji: btn.textContent, time: new Date().toISOString()};
    emotions.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
    if(role==="teacher") renderFiltered();
  });
});

// переключение ролей с паролем
toggleBtn.addEventListener("click",()=>{
  if(role==="student"){
    const pass = prompt("Введите пароль учителя:");
    if(pass===TEACHER_PASSWORD){
      role = "teacher";
      studentPanel.style.display = "none";
      teacherPanel.style.display = "block";
      toggleBtn.textContent = "Выйти из режима учителя";
    } else {
      alert("Неверный пароль!");
    }
  } else {
    role = "student";
    studentPanel.style.display = "block";
    teacherPanel.style.display = "none";
    toggleBtn.textContent = "Войти как учитель";
  }
});

// фильтрация по календарю
calendarEl.addEventListener("change", renderFiltered);

function renderFiltered(){
  const date = calendarEl.value; // формат YYYY-MM-DD
  const filtered = emotions.filter(e=> e.time.startsWith(date));
  renderStats(filtered);
  renderChart(filtered);
  renderLog(filtered);
}

function renderStats(filtered){
  statsEl.innerHTML = "";
  const counts = {};
  filtered.forEach(e=> counts[e.emoji] = (counts[e.emoji]||0)+1 );
  statsEl.innerHTML = Object.entries(counts)
    .map(([emo,c])=> `<span style="font-size:1.5rem">${emo}</span> — ${c}`)
    .join("<br>");
}

function renderLog(filtered){
  logEl.innerHTML = filtered.slice(-10).reverse()
    .map(e=> `<li>${new Date(e.time).toLocaleString("ru-RU")} — ${e.emoji}</li>`)
    .join("");
}

function renderChart(filtered){
  const ctx = chartEl.getContext("2d");
  ctx.clearRect(0,0,chartEl.width,chartEl.height);
  const w = chartEl.width, h = chartEl.height;
  if(filtered.length===0){
    ctx.fillText("Нет данных",10,20);
    return;
  }
  const counts = {};
  filtered.forEach(e=> counts[e.emoji] = (counts[e.emoji]||0)+1 );
  const unique = Object.keys(counts);
  const colors = ["#4da3ff","#ff6b6b","#69d694","#ffb86b","#9b59b6","#f1c40f","#34495e"];
  const max = Math.max(...Object.values(counts));
  const barW = (w-40)/unique.length;
  unique.forEach((emo,i)=>{
    const barH = (counts[emo]/max)*(h-40);
    ctx.fillStyle = colors[i%colors.length];
    ctx.fillRect(20+i*barW, h-barH-20, barW-10, barH);
    ctx.fillStyle = "#000";
    ctx.fillText(emo, 20+i*barW, h-5);
  });
}
panel.querySelectorAll(".emoji").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const entry = {
      emoji: btn.textContent.trim().split("\n")[0], // сам смайл
      label: btn.dataset.label,                     // подпись
      time: new Date().toISOString()
    };
    emotions.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
    if(role==="teacher") renderFiltered();
  });
});

function renderStats(filtered){
  statsEl.innerHTML = "";
  const counts = {};
  filtered.forEach(e=>{
    const key = e.label || e.emoji;
    counts[key] = (counts[key]||0)+1;
  });
  statsEl.innerHTML = Object.entries(counts)
    .map(([label,c])=> `<span style="font-size:1.2rem">${label}</span> — ${c}`)
    .join("<br>");
}

function renderLog(filtered){
  logEl.innerHTML = filtered.slice(-10).reverse()
    .map(e=> `<li>${new Date(e.time).toLocaleString("ru-RU")} — ${e.emoji} (${e.label})</li>`)
    .join("");
}
