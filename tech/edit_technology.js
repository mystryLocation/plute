document.addEventListener('DOMContentLoaded', function () {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyB4Po_GC3uih62QXM6KuTUqVOm1UH-SuWA",
        authDomain: "web-new-401cb.firebaseapp.com",
        projectId: "web-new-401cb",
        storageBucket: "web-new-401cb.appspot.com",
        messagingSenderId: "326958372871",
        appId: "1:326958372871:web:d6135d15cde471ec7eb2a2"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Populate form fields with existing technology data
    populateFormFields();

    // Add submit event listener to the edit technology form
    document.getElementById('editTechnologyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Update technology data
        updateTechnology();
    });
});

// Function to populate form fields with existing technology data
function populateFormFields() {
    // Get technology key from URL
    var technologyKey = getTechnologyKeyFromURL();

    // Get reference to the technology in Firebase database
    var technologyRef = firebase.database().ref("technologies").child(technologyKey);

    // Retrieve technology data
    technologyRef.once('value', function (snapshot) {
        var technologyData = snapshot.val();

        // Populate form fields with existing data
        document.getElementById('edit-technology-name').value = technologyData.name;
        document.getElementById('edit-technology-desc').value = technologyData.description;
        document.getElementById('edit-technology-languages').value = technologyData.languagesUsed;
        document.getElementById('edit-technology-frameworks').value = technologyData.frameworksUsed;
    });
}

// Function to update technology data in Firebase
function updateTechnology() {
    var technologyName = document.getElementById("edit-technology-name").value;
    var technologyDesc = document.getElementById("edit-technology-desc").value;
    var technologyLanguages = document.getElementById("edit-technology-languages").value;
    var technologyFrameworks = document.getElementById("edit-technology-frameworks").value;
    var technologyKey = getTechnologyKeyFromURL(); // Function to get technology key from URL

    if (!technologyName || !technologyDesc || !technologyLanguages || !technologyFrameworks) {
        alert("Please fill in all the fields.");
        return;
    }

    var technologyRef = firebase.database().ref("technologies").child(technologyKey);
    technologyRef.update({
        name: technologyName,
        description: technologyDesc,
        languagesUsed: technologyLanguages,
        frameworksUsed: technologyFrameworks
    }).then(function () {
        alert("Technology updated successfully!");
        // Redirect back to the technology page
        window.location.href = "../tech/tech.html";
    }).catch(function (error) {
        console.error("Error updating technology:", error);
        alert("An error occurred while updating the technology. Please try again.");
    });
}

// Function to extract technology key from URL query parameter
function getTechnologyKeyFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('key');
}
