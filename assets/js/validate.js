/**
 *  Hỗ trợ các validate đăng ký, đăng nhập, ... 
*/
const IS_VALID = 0;

// validate họ tên
export const fullNameValidate = (fullName) => {
    const EMPTY = 1;
    const HAVE_DIGIT_SPECIAL_CHAR = 2;

    const errorLogs = [
        {status: true,  messages: 'Họ Tên hợp lệ'},
        {status: false, messages: 'Họ Tên không được bỏ trống'},
        {status: false, messages: 'Họ Tên không được chứa số, và kí tự đặc biệt'},
    ];

    if(fullName === "") return errorLogs[EMPTY];

    const regex = /[^a-zA-Z\s]/;
    if(regex.test(fullName)) return errorLogs[HAVE_DIGIT_SPECIAL_CHAR];

    return errorLogs[IS_VALID]; // họ tên hợp lệ
}

// validate email
export const emailValidate = (email) => {
    const EMPTY = 1;
    const IS_NOT_VALID = 2;

    const errorLogs = [
        {status: true,  messages: 'Email hợp lệ'},
        {status: false, messages: 'Email không được bỏ trống'},
        {status: false, messages: 'Email không hợp lệ'},
    ];

    if(email === "") return errorLogs[EMPTY];

    const regex = /([\w\.]+@\w+(\.\w+)+)/g;
    if(!regex.test(email)) return errorLogs[IS_NOT_VALID];

    return errorLogs[IS_VALID]; // email hợp lệ
}

// validate password
export const passwordValidate = (password) => {
    const EMPTY = 1;
    const IS_LACK_LENGTH = 2;
    const AT_LEAST_ONE_SPECIAL_CHAR = 3;
    const NO_WHITE_SPACE = 4;

    const errorLogs = [
        {status: true,  messages: 'Password hợp lệ'},
        {status: false, messages: 'Password không được bỏ trống'},
        {status: false, messages: 'Password ít nhất 8 kí tự'},
        {status: false, messages: 'Password phải chứa ít nhất 1 kí tự đặc biệt'},
        {status: false, messages: 'Password không được chứa khoảng trắng'},
    ];

    if(password === "") return errorLogs[EMPTY];

    if(password.length < 8) return errorLogs[IS_LACK_LENGTH];

    const regexSpecialChar = /[\@\$\!\%\*\?\&\w]/;
    if(!regexSpecialChar.test(password)) return errorLogs[AT_LEAST_ONE_SPECIAL_CHAR];

    const regexWhiteSpace = /\s/;
    if(regexWhiteSpace.test(password)) return errorLogs[NO_WHITE_SPACE];

    return errorLogs[IS_VALID]; // mật khẩu hợp lệ
}