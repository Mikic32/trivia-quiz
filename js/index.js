const submit = document.getElementById("submit");
const topics = document.querySelectorAll(".topic");
const dificultySettings = document.querySelectorAll(".dificulty-seetting");

const quizPreferences = {
  categoriesArr: [],
  difficulty: "",
};

const onSubmit = () => {
  topics.forEach((topic) => {
    //If a topic is checked add it to the array
    topic.classList.contains("topic-checked") &&
      quizPreferences.categoriesArr.push(topic.innerHTML.toLowerCase());
  });

  if (quizPreferences.categoriesArr.length < 1) {
    1 && alert("Please select at least one topic!");
    return;
  }

  //set the active difficulty setting in the object
  quizPreferences.difficulty = document
    .querySelector(".setting-active")
    .lastElementChild.innerHTML.toLowerCase();

  window.localStorage.setItem(
    "quizPreferences",
    JSON.stringify(quizPreferences)
  );
  window.location.assign("./game.html");
};

topics.forEach((topic) => {
  topic.addEventListener("click", function () {
    this.classList.toggle("topic-checked")
  });
});

const settingsReset = () => {
  dificultySettings.forEach((setting) => {
    setting.classList.remove("setting-active");
  });
};

dificultySettings.forEach((setting) => {
  setting.addEventListener("click", function () {
    settingsReset();
    this.classList.add("setting-active");
  });
});

submit.addEventListener("click", onSubmit);
