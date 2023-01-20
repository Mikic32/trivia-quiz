const questionContainer = document.querySelector(".question-container");
const answersContainer = document.querySelector(".solutions-container");
const answerElements = document.querySelectorAll(".answer");
const preferences = JSON.parse(window.localStorage.getItem("quizPreferences"));
const background = document.querySelector("main");
const timer = document.getElementById("timer");
const quizCard = document.querySelector('.card')
const scoreCard = document.querySelector('.score-card');
const overallScore = document.getElementById('overall');
const confirmBtn = document.getElementById('confirm');

let currQuestionIndex = 0;
let questions;
let correctAnswers = 0

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "white",
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 15;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

const TIMER_TEMPLATE = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

confirmBtn.addEventListener('click', () => window.location.assign('./categories.html'))

const setCssProperty = (key, value) => {
  document.documentElement.style.setProperty(key, value);
};

const setTheme = (topic) => {
  let accentColor = "";
  let backgroundUrl = "";

  switch (topic) {
    case "Music":
      accentColor = "230, 73, 128";
      backgroundUrl = "url('../assets/music_big.jpg')";
      break;

    case "History":
      accentColor = "252, 196, 25";
      backgroundUrl = "url('../assets/history_big.jpg')";
      break;

    case "Geography":
      accentColor = "130, 201, 30";
      backgroundUrl = "url('../assets/geography_big.jpg')";
      break;

    case "Science":
      accentColor = "51, 154, 240";
      backgroundUrl = "url('../assets/science_big.jpg')";
  }

  setCssProperty("--accent-color", `rgba(${accentColor}, 1)`);
  setCssProperty("--question-shadow", `rgba(${accentColor}, 0.2)`);
  setCssProperty("--answer-shadow", `rgba(${accentColor}, 0.05)`);
  setCssProperty("--answer-hover-shadow", `rgba(${accentColor}, 0.5)`);
  setCssProperty("--answer-active-shadow", `rgba(${accentColor}, 1)`);
  document.body.style.backgroundImage = backgroundUrl;
};

const onQuizEnd = () => {
  quizCard.classList.add('d-none');
  scoreCard.classList.remove('d-none')
  overallScore.innerHTML = `${correctAnswers}/5`
}

const resetCorrect = () => {
  answerElements.forEach((answer) => {
    answer.classList.remove("correct", "incorrect");
  });
};

const isCorrect = (answerElem) => {
  return answerElem.innerHTML === questions[currQuestionIndex].correctAnswer;
};

const onCorrect = (element) => {
  clearInterval(timerInterval);
  element.classList.add("correct");
  correctAnswers++
  nextQuestion();
};

const onIncorrect = (element) => {
  clearInterval(timerInterval);
  element.classList.add("incorrect");
  answerElements.forEach((answer) => {
    isCorrect(answer) && answer.classList.add("correct");
  });
  nextQuestion();
};

const loadQuestion = (question) => {
  if(currQuestionIndex > 4) {
    onQuizEnd();
    return
  }
   

  resetCorrect();
  setTheme(question.category);
  questionContainer.innerHTML = `<h1 id="question">${question.question}</h1>`;
  let answers = [...question.incorrectAnswers];
  //Insert the correct answer in a random spot in the answer array
  answers.splice(Math.floor(Math.random() * 4), 0, question.correctAnswer);

  for (let i = 0; i < answers.length; i++)
    answerElements[i].innerHTML = answers[i];
};

const nextQuestion = () => {
  window.setTimeout(() => {
    loadQuestion(questions[++currQuestionIndex]);
    resetTimer();
  }, 2000);
};

const startQuiz = async function (params) {
  const res = await fetch(
    `https://the-trivia-api.com/api/questions?categories=${params.categoriesArr.toString()}&limit=5&difficulty=${
      params.difficulty
    }`
  );
  questions = await res.json();
  loadQuestion(questions[currQuestionIndex]);

  answerElements.forEach((answer) => {
    answer.addEventListener("click", function () {
      isCorrect(this) ? onCorrect(this) : onIncorrect(this);
    });
  });
};

const resetTimer = () => {
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  clearInterval(timerInterval);
  timerInterval = null;
  timer.innerHTML = "";
  startTimer();
};

const onTimesUp = () => {
  clearInterval(timerInterval);
  nextQuestion();
};

const startTimer = () => {
  timer.innerHTML = TIMER_TEMPLATE;
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
};

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

const setRemainingPathColor = (timeLeft) => {
  const { alert } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  }
};

const calculateTimeFraction = () => {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
};

const setCircleDasharray = () => {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
};

startQuiz(preferences);
startTimer();
