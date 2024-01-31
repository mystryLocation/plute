    // Your Firebase configuration
    
      function saveLanguage() {
        console.log("saveLanguage function is being called."); // Add this line
         var languageName = document.getElementById("language-name").value;
         var languageDesc = document.getElementById("language-desc").value;
         var languageUses = document.getElementById("language-uses").value;
        //  var languageOtherDetails = document.getElementById("language-other").value;
         var file = document.getElementById("coreroadmap").files[0];
      
         if (!languageName ||  !languageDesc || !languageUses || !file) {
            alert("Please fill in all the fields and select an image.");
            return;
         }
      
         const storageRef = firebase.storage().ref();
         const name = +new Date() + "-" + file.name;
         const metadata = {
            contentType: file.type
         };
      
         const task = storageRef.child(name).put(file, metadata);
         task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
               // Save language data with image URL to Realtime Database
               var languageData = {
                  name: languageName, // Set the language name explicitly
                  description: languageDesc,
                  uses: languageUses,
                  imageURL: url
               };
      
               var languagesRef = firebase.database().ref("languages");
      
               // Generate a new unique key for the language entry
               var newLanguageRef = languagesRef.push();
      
               // Set the language data with the new key
               newLanguageRef.set(languageData);
      
               alert("Language saved successfully!");
      
               // Clear form fields
               document.getElementById("language-name").value = "";
               document.getElementById("language-desc").value = "";
               document.getElementById("language-uses").value = "";
               document.getElementById("image").value = "";
            })
            .catch(error => {
               console.error("Error uploading file or saving language details:", error);
               alert("An error occurred. Please try again.");
            });
      }

      function previewImage(event) {
        const input = event.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgPreview = document.getElementById('img-preview');
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block'; // Show the image preview
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

