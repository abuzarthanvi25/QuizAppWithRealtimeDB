// // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCED3kn9IzB1b74H7nkB2pNzkbO6O16Xc",
  authDomain: "quizapp-22f76.firebaseapp.com",
  databaseURL: "https://quizapp-22f76-default-rtdb.firebaseio.com",
  projectId: "quizapp-22f76",
  storageBucket: "quizapp-22f76.appspot.com",
  messagingSenderId: "954017208409",
  appId: "1:954017208409:web:ba6d3ba11bb1b1c4e3b948",
  measurementId: "G-CSEMHSNMD4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
var db = getDatabase();
const auth = getAuth();

window.goToQuiz = function () {
  window.location.href = "../pages/quiz.html";
};

window.goTosignIn = function () {
  window.location.href = "../pages/signIn.html";
};

window.signIn = function () {
  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");
  var userPassword = document.getElementById("userPassword");

  var userObj = {
    userName: userName.value,
    userEmail: userEmail.value,
    userPassword: userPassword.value,
  };
  userName.value = "";
  userEmail.value = "";
  userPassword.value = "";

  signInWithEmailAndPassword(auth, userObj.userEmail, userObj.userPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert(`The Admin ${userObj.userName} is now signed in`);
      window.location.href = "../pages/adminPanel.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage, errorCode);
    });
};

window.logout = function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      alert(error);
    });
};

function renderQuestions() {
  var parent = document.getElementById("parent");
  parent.innerHTML = "";
  for (var i = 0; i < questions.length; i++) {
    parent.innerHTML += `<div class="container">
    <div class="row">
      <div class="offset-md-3 col-md-6">
        <div class="bg-light my-3 p-3 rounded shadow">
          <p class = 'fs-5'><strong class ='text-primary'>Question no. </strong> ${questions[i].numb} </p>
          <p class = 'fs-5'><strong>Question : </strong> ${questions[i].question} </p>
          <p class = 'fs-5'><strong>Options : </strong> ${questions[i].option} </p>
          <p class = 'fs-5'><strong>Answer : </strong> ${questions[i].correctOption} </p>
        </div>
      </div>
    </div>
  </div>`;
  }
  // console.log("In render Function");
  // console.log(questions.length);
}

var questions = [];
function getQuestions() {
  var reference = ref(db, "questions/");
  var showQuestions = [];

  onValue(reference, function (data) {
    showQuestions = Object.values(data.val());
    questions.length = 0;
    for (var i = 0; i < showQuestions.length; i++) {
      showQuestions[i].numb = i + 1;
      questions.push(showQuestions[i]);
    }
    renderQuestions();
  });
}

window.addQuestions = function () {
  var newQuestion = document.getElementById("newQuestion");
  var newOption1 = document.getElementById("newOption1");
  var newOption2 = document.getElementById("newOption2");
  var newOption3 = document.getElementById("newOption3");
  var newOption4 = document.getElementById("newOption4");
  var newCorrectAnswer = document.getElementById("newCorrectAnswer");
  var option = [];
  var flag = false;

  if (newOption1.value !== "") {
    option.push(newOption1.value);
  }

  if (newOption2.value !== "") {
    option.push(newOption2.value);
  }

  if (newOption3.value !== "") {
    option.push(newOption3.value);
  }

  if (newOption4.value !== "") {
    option.push(newOption4.value);
  }

  for (var i = 0; i < option.length; i++) {
    if (option[i] == newCorrectAnswer.value) {
      flag = true;
    }
  }

  var questionObj = {
    question: newQuestion.value,
    option,
    correctOption: newCorrectAnswer.value,
  };

  if (newQuestion.value == "" || newCorrectAnswer.value == "") {
    alert("Fields Cannot be empty");
  } else {
    if (flag == true) {
      var reference = ref(db, "questions/");
      var newRef = push(reference);
      questionObj.id = newRef.key;
      set(newRef, questionObj);
      newQuestion.value = "";
      newOption1.value = "";
      newOption2.value = "";
      newOption3.value = "";
      newOption4.value = "";
      newCorrectAnswer.value = "";
      console.log(questions);
      getQuestions();
    } else {
      alert("Answer Must match one of the options");
    }
  }
};
getQuestions();
