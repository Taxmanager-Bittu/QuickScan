// QR Code Type Selection
document.addEventListener("DOMContentLoaded", function() {
    // Element Input 
    const qrList = document.querySelectorAll("#qrTypeList li");
    const hiddenInputType = document.getElementById("selectedQrType");
    const hiddenInputRoute = document.getElementById("selectedRouteName");
    const nextBtn = document.getElementById("nextBtn");

    // QR Code Type Click Event
    qrList.forEach(li => {
        li.addEventListener("click", function() {
            // active class handle
            qrList.forEach(el => el.classList.remove("active"));
            this.classList.add("active");

            // values set
            hiddenInputType.value = this.getAttribute("data-type");
            hiddenInputRoute.value = this.getAttribute("data-route");

            // enable button
            nextBtn.removeAttribute("disabled");
            console.log("✅ Selected:", hiddenInputType.value, "| Route:", hiddenInputRoute.value);
        });
    });
});


// Messages Notification
$(document).ready(function() {
    document.querySelectorAll(".errormessages").forEach(msg => {
        const hasMessage = msg.querySelector('.errormsg') || msg.querySelector('.succesmsg');
        if (!hasMessage) return;

        const closeButton = msg.querySelector('.close');
        const progressBar = document.createElement('div');
        progressBar.className = 'reverse-progress-bar';
        msg.appendChild(progressBar);

        setTimeout(() => progressBar.style.width = "0%", 100);
        setTimeout(() => msg.classList.add("show"), 100);
        setTimeout(() => {
            msg.classList.remove("show");
            msg.classList.add("hide");
            setTimeout(() => msg.remove(), 500);
        }, 10000);

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                msg.classList.remove("show");
                msg.classList.add("hide");
                setTimeout(() => msg.remove(), 500);
            });
        }
    });
});