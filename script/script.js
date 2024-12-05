document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("current-year");
    yearSpan.textContent = new Date().getFullYear();
    
    const form = document.getElementById("mc-embedded-subscribe-form");
    const errorResponse = document.getElementById("mce-error-response");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const queryString = new URLSearchParams(formData).toString();
        const url = form.action + "&" + queryString;

        // Add custom JSONP callback function name
        const callbackName = "mcCallback";
        const script = document.createElement("script");
        script.src = url.replace("&c=?", `&c=${callbackName}`);
        script.onload = function () {
            script.remove();
        };

        // Define the JSONP callback function
        window[callbackName] = function (response) {
            console.log("Mailchimp Response:", response); 

            if (response.result === "success") {
                form.style.display = "none";
                const successMessage = document.createElement("div");
                successMessage.id = "custom-success-message";
                successMessage.innerHTML = "<p>Thank you for subscribing! Look out for news and updates.</p>";
                form.parentNode.appendChild(successMessage);
            } else {
                errorResponse.textContent = response.msg || "An error occurred. Please try again.";
                errorResponse.style.display = "block";
            }

            delete window[callbackName];
        };

        document.body.appendChild(script); 
    });
});
