// Import chức năng từ các SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update, onChildAdded, child, get  }from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js' // hỗ trợ ẩn hiện bảng icon

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
let   currentUser = null;   // lưu user đã đăng nhập
const dbRef = ref(getDatabase()); // tham chiếu đến database
const chatReference = ref(db, 'chats'); // db lưu đoạn chat
const userReference = ref(db, 'users'); // db lưu user

import { fullNameValidate, emailValidate, passwordValidate } from "./validate.js"; // hỗ trợ validate đăng nhập, đăng kí, ...

import showAlert from "./alert.js"; // show thông báo

import clickOutSideEvent from "./clickOutSide.js"; // sự kiện click ra ngoài một element

// hàm log 
const logFeature = (feature, state) => {
    console.log(feature + ':::' + state);
}
// hết hàm log

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

// kiểm tra trạng thái đăng nhập
const loginUser = document.querySelector('[login-user]'); // khối user đã đăng nhập
const chat =  document.querySelector('.chat'); // hộp chat
const needLogin = document.querySelector('.need__login');
onAuthStateChanged(auth, (user) => {
    // nếu user chưa đang nhập thì vào trang đăng nhập
    if(!user) {
        loginUser.style.display = 'none';
        chat.style.display = 'none';
        needLogin.style.display = 'block';
        return;
    }
    // nếu user đã đăng nhập
    currentUser = user;

});
// hết kiểm tra trạng thái đăng nhập

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

        logFeature('Tính năng', 'Đăng nhập');

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
                        console.log(user);
                        // logFeature('Đăng nhập bằng email', 'Thành công');
                        // chuyển hướng đến trang chat
                        window.location.href = 'chat.html'
                    }
                    else 
                        showAlert('Bạn chưa có tài khoản', 'warning', 5000);
                })
                .catch((error) => {
                    showAlert('Đã xảy ra lỗi khi đăng nhập', 'error', 8000);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    logFeature('Mã Lỗi', errorCode);
                });
        }
    });
}
// hết tính năng đăng nhập

// đăng nhập với google
const loginWithGoolge = document.querySelector('[login-with-google]');
if(loginWithGoolge) {
    const provider = new GoogleAuthProvider(); // google provider
    
    loginWithGoolge.addEventListener('click', event => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user);
                // Lưu vào database real time
                set(ref(db, 'users/' + user.uid), {
                    fullName: user.displayName,
                    avatar: user.photoURL //avatar từ google
                })
                    .then(() => {
                        // chyển hướng sang trang chat
                        window.location.href = 'chat.html';
                })
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    });
}
// hết đăng nhập với google

// đăng nhập với facebook (lưu ý khi deploy rồi mới dùng được)
const loginWithFacebook = document.querySelector('[login-with-facebook]');
if(loginWithFacebook) {
    const provider = new FacebookAuthProvider(); // facebook provider

    loginWithFacebook.addEventListener("click", event => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // Lưu vào database realtime
                set(ref(db, 'users/' + user.uid), {
                    fullName: user.displayName,
                    avatar: user.photoURL //avatar từ google
                })
                    .then(() => {
                        // chyển hướng sang trang chat
                        window.location.href = 'chat.html';
                })
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);

                // ...
            });
    });
}
// hết đăng nhập với facebook (lưu ý khi deploy rồi mới dùng được)

// tính năng đăng xuất
const logout = document.querySelector('[logout]');
if(logout) {
    logout.addEventListener('click', event => {
        signOut(auth)
            .then(() => {
                // chuyển hướng
                window.location.href = 'index.html';
            })
            .catch((error) => {
            
            });
    });
}
// hết tính năng đăng xuất

