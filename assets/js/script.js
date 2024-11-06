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
const loginForm = document.querySelector(".login__form");
if(loginForm) {
    passwordShowEvent(loginForm);
}
// hết form login