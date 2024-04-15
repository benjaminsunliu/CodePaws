//Date Function
function getCurrentDate(){
    let date = new Date();
    let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayname = weekday[date.getDay()];
    let day = date.getDate();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if(hour < 10){
        hour = "0" + hour;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    document.getElementById("dateandtime").innerHTML = dayname + ", " + month + " " + day + ", " + year + ", " + hour + ":" + minutes + ":" + seconds;
    return dayname + ", " + month + " " + day + ", " + year + ", " + hour + ":" + minutes + ":" + seconds;
}
setInterval(getCurrentDate, 1000); // Update the date every second

//Find Form Validation
function validateFindForm(event){
    let type = document.querySelector('input[name="type"]:checked');
    let breed = document.getElementById("breed").value;
    let age = document.getElementById("age").value;
    let gender = document.querySelector('input[name = "gender"]:checked');

    if (!type || breed == "" || age == "" || !gender){
        alert("Please fill out all required fields");
        event.preventDefault();
    }
}

//Give Form Validation
function validateGiveForm(event){
    let type = document.querySelector('input[name="type"]:checked');
    let breed = document.getElementById("breed").value;
    let age = document.getElementById("age").value;
    let gender = document.querySelector('input[name="gender"]:checked');
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!type || name == "" || !email || !breed || !age || !gender) {
        // If any fields are blank, display an error message and prevent the form from being submitted
        alert("Please fill out all fields.");
        event.preventDefault();
    }

    if (!emailRegex.test(email)) {
        // If the email is not in a valid format, display an error message and prevent the form from being submitted
        alert("Please enter a valid email address.");
        event.preventDefault();
    }
}

function displayEmail(petId) {
    var emailDiv = document.getElementById('email-' + petId);
    if (emailDiv.style.display === 'none') {
        emailDiv.style.display = 'block';
    } else {
        emailDiv.style.display = 'none';
    }
}

window.onload = function(){
    getCurrentDate();
}