// tính năng quên mật khẩu
const forgotPassword = document.querySelector('[forgot-password]');
if(forgotPassword) {
    forgotPassword.addEventListener("submit", event => {
        event.preventDefault();

        const email = forgotPassword.email.value;

        // validate email
        const isEmailValid = emailValidate(email);
        if(isEmailValid.status === false) {
            showAlert(isEmailValid.messages, 'warning', 5000);
            return;
        }

        const actionCodeSettings = {
            url: `http://127.0.0.1:5500/FrontEnd/chat-app-firebase/login.html`
        }

        if(email) {
            sendPasswordResetEmail(auth, email, actionCodeSettings)
                .then(() => {
                    showAlert('Đã gửi mã OTP qua email', 'success', 5000);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }
    });
}
// hết tính năng quên mật khẩu

// gửi tin nhắn
const sendMessage = document.querySelector('[send-message]');
const emjoiPicker = document.querySelector('emoji-picker');
const tooltip = document.querySelector('.tooltip');
const chatIcon = sendMessage.querySelector("[chat-icon] i");
if(sendMessage) {
    // upload hình ảnh khi chat
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-unique-id', {
        maxFileCount: 6,
        multiple: true
    });
    

    sendMessage.addEventListener('submit', async event => {
        event.preventDefault();


        const userID = auth.currentUser.uid; // id của người chat
        const content = sendMessage.content.value; // nội dung chat
        
        const  images = upload.cachedFileArray || []; // lấy ảnh gửi đi

        
        if(userID && (content|| images.length > 0)) {
            const linkImages = [];

            // nếu có ảnh thì sẽ upload ảnh lên cloudinary
            if(images.length > 0) {
                const CLOUD_NAME = 'dvm1ypggz'; // lấy ở trang chủ dashboard cloudinary
            
                const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    
                const formData = new FormData();
    
                for (let i = 0; i < images.length; i++) {
                    let file = images[i];
                    formData.append('file', file);
    
                    /* 
                        docs_upload_example_us_preset: lấy lên trang chủ
                        lưu ý là khi lấy thì cái mode của key scecret này phải ở dạng unsigned (chưa ký)
                    */
    
                    const docs_upload_example_us_preset = 'smjldtxq';
                    formData.append('upload_preset', docs_upload_example_us_preset);
    
                    await fetch(url, { method: 'POST', body: formData,})
                        .then((response) => response.json())
                        .then((data) => {
                            const link = data.url;
                            linkImages.push(link);
                        });
                }
            }

            const messageID = push(chatReference); // tạo ID cho đoạn chat
            // lưu tin nhắn mới vào firebase
            set(messageID, {
                userID: userID,
                images: linkImages,
                content: content
            });
        }
        // xóa nội dung trong ô chat
        sendMessage.content.value = "";

        // đóng bảng icon
        tooltip.classList.remove('shown');

        // clear các ảnh đã chọn trong ô chat
        upload.resetPreviewPanel();
    });
}
// hết gửi tin nhắn

// chèn icon vào tin nhắn
if(emjoiPicker && sendMessage) {
    emjoiPicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode;

        // nối icon vào đoạn tin nhắn hiện tại
        sendMessage.content.value = sendMessage.content.value + icon;  
        console.log(icon); 
        
    });
}
// hết chèn icon vào tin nhắn

// khi click ra ngoài bảng icon thì đóng bảng icon lại
clickOutSideEvent(chatIcon, () => {
    tooltip.classList.remove('shown');
});
// hết khi click ra ngoài bảng icon thì đóng bảng icon lại

// khi nhấn vào biểu tượng icon thì sẽ show  bảng icon ra
if(sendMessage && emjoiPicker) {
    // phần mình tự viết
    // chatIcon.addEventListener("click", event => {
    //     // lấy trạng thái ra xem đang show hay ẩn bảng icon
    //     const isShow = emjoiPicker.getAttribute("show");

    //     if(isShow === "yes") {
    //         emjoiPicker.setAttribute("show", "");
    //     }

    //     else {
    //         emjoiPicker.setAttribute("show", "yes");
    //     }
    // });


    // dùng tooltip có sẵn
    chatIcon.addEventListener("click", event => {
        tooltip.classList.toggle('shown');
    });

}
// khi nhấn vào biểu tượng icon thì sẽ show  bảng icon ra

