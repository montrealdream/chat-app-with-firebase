/**
 * Bắt sự kiện click ra ngoài element
*/

// khi click ra ngoài thì sẽ đóng một số tab nhỏ đang mở
const clickOutSideEvent = (element, callback) => {
    document.addEventListener("click", event => {
        if(event.target !== element) {
            callback();
        }
    });
}
// hết khi click ra ngoài thì sẽ đóng một số tab nhỏ đang mở

export default clickOutSideEvent;