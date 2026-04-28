const dataSets = {
  ranks: [
    { name: "Рядовой", img: "img/0.jpg" },
    { name: "Ефрейтор", img: "img/1.jpg" },
    { name: "Младший сержант", img: "img/2.jpg" },
    { name: "Сержант", img: "img/3.jpg" },
    { name: "Старший сержант", img: "img/4.jpg" },
    { name: "Старшина", img: "img/5.jpg" },
    { name: "Прапорщик", img: "img/6.jpg" },
    { name: "Старший прапорщик", img: "img/7.jpg" },
    { name: "Младший лейтенант", img: "img/8.jpg" },
    { name: "Лейтенант", img: "img/9.jpg" },
    { name: "Старший лейтенант", img: "img/10.jpg" },
    { name: "Капитан", img: "img/11.jpg" },
    { name: "Майор", img: "img/12.jpg" },
    { name: "Подполковник", img: "img/13.jpg" },
    { name: "Полковник", img: "img/14.jpg" },
    { name: "Генерал майор", img: "img/15.jpg" },
    { name: "Генерал лейтенант", img: "img/16.jpg" },
    { name: "Генерал полковник", img: "img/17.jpg" },
    { name: "Генерал армии", img: "img/18.jpg" },
    { name: "Маршал", img: "img/19.jpg" },
  ],
  emblems: [
    { name: "ВДВ", img: "img/voiska/10.png" },
    { name: "ВКС", img: "img/voiska/11.png" },
    { name: "РХБЗ", img: "img/voiska/2.png" },
    { name: "РВСН", img: "img/voiska/9.png" },
    { name: "Войска связи", img: "img/voiska/3.png" },
    { name: "Росгвардия", img: "img/voiska/4.png" },
    { name: "Сухопутные войска", img: "img/voiska/13.png" },
    { name: "Морская пехота", img: "img/voiska/12.png" },
    { name: "Инженерные войска", img: "img/voiska/8.png" },
    { name: "Пограничные войска", img: "img/voiska/1.png" },
    { name: "Медицинская служба", img: "img/voiska/7.png" },
    { name: "Юридическая служба", img: "img/voiska/6.png" },
    { name: "Трубопроводные войска", img: "img/voiska/5.png" },
  ],
};

let currentCategory = "ranks";
let currentMode = "train";
let currentIndex = 0;
let score = 0;
let examList = [];
let isFirstAttempt = true;
let isGameActive = false;
let timerInterval;
let seconds = 0;

// DOM элементы
const startZone = document.getElementById("start-zone");
const gameZone = document.getElementById("game-zone");
const input = document.getElementById("answer-input");
const feedback = document.getElementById("feedback");
const stats = document.getElementById("stats");
const imgDisplay = document.getElementById("pogon-display");
const timerDisplay = document.getElementById("timer");
const contactLink = document.getElementById("contact-link");

function normalize(text) {
  let lowText = text.toLowerCase().trim();
  const replacements = {
    "мл": "младший",
    "ст": "старший",
    "ген": "генерал",
  };
  let words = lowText.split(/\s+/);
  let processedWords = words.map(word => replacements[word] || word);
  lowText = processedWords.join("");

  return lowText.replace(/[^а-яё0-9]/g, "");
}

function setCategory(cat) {
  currentCategory = cat;
  document
    .getElementById("cat-ranks")
    .classList.toggle("active", cat === "ranks");
  document
    .getElementById("cat-emblems")
    .classList.toggle("active", cat === "emblems");
  resetToStart();
}

function setMode(mode) {
  currentMode = mode;
  document
    .getElementById("trainMode")
    .classList.toggle("active", mode === "train");
  document
    .getElementById("examMode")
    .classList.toggle("active", mode === "exam");
  resetToStart();
}

function resetToStart() {
  isGameActive = false;
  clearInterval(timerInterval);
  timerDisplay.innerText = "00:00";
  startZone.classList.remove("hidden");
  gameZone.classList.add("hidden");
  feedback.innerText = "";
  startZone.innerHTML = `
        <button class="submit-btn start-screen-btn" onclick="startGame()">Начать тест</button>
        <p id="enterHint" style="color: var(--mid-light); font-size: 12px; margin-top: 10px; text-align: center">(или нажмите Enter)</p>
    `;
}

function startGame() {
  isGameActive = true;
  score = 0;
  currentIndex = 0;
  startZone.classList.add("hidden");
  gameZone.classList.remove("hidden");
  input.value = "";
  feedback.innerText = "";

  const currentData = dataSets[currentCategory];
  if (currentMode === "exam") {
    examList = [...currentData].sort(() => Math.random() - 0.5);
  } else {
    examList = [...currentData];
  }

  updateCard();
  startTimer();
  setTimeout(() => input.focus(), 100);
}

function updateCard() {
  if (currentIndex < examList.length) {
    imgDisplay.src = examList[currentIndex].img;
    stats.innerText = `${currentCategory === "ranks" ? "Звание" : "Войска"} ${currentIndex + 1} из ${examList.length}`;
    isFirstAttempt = true;
  } else {
    finishGame();
  }
}

function checkAnswer() {
  const userAns = normalize(input.value);
  const correctAns = normalize(examList[currentIndex].name);

  if (userAns === correctAns) {
    if (isFirstAttempt) score++;
    feedback.style.color = "#159A9C";
    feedback.innerText = "Правильно!";
    setTimeout(nextQuestion, 300);
  } else {
    feedback.style.color = "#d9534f";
    isFirstAttempt = false;
    if (currentMode === "train") {
      feedback.innerText = "Неверно, попробуй еще раз";
      input.value = "";
    } else {
      feedback.innerText = "Ошибка";
      setTimeout(nextQuestion, 600);
    }
  }
}

function nextQuestion() {
  currentIndex++;
  input.value = "";
  feedback.innerText = "";
  updateCard();
  input.focus();
}

function finishGame() {
  isGameActive = false;
  clearInterval(timerInterval);
  gameZone.classList.add("hidden");
  startZone.classList.remove("hidden");

  startZone.innerHTML = `
        <div style="margin-bottom: 25px;">
            <h2 style="color: var(--accent); letter-spacing: 2px;">ОТЧЁТ</h2>
            <p>ТОЧНОСТЬ: ${score} / ${examList.length}</p>
            <p>ВРЕМЯ: ${timerDisplay.innerText}</p>
        </div>
        <button class="submit-btn" onclick="startGame()">ПОВТОРИТЬ</button>
        <button class="btn-mode" style="width:100%; margin-top: 10px;" onclick="showHints();">БАЗА ЗНАНИЙ</button>
    `;
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    timerDisplay.innerText = `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  }, 1000);
}

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") isGameActive ? checkAnswer() : startGame();
});

function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}

function selectCategoryMenu(cat) {
  setCategory(cat);
  closeHints();
  toggleMenu();
}

function showHints() {
isGameActive = false;
clearInterval(timerInterval);
  const main = document.getElementById("main-container");
  const hints = document.getElementById("hints-container");
  const content = document.getElementById("hints-content");

  timerDisplay.classList.add("hidden");

  contactLink.classList.add("hidden");

  content.innerHTML = "";
  for (const [key, items] of Object.entries(dataSets)) {
    const title = document.createElement("div");
    title.innerHTML = `<h3 style="color:var(--light); margin: 20px 0 10px 0; font-size: 20px; text-align: center;">${key === "ranks" ? "ПОГОНЫ" : "ЭМБЛЕМЫ"}</h3>`;
    content.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "hint-grid";
    items.forEach((item) => {
      grid.innerHTML += `<div class="hint-card"><img src="${item.img}"><div style="font-size: 20px; margin-top:5px; ">${item.name}</div></div>`;
    });
    content.appendChild(grid);
  }

  main.classList.add("hidden");
  hints.classList.remove("hidden");
  if (document.getElementById("side-menu").classList.contains("active"))
    toggleMenu();
}

function closeHints() {

  document.getElementById("hints-container").classList.add("hidden");
  document.getElementById("main-container").classList.remove("hidden");
  timerDisplay.classList.remove("hidden");
  contactLink.classList.remove("hidden");
resetToStart();
}

resetToStart();
