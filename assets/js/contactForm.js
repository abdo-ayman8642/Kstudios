"use strict";

let iti;
const BASE_URL = 'https://api.kstudios.co.uk'
document.addEventListener("DOMContentLoaded", function () {
  const phoneInputField = document.querySelector("#phone");

  iti = intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      fetch("https://ipinfo.io/json?token=fc22452b4c6fba")
        .then((response) => response.json())
        .then((data) => callback(data.country))
        .catch(() => callback("us"));
    },
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });
});

document
  .querySelector(".php-email-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();


      const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const formData = new FormData(this);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const nameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const emailInput = document.querySelector('input[name="email"]');
    const subjectInput = document.querySelector('input[name="subject"]');
    const messageInput = document.querySelector("textarea");
    const successMessage = document.querySelector(".sent-message");

    // Validate Name
    if (!name) {
      nameInput.classList.add("is-invalid");
      nameInput.nextElementSibling.textContent = "Name is required";
    } else {
      nameInput.classList.remove("is-invalid");
      nameInput.nextElementSibling.textContent = "";
    }

    // Validate Email
    if (!email) {
      emailInput.classList.add("is-invalid");
      emailInput.nextElementSibling.txtContent = "Email is required";
    } else {
      emailInput.classList.remove("is-invalid");
      emailInput.nextElementSibling.textContent = "";
    }

    // Validate Subject
    if (!subject) {
      subjectInput.classList.add("is-invalid");
      subjectInput.nextElementSibling.textContent = "Subject is required";
    } else {
      subjectInput.classList.remove("is-invalid");
      subjectInput.nextElementSibling.textContent = "";
    }

    // Validate Message
    if (!message) {
      messageInput.classList.add("is-invalid");
      messageInput.nextElementSibling.textContent = "Message is required";
    } else {
      messageInput.classList.remove("is-invalid");
      messageInput.nextElementSibling.textContent = "";
    }

    // Validate Phone using intl-tel-input plugin
    const isValidPhone = iti.isValidNumber(); // Check if the phone number is valid

    if (!phone) {
      console.log(phoneInput.parentElement.parentElement.querySelector('.invalid-feedback'))
      phoneInput.classList.add("is-invalid");
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').style.display = "block";
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').textContent = "Phone is required";
    } else if (!isValidPhone) {
      phoneInput.classList.add("is-invalid");
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').style.display = "block";
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').textContent = "Phone is invalid";
    } else {
      phoneInput.classList.remove("is-invalid");
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').style.display = "none";
      phoneInput.parentElement.parentElement.querySelector('.invalid-feedback').textContent = "";
    }



    // If all fields are valid and reCAPTCHA is completed
    if (name && email && isValidPhone && subject && message && recaptchaToken) {
      try {
        const response = await fetch(BASE_URL + '/api/contactus/sendMessage', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phoneNumber:'+'+ iti.getSelectedCountryData().dialCode + phone,
            email,
            subject,
            message,
            recapchaToken:recaptchaToken,
          }),
        });

        if (response.ok) {
          successMessage.style.display = "block";
          this.reset(); // Reset form fields
          grecaptcha.reset(); // Reset reCAPTCHA
          
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Error submitting form. Please try again.");
      }
    }
  });
