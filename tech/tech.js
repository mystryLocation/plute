
function saveTechnology() {
    var technologyName = document.getElementById("technology-name").value;
    var technologyDesc = document.getElementById("technology-desc").value;
    var technologyLanguages = document.getElementById("technology-languages").value;
    var technologyFrameworks = document.getElementById("technology-frameworks").value;
    var files = document.getElementById("technology-images").files;

    if (!technologyName || !technologyDesc || !technologyLanguages || !technologyFrameworks || files.length === 0) {
        alert("Please fill in all the fields and select at least one image.");
        return;
    }

    const storageRef = firebase.storage().ref();
    const technologiesRef = firebase.database().ref("technologies");
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = +new Date() + "-" + file.name;
        const metadata = {
            contentType: file.type
        };

        const task = storageRef.child(name).put(file, metadata);
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                // Save technology data with image URL to Realtime Database
                var technologyData = {
                    name: technologyName, // Set the technology name explicitly
                    description: technologyDesc,
                    languagesUsed: technologyLanguages,
                    frameworksUsed: technologyFrameworks,
                    imageURL: url
                };

                // Generate a new unique key for the technology entry
                var newTechnologyRef = technologiesRef.push();

                // Set the technology data with the new key
                newTechnologyRef.set(technologyData);
            })
            .catch(error => {
                console.error("Error uploading file or saving technology details:", error);
                alert("An error occurred. Please try again.");
            });
    }

    alert("Technologies saved successfully!");
}


function previewImages(event) {
    const input = event.target;

    if (input.files && input.files.length > 0) {
        const imagesPreview = document.getElementById('images-preview');
        imagesPreview.innerHTML = ''; // Clear previous previews

        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();
            const img = document.createElement('img');
            img.classList.add('image-preview');
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(input.files[i]);
            imagesPreview.appendChild(img);
        }
    }
}

// Function to retrieve and display technology data from Firebase Realtime Database
function displayTechnologyData() {
    var technologiesRef = firebase.database().ref("technologies");

    technologiesRef.on('child_added', function(childSnapshot) {
        var technologyKey = childSnapshot.key;
        var technologyData = childSnapshot.val();

        var technologyList = document.getElementById('technology-list');
        var technologyItem = document.createElement('div');
        technologyItem.classList.add('technology-item'); // Add a class for styling
        technologyItem.innerHTML = `
            <h3>${technologyData.name}</h3>
            <p>Description: ${technologyData.description}</p>
            <p>Languages Used: ${technologyData.languagesUsed}</p>
            <p>Frameworks Used: ${technologyData.frameworksUsed}</p>
            <img src="${technologyData.imageURL}" alt="Technology Image" class="technology-image">
            <button class="delete-button" data-key="${technologyKey}">Delete</button>
        `;
        technologyList.appendChild(technologyItem);

        // Add event listener to delete button
        var deleteButton = technologyItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            var key = this.getAttribute('data-key');
            deleteTechnology(key);
        });
    });
}

function deleteTechnology(key) {
    var technologiesRef = firebase.database().ref("technologies").child(key);
    technologiesRef.remove()
        .then(function() {
            alert("Technology deleted successfully!");
            window.location.reload();
        })
        .catch(function(error) {
            console.error("Error deleting technology:", error);
            alert("An error occurred while deleting technology. Please try again.");
        });
}

