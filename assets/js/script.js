// Import chức năng từ các SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update  }from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGpcZ6bJoECqwdLonwRZeBMfWC8WLuhAI",
  authDomain: "chat-app-80674.firebaseapp.com",
  databaseURL: "https://chat-app-80674-default-rtdb.firebaseio.com",
  projectId: "chat-app-80674",
  storageBucket: "chat-app-80674.firebasestorage.app",
  messagingSenderId: "827550440639",
  appId: "1:827550440639:web:2f860dc382bcdb15fb7a0a"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();   // hỗ trợ authen
const db = getDatabase(); // hỗ trợ database

import { fullNameValidate, emailValidate, passwordValidate } from "./validate.js";
import showAlert from "./alert.js";

// ẩn, hiện mật khẩu
const passwordShowEvent = (formElement) => {
    const inputPassword = formElement.querySelector('input[name="password"]');
    const passwordShow  = formElement.querySelector(".password-icon");
    if(passwordShow) {
        passwordShow.addEventListener("click", event => {
            // lấy type của thẻ input password
            const type = inputPassword.type;

            if(type === "password") {
                inputPassword.type = "text"; // show password

                passwordShow.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
            }

            else {
                inputPassword.type = "password"; // ẩn password

                passwordShow.innerHTML = '<i class="fa-regular fa-eye"></i>';
            }
        });
    }
}
// hết ẩn, hiện mật khẩu

// form login
const loginFormClass = document.querySelector(".login__form");
if(loginFormClass) {
    passwordShowEvent(loginFormClass);
}
// hết form login

// tính năng đăng ký
const signUpForm = document.querySelector('[sign-up]');
if(signUpForm) {
    signUpForm.addEventListener('submit', event => {
        event.preventDefault();

        const fullName = signUpForm.fullName.value;
        const email    = signUpForm.email.value;
        const password = signUpForm.password.value;

        // validate họ tên
        const isFullNameValid = fullNameValidate(fullName);
        if(isFullNameValid.status === false) {
            showAlert(isFullNameValid.messages, 'warning', 5000);
            return;
        }

        // validate email
        const isEmailValid = emailValidate(email);
        if(isEmailValid.status === false) {
            showAlert(isEmailValid.messages, 'warning', 5000);
            return;
        }

        // validate mật khẩu
        const isPasswordlValid = passwordValidate(password);
        if(isPasswordlValid.status === false) {
            showAlert(isPasswordlValid.messages, 'warning', 5000);
            return;
        }

        // firebase
        if(fullName && email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if(user) {
                        console.log(user);
                        // lưu vào database real time, sử dụng ID của user vừa tạo làm ID
                        set(ref(db, 'users/' + user.uid), {
                            fullName: fullName,
                            avatar: 'https://i.sstatic.net/l60Hf.png' //avatar mặc định
                        })
                            .then(() => {
                                // chyển hướng sang trang chat
                                window.location.href = 'chat.html';
                            })
                    }
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                }); 
        } 
    });
}
// kết tính năng đăng ký

// tính năng đăng nhập
const loginForm = document.querySelector('[login]');
if(loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // validate email
        const isEmailValid = emailValidate(email);
        if(isEmailValid.status === false) {
            showAlert(isEmailValid.messages, 'warning', 5000);
            return;
        }

        // validate mật khẩu
        const isPasswordlValid = passwordValidate(password);
        if(isPasswordlValid.status === false) {
            showAlert(isPasswordlValid.messages, 'warning', 5000);
            return;
        }

        // firebase
        if(email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if(user) {
                        // chuyển hướng đến trang chat
                        window.location.href = 'login.html'
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    });
}
// hết tính năng đăng nhập
