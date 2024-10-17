// Fetch all pets and display them grouped by groomer
fetch('https://phase1-project-emma.onrender.com/pets')
  .then((res) => res.json())
  .then((data) => {
    const petsList = document.getElementById("pets_list");
    const groomers = {};

    // Group pets by groomer
    data.forEach(pet => {
      if (!groomers[pet.groomer]) {
        groomers[pet.groomer] = [];
      }
      groomers[pet.groomer].push(pet);
    });

    // Clear the existing content before appending new items
    petsList.innerHTML = '';

    // Display each groomer in a separate column (now 5 columns)
    for (const groomer in groomers) {
      const groomerCol = document.createElement('div');
      groomerCol.classList.add('col-lg-2'); // Change to col-lg-2 for 5 columns
      
      groomerCol.innerHTML = `
        <h3>${groomer}</h3>
        <div id="${groomer}_pets" class="row"></div>
      `;

      // Append each groomer's pets
      const groomerSection = groomerCol.querySelector(`#${groomer}_pets`);
      groomers[groomer].forEach(pet => {
        groomerSection.innerHTML += `
          <div class="col-12 mb-4">
            <div class="card">
              <img src="${pet.picture}" class="card-img-top" alt="${pet.petName}">
              <div class="card-body">
                <h5 class="card-title">${pet.petName}</h5>
                <div id="pet_details_${pet.id}" style="display: none;">
                  <p>Owner: ${pet.owner}</p>
                  <p>Breed: ${pet.petBreed}</p>
                  <p>Age: ${pet.petAge}</p>
                  <p>Grooming Status: ${pet.groomingStatus}</p>
                  <p>Next Grooming Date: ${pet.groomingDate}</p>
                  <p>Grooming History: ${pet.groomingHistory}</p>
                </div>
              </div>
               <button onclick="deletePet('${pet.id}')" class="btn btn-danger btn-sm">Delete</button>
                <button onclick="editPet('${pet.id}')" class="btn btn-success ms-4 btn-sm">Update</button>
                <button onclick="viewPet('${pet.id}')" class="btn btn-primary ms-4 btn-sm">View</button>
            </div>
          </div>
        `;
      });

      // Add each groomer column to the pets list
      petsList.appendChild(groomerCol);
    }
  })
  .catch((error) => console.error("Error fetching pets:", error));

// Add a new pet and display it under the corresponding groomer
const addPetForm = document.getElementById("add_pet_form");
addPetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newPet = {
    owner: document.getElementById("petOwner").value,
    petId: document.getElementById("petId").value,
    petName: document.getElementById("petName").value,
    petAge: document.getElementById("petAge").value,
    petBreed: document.getElementById("petBreed").value,
    groomingDate: document.getElementById("groomingDate").value,
    groomingStatus: document.getElementById("groomingStatus").value,
    groomer: document.getElementById("groomer").value,
    groomingHistory: document.getElementById("groomingHistory").value,
    picture: document.getElementById("picture").value
  };

  fetch('https://phase1-project-emma.onrender.com/pets', {
    method: 'POST',
    body: JSON.stringify(newPet),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((pet) => {
      const groomerSection = document.getElementById(`${pet.groomer}_pets`) || createGroomerSection(pet.groomer);
      
      // Display only name, image, and buttons initially
      groomerSection.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${pet.picture}" class="card-img-top" alt="${pet.petName}">
            <div class="card-body">
              <h5 class="card-title">${pet.petName}</h5>
              <button onclick="deletePet('${pet.id}')" class="btn btn-danger btn-sm">Delete</button>
              <button onclick="editPet('${pet.id}')" class="btn btn-success ms-4 btn-sm">Update</button>
              <button onclick="viewPet('${pet.id}')" class="btn btn-primary ms-4 btn-sm">View</button>
              <div id="pet_details_${pet.id}" style="display: none;">
                <p>Owner: ${pet.owner}</p>
                <p>Breed: ${pet.petBreed}</p>
                <p>Age: ${pet.petAge}</p>
                <p>Grooming Status: ${pet.groomingStatus}</p>
                <p>Next Grooming Date: ${pet.groomingDate}</p>
                <p>Grooming History: ${pet.groomingHistory}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      addPetForm.reset();
    })
    .catch((error) => console.error("Error adding pet:", error));
});

// Delete a pet
function deletePet(id) {
  fetch(`https://phase1-project-emma.onrender.com/pets/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      alert("Pet deleted successfully");
      location.reload(); // Reload to refresh the pet list
    })
    .catch((error) => console.error("Error deleting pet:", error));
}

// View pet details (toggle visibility)
function viewPet(id) {
  const petDetails = document.getElementById(`pet_details_${id}`);
  if (petDetails.style.display === "none") {
    petDetails.style.display = "block";
  } else {
    petDetails.style.display = "none";
  }
}
// Edit a pet - open modal with existing details
function editPet(id) {
  fetch(`https://phase1-project-emma.onrender.com/pet/${id}`)
    .then((res) => res.json())
    .then((pet) => {
      // Populate the modal form with the pet's current values for editing
      document.getElementById("editPetOwner").value = pet.owner;
      document.getElementById("editPetName").value = pet.petName;
      document.getElementById("editPetBreed").value = pet.petBreed;
      document.getElementById("editGroomer").value = pet.groomer;
      document.getElementById("editGroomingDate").value = pet.groomingDate;
      document.getElementById("editGroomingStatus").value = pet.groomingStatus;
      document.getElementById("editPetPicture").value = pet.picture;

      // Show the modal
      const editPetModal = new bootstrap.Modal(document.getElementById('editPetModal'));
      editPetModal.show();

      // Handle form submission for updating the pet
      const editPetForm = document.getElementById("edit_pet_form");
      editPetForm.onsubmit = function(event) {
        event.preventDefault();

        const updatedPet = {
          owner: document.getElementById("editPetOwner").value,
          petName: document.getElementById("editPetName").value,
          petBreed: document.getElementById("editPetBreed").value,
          groomer: document.getElementById("editGroomer").value,
          groomingDate: document.getElementById("editGroomingDate").value,
          groomingStatus: document.getElementById("editGroomingStatus").value,
          picture: document.getElementById("editPetPicture").value,
        };

        fetch(`https://phase1-project-emma.onrender.com/pets/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedPet),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        .then(() => {
          alert("Pet updated successfully");
          location.reload(); // Reload to display updated pet
        })
        .catch((error) => console.error("Error updating pet:", error));
      };
    })
    .catch((error) => console.error("Error fetching pet for editing:", error));
}


// Helper function to create a section for each groomer dynamically if it doesn't exist
function createGroomerSection(groomer) {
  const petsList = document.getElementById("pets_list");
  petsList.innerHTML += `<h3>${groomer}</h3><div id="${groomer}_pets" class="row"></div>`;
  return document.getElementById(`${groomer}_pets`);
}


// Select the HTML elements for the form and tips list
// Select the HTML elements for the form and tips list
const groomingTipsForm = document.getElementById("grooming_tips_form");
const tipsList = document.getElementById("tips_list");

let editingTipIndex = -1;
let groomingTips = []; // Array to store grooming tips

// Fetch existing grooming tips from the server when the page loads
async function fetchGroomingTips() {
  try {
    const response = await fetch("https://phase1-project-emma.onrender.com/groomingTips");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    groomingTips = await response.json();
    displayGroomingTips();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Add an event listener to the form's submission event
groomingTipsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract the values from the form fields
  const tipTitle = document.getElementById("tipTitle").value;
  const tipDetails = document.getElementById("tipDetails").value;
  const productRecommendations = document.getElementById("productRecommendations").value;

  // Input validation
  if (!tipTitle || !tipDetails || !productRecommendations) {
    alert("Please fill out all required fields.");
    return;
  }

  if (editingTipIndex !== -1) {
    // Update the existing tip in the array
    groomingTips[editingTipIndex] = {
      title: tipTitle,
      details: tipDetails,
      products: productRecommendations,
    };

    // Update the data on the server
    await updateGroomingTip(groomingTips[editingTipIndex]);

    // Clear the form and reset the edit index
    groomingTipsForm.reset();
    editingTipIndex = -1;

    // Display a message indicating the tip was updated
    alert("Grooming tip updated successfully!");

  } else {
    // Add the new tip to the array
    const newTip = {
      title: tipTitle,
      details: tipDetails,
      products: productRecommendations,
    };
    groomingTips.push(newTip);

    // Send the new tip to the server
    await addGroomingTip(newTip);

    // Clear the form
    groomingTipsForm.reset();

    // Display a message indicating the tip was submitted
    alert("Grooming tip submitted successfully!");
  }

  // Display the updated list of grooming tips
  displayGroomingTips();
});

// Function to display the grooming tips in 4 columns
function displayGroomingTips() {
  tipsList.innerHTML = "";
  let tipsFound = false;

  groomingTips.forEach((tip, index) => {
    tipsFound = true;
    const tipItem = document.createElement("div");
    tipItem.classList.add("tip-item", "col-md-3"); // Change column size to display in 4 columns

    tipItem.innerHTML = `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${tip.title}</h5>
          <p class="card-text"><strong>Details:</strong> ${tip.details}</p>
          <p class="card-text"><strong>Product Recommendations:</strong> ${tip.products}</p>
          <button class="edit-button btn btn-warning">Edit</button>
          <button class="delete-button btn btn-danger">Delete</button>
        </div>
      </div>
    `;

    tipsList.appendChild(tipItem);

    const editButton = tipItem.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      // Populate the form with the tip's data
      groomingTipsForm.reset();
      document.getElementById("tipTitle").value = tip.title;
      document.getElementById("tipDetails").value = tip.details;
      document.getElementById("productRecommendations").value = tip.products;

      // Set the index for editing the existing tip
      editingTipIndex = index;
    });

    const deleteButton = tipItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
      // Remove the tip from the array based on index
      await deleteGroomingTip(tip);
      groomingTips.splice(index, 1);

      // Update the displayed list
      displayGroomingTips();
    });
  });

  if (!tipsFound) {
    tipsList.innerHTML = "No grooming tips available.";
  }
}

// Function to add a new grooming tip to the server
async function addGroomingTip(tip) {
  try {
    const response = await fetch("https://phase1-project-emma.onrender.com/groomingTips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tip),
    });

    if (!response.ok) {
      throw new Error("Failed to add grooming tip: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding grooming tip:", error);
  }
}

// Function to update an existing grooming tip on the server
async function updateGroomingTip(tip) {
  try {
    const response = await fetch(`https://phase1-project-emma.onrender.com/groomingTips/${tip.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tip),
    });

    if (!response.ok) {
      throw new Error("Failed to update grooming tip: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating grooming tip:", error);
  }
}

// Function to delete a grooming tip from the server
async function deleteGroomingTip(tip) {
  try {
    const response = await fetch(`https://phase1-project-emma.onrender.com/groomingTips/${tip.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete grooming tip: " + response.statusText);
    }
  } catch (error) {
    console.error("Error deleting grooming tip:", error);
  }
}

// Fetch the grooming tips when the page loads
fetchGroomingTips();

document.addEventListener('DOMContentLoaded', () => {
    const experiences = document.querySelectorAll('.experience');
    let currentExperience = 0;

    // Function to show the next experience
    function showNextExperience() {
        // Hide all experiences
        experiences.forEach(exp => exp.classList.remove('active'));

        // Show the current experience
        experiences[currentExperience].classList.add('active');

        // Move to the next experience (or loop back to the first)
        currentExperience = (currentExperience + 1) % experiences.length;
    }

    // Initial display of the first experience
    showNextExperience();

    // Set interval to rotate experiences every 5 seconds
    setInterval(showNextExperience, 5000);
});
