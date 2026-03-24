import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpfbedHJHJ8LVlcfFPVKpO79t7AKcyn6w",
  authDomain: "login-exp-349c5.firebaseapp.com",
  projectId: "login-exp-349c5",
  storageBucket: "login-exp-349c5.firebasestorage.app",
  messagingSenderId: "466989922573",
  appId: "1:466989922573:web:1122a2ca971f92b8465844"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user;   // ✅ define user

      alert("Logged in..");
      console.log(user);

      if (user.email === "admin@gmail.com") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }

    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
});