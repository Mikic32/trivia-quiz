const questionContainer = document.querySelector(".question-container");
const answersContainer = document.querySelector(".solutions-container");
const answerElements = document.querySelectorAll(".answer");
const preferences = JSON.parse(window.localStorage.getItem("quizPreferences"));
const background = document.querySelector("main");

let currQuestionIndex = 0;
let questions;

const MUSIC_COLOR = "#e64980"
const HISTORY_COLOR = "#fcc419"
const GEOGRAPHY_COLOR = "#82c91e"
const SCIENCE_COLOR = "#339af0"

const setTheme = (topic) => {
  let accentColor = ""
  let backgroundUrl = ""
  switch (topic) {
    case "Music":
      accentColor = "230, 73, 128";
      backgroundUrl = "url('../assets/music_big.jpg')"
      break;
    case "History":
      accentColor = "252, 196, 25";
      backgroundUrl = "url('../assets/history_big.jpg')"
      break;
    case "Geography":
      accentColor = "130, 201, 30";
      backgroundUrl = "url('../assets/geography_big.jpg')"
      break;
    case "Science":
      accentColor = "51, 154, 240";
      backgroundUrl = "url('../assets/science_big.jpg')"
  }
  document.documentElement.style.setProperty('--accent-color',`rgba(${accentColor}, 1)`)
  document.documentElement.style.setProperty('--question-shadow',`rgba(${accentColor}, 0.2)`)
  document.documentElement.style.setProperty('--answer-shadow',`rgba(${accentColor}, 0.05)`)
  document.documentElement.style.setProperty('--answer-hover-shadow',`rgba(${accentColor}, 0.5)`)
  document.documentElement.style.setProperty('--answer-active-shadow',`rgba(${accentColor}, 1)`)
  document.body.style.backgroundImage = backgroundUrl;

  

}

const onCorrect = () => {
  alert("Congratulations, correct answer!");
  loadQuestion(questions[++currQuestionIndex]);
};

onIncorrect = () => {
  alert("Sorry, wrong answer.");
  loadQuestion(questions[++currQuestionIndex]);
};

const loadQuestion = (question) => {
  if(currQuestionIndex > 4) {
    window.location.assign('./categories.html')
  }

  questionContainer.innerHTML = `<h1 id="question">${question.question}</h1>`;
  let answers = [...question.incorrectAnswers];
  //Insert the correct answer in a random spot in the answer array
  answers.splice(Math.floor(Math.random() * 4), 0, question.correctAnswer);
  for (let i = 0; i < answers.length; i++)
    answerElements[i].innerHTML = answers[i];

    setTheme(question.category)
    console.log(question)
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
      this.innerHTML === questions[currQuestionIndex].correctAnswer
        ? onCorrect()
        : onIncorrect();
    });
  });
};

startQuiz(preferences);