// chèn tin nhắn mình gửi đi
const messageOutGoingInsert = (element, props) => {
    element.setAttribute('class', 'chat__outgoing');

    // đoạn html option chat (tức là lựa chọn xóa)
    const htmlsOption = `
        <div class="chat__outgoing-icon" option-chat>
            <i class="fa-solid fa-ellipsis-vertical"></i>
            <ul class="chat__outgoing-option" message-optionList>
                <li message-id="${props.messageID}">
                    <a href="javascript:;">Xóa</a>
                </li>
                <li>
                    <a href="javascript:;">Chuyển tiếp</a>
                </li>
                <li>
                    <a href="javascript:;">Ghim</a>
                </li>
            </ul>
        </div>
    `;

    // đoạn html content chat
    let htmlsContent = '';
    if(props.content) {
        htmlsContent += `
            <div class="chat__outgoing-content">
                ${props.content}
            </div>
        `;
    }

    // đoạn html hình ảnh gửi lên
    let htmlsImages = '';

    if(props.images && props.images.length > 0) {
        htmlsImages += `<div class="images chat__outgoing-images">`
        
        for(const image of props.images) {
            htmlsImages += `<img src="${image}"/>`
        }
        htmlsImages += `</div>`
    }
    
    element.innerHTML = `
        ${htmlsContent}
        ${htmlsImages}
        ${htmlsOption}
    `;

    element.setAttribute('delete-id', props.messageID); // ID của tin nhắn để xóa

    return element
}
// hết chèn tin nhắn mình gửi đi

// chèn tin nhắn người khác gửi đến
const messageInCommingInsert = (element, props) => {
    
    element.setAttribute('class', 'chat__incomming');

    // đoạn html họ tên
    const htmlsFullName = `
        <div class="chat__incomming-userName">
            ${props.fullName}
        </div>
    `;

    // đoạn html option chat (tức là lựa chọn xóa)
    const htmlsOption = `
        <div class="chat__incomming-icon" option-chat>
            <i class="fa-solid fa-ellipsis-vertical"></i>
            <ul class="chat__incomming-option" message-optionList>
                <li message-id=${props.messageID}>
                    <a href="javascript:;">Xóa</a>
                </li>
                <li>
                    <a href="javascript:;">Chuyển tiếp</a>
                </li>
                <li>
                    <a href="javascript:;">Ghim</a>
                </li>
            </ul>
        </div>
    `;

    // đoạn html avatar user
    const htmlsAvatar = `
        <div class="chat__incomming-avatar">
            <img src='https://github.com/cat-milk/Anime-Girls-Holding-Programming-Books/blob/master/PHP/Original_by_Tkimz_Php_Programming_Book.png?raw=true' alt="user">
        </div>
    `;

    // đoạn html content
    let htmlsContent = '';
    if(props.content) {
        htmlsContent += ` 
            <div class="chat__incomming-content">
                ${props.content}
                ${htmlsOption}
            </div>
        `
    }

    // đoạn html hiển thị hình ảnh
    let htmlsImage = '';
    if(props.images && props.images.length > 0 ) {
        htmlsImage += `<div class="chat__incoming-images">`

        for(const image of props.images) {
            htmlsImage += `<img src="${image}"/>`;
        } 

        htmlsImage += `</div>`
    }

    element.innerHTML = `
        ${htmlsAvatar}
        <div class="chat__incomming-main">
            ${htmlsFullName}
            ${htmlsContent}
            ${htmlsImage}
        </div>
    `;

    element.setAttribute('delete-id', props.messageID); // ID của tin nhắn để xóa

    return element;
}
// hết chèn tin nhắn người khác gửi đến

