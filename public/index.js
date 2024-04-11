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

//Pet Information
let petNames = ["Ben", "Milo", "Boomer","Jordan", "Eric", "Jin", "Snowy", "Ryom", "Jef", "Yippee"];
let petPhotos = ["images/corgi.jpg", "images/milo.jpg", "images/boomer.jpg","https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTNUsLxR5bVc0iPWDsXRYJzx8up7CIuExD8nYyYGX01KK_1VqXl0g7tgCAEw1Zh-4fNjTdJgg", "images/eric.jpg", "images/jin.jpg", "images/snowy.jpg", "images/ryom.jpg", "", ""];
let petTypes = ["Dog", "Cat", "Dog", "Cat", "Cat", "Dog", "Dog", "Dog", "Dog", "Dog"];
let petBreeds = ["Corgi", "Shorthair", "Labrador", "Siamese", "Ragdoll", "Pug", "Bichon", "Yorshire", "Husky", "Shiba Inu"];
let petAges = ["2", "1", "5","3", "2", "3", "4", "1", "2", "1"];
let petGenders = ["Male", "Male", "Male","Female", "Female", "Male", "Male", "Female", "Male", "Female"];
let petAlongs = ["Children, Dogs", "Children", "Dogs", "Children", "Children", "Kids", "Dogs", "", ""];
let petComments = ["Very friendly and playful", "Very Friendly and Playful", "Energetic and Playful","Calm and likes to sleep", "Shy and quiet, but very friendly", "", "Playful and Gentle", "Sleepy and Quiet", "", ""];

//Load Pets
function loadPets(){
    for(let i = 0; i < petNames.length; i++){
        let petinfo = 
        `<fieldset class="browsePet">
            <h3>${petNames[i]}</h3>
            <div class="imgcontainer">
                ${(petPhotos[i] == "" || petPhotos[i] == undefined) ? `<img class="petImg" src="images/codepawsnobg.png" alt="image${i}"><br>`: `<img class="petImg" src="${petPhotos[i]}" alt="image${i}"><br>`}
                
            </div>
            <p><strong>Type:</strong> ${petTypes[i]}</p>
            <p><strong>Breed:</strong> ${petBreeds[i]}</p>
            ${petAges[i] > 1 ? `<p><strong>Age:</strong> ${petAges[i]} years</p>`: `<p><strong>Age:</strong> ${petAges[i]} year</p>`}
            <p><strong>Gender:</strong> ${petGenders[i]}</p>
            ${(petAlongs[i] == "" || petAlongs[i] == undefined) ? "<p><strong>Good with:</strong> Not Specified": `<p><strong>Good with:</strong> ${petAlongs[i]}`}</p>
            ${(petComments[i] == "" || petComments[i] == undefined) ? "<p><strong>Comments:</strong> No Comments</p><br>" : `<p><strong>Comments:</strong> ${petComments[i]}</p><br>`}
            <button class="interested">Interested</button>
        </fieldset>`
        ;

        document.getElementById("pets").innerHTML += petinfo;
    }
}

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

window.onload = function(){
    getCurrentDate();
    loadPets();
}