// ẩn hiện chat option và xóa tin nhắn
const chatOptionEvent = (chatBody ,element) => {
    const ButtonChatOption = element.querySelector("[option-chat] i");
    const TableChatOption  = element.querySelector("[message-optionList]");

    const buttonDeleteMessage = TableChatOption.querySelector("[message-id]");

    if(ButtonChatOption) {
        // mở bảng option
        ButtonChatOption.addEventListener("click", event => {
            const isShow = TableChatOption.getAttribute("message-optionList");
            
            if(isShow === "yes") 
                TableChatOption.setAttribute("message-optionList", "");
    
            else 
                TableChatOption.setAttribute("message-optionList", "yes");
        });
        
        // xóa cứng tin nhắn
        buttonDeleteMessage.addEventListener('click', event => {
            // hiển thị modal
            Swal.fire({
                title: "Bạn có chắc muốn xóa",
                input: "Sau khi xóa sẽ không khôi phục lại được",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6", // màu nút xác nhận
                cancelButtonColor: "#d33", // màu nút từ chối
                confirmButtonText: "Vẫn xóa!",
                cancelButtonText: "Không xóa"
            }).then((result) => {
                if (result.isConfirmed) {
                    const messageID = buttonDeleteMessage.getAttribute("message-id"); // lấy id của tin nhắn

                    remove(ref(db, 'chats/' + messageID))
                        .then(() => {
                            // gỡ tin nhắn khỏi giao diện
                            chatBody.removeChild(element);
                            
                            // show alert thông báo
                            showAlert("Xóa tin nhắn thành công", 'success', 5000);
                        });
                }
            });
        });

        // đóng bảng table option chat lại nếu click ra ngoài
        clickOutSideEvent(ButtonChatOption, () => {
            TableChatOption.setAttribute("message-optionList", "");
        });
    }
}
// hết ẩn hiện chat option và xóa tin nhắn

// vẽ tin nhắn ra giao diện: https://firebase.google.com/docs/database/web/lists-of-data (sử dụng onChildAdd để cập nhật những thay đổi)
const chatBody = document.querySelector('.chat__body');
if(chatBody) {

    // chỉ cập nhật những gì mới có trong database
    onChildAdded(chatReference, (data) => {
        const myID = currentUser.uid; // lấy ID của mình

        // object chứa thông tin của tin nhắn (message)
        let messsageObject = {
            messageID: data.key, // ID của tin nhắn
            userID: data.val().userID, // ID của chủ tin nhắn
            content: data.val().content, // nội dung tin nhắn
            images: data.val().images,
        }
        
        // lấy tên của người gửi tin nhắn
        get(child(dbRef, `users/` + messsageObject.userID)).then(user => {
                if(user.exists()) {
                    messsageObject.fullName = user.val().fullName;
                    messsageObject.avatar   = user.val().avatar;

                    // thẻ div bọc tin nhắn
                    let divChat = document.createElement('div');

                    // nếu là tin nhắn của mình gửi
                    if(messsageObject.userID === myID) {
                        divChat = messageOutGoingInsert(divChat, messsageObject);
                    }

                    // nếu là tin nhắn người khác gửi
                    else {
                        divChat = messageInCommingInsert(divChat, messsageObject);
                    }

                    // đưa vào giao diện chat
                    chatBody.appendChild(divChat);

                    chatOptionEvent(chatBody, divChat); // ẩn hiện chat option và xóa tin nhắn

                    // scroll màn hình khi tin nhắn tràn (lưu ý khi append thì mới srcoll xuống)
                    chatBody.scrollTop = chatBody.scrollHeight;
                    // hết scroll màn hình khi tin nhắn tràn

                    // ViewerJs - Zoom hình ảnh. Lưu ý vì mỗi tin nhắn có ảnh cứ có mới load lên nên nếu để bên ngoài sẽ đọc không được nho
                    const gallery = new Viewer(divChat);
                    
                    // Hết ViewerJs - Zoom hình ảnh

                }
            });

    });
}
// hết vẽ tin nhắn ra giao diên
