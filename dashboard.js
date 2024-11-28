const dummyDelivery = [
  // { id: 1, name: "Budi", department: "Engineering", position: "Software Engineer", status: "Active" },
  // { id: 2, name: "Ani", department: "HR", position: "HR Manager", status: "Active" },
  // { id: 3, name: "Yono", department: "Engineering", position: "Senior Developer", status: "Active" },
  // { id: 4, name: "Sakti", department: "Finance", position: "Accountant", status: "Inactive" },
  // { id: 5, name: "Ridwan", department: "Marketing", position: "Marketing Lead", status: "Active" }
  {
    id: 1,
    date: "2024-11-01",
    partName: "ENGINE ASSY",
    destination: "DOMESTIC",
    planning: "432",
    actual: "436",
  },
  {
    id: 2,
    date: "2024-11-01",
    partName: "ENGINE ASSY",
    destination: "VIETNAM",
    planning: "480",
    actual: "480",
  },
  {
    id: 3,
    date: "2024-11-01",
    partName: "COMPONENT ENGINE",
    destination: "PAKISTAN",
    planning: "300",
    actual: "300",
  },
  {
    id: 4,
    date: "2024-11-04",
    partName: "ENGINE ASSY",
    destination: "DOMESTIC",
    planning: "300",
    actual: "299",
  },
  {
    id: 5,
    date: "2024-11-04",
    partName: "ENGINE ASSY",
    destination: "PHILIPPINES",
    planning: "240",
    actual: "240",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "./index.html";
    return;
  }

  // Set user email in navbar
  const userEmail = localStorage.getItem("emailLogin");
  console.log("userEmail : ", userEmail);
  document.getElementById("userEmail").textContent = formatEmail(userEmail);

  // Initialize employees data
  if (!localStorage.getItem("delivery")) {
    localStorage.setItem("delivery", JSON.stringify(dummyDelivery));
  }

  const delivery = JSON.parse(localStorage.getItem("delivery"));
  const destination = [...new Set(delivery.map((emp) => emp.destination))];
  console.log("delivery : ", delivery);
  console.log("destination : ", destination);

  // Update statistics
  document.getElementById("totalDelivery").textContent = delivery.length;
  document.getElementById("totalDestination").textContent = destination.length;

  // Function to render table rows
  function renderDelivery(deliveryData) {
    const tableBody = document.getElementById("deliveryTableBody");
    tableBody.innerHTML = deliveryData
      .map((emp) => {
        const badgeColor =
          emp.actual < emp.planning ? "bg-danger":
          emp.actual > emp.planning ? "bg-warning" : "bg-success";
        return `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.date}</td>
                <td><span class="badge bg-info department-badge">${emp.partName}</span></td>
                <td>${emp.destination}</td>
                <td><span class="badge bg-success status-badge">${emp.planning}</span></td>
                <td><span class="badge ${badgeColor} bg-success status-badge">${emp.actual}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                </td>
            </tr>
        `;
      })
      .join("");
  }

  // Initial render
  renderDelivery(delivery);

  // Search functionality
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const filteredDelivery = delivery.filter(
        (emp) =>
          emp.partName.toLowerCase().includes(searchTerm) ||
          emp.destination.toLowerCase().includes(searchTerm) ||
          emp.planning.toLowerCase().includes(searchTerm) ||
          emp.actual.toLowerCase().includes(searchTerm)
      );
      renderDelivery(filteredDelivery);
    });

  // Handle logout
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("emailLogin");
      window.location.href = "./index.html";
    });
});


//  new add, 2024-11-20
    // Function to show alert
    function showAlert(message, type = 'success') {
        const alert = document.getElementById(`${type}Alert`);
        alert.style.display = 'block';
        alert.classList.add('show');
        
        setTimeout(() => {
            alert.style.display = 'none';
            alert.classList.remove('show');
        }, 3000);
    }

// Function to validate the form
function validateForm(form) {
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return false;
    }
    return true;
  }
  
  // Function to add new delivery
  function addDelivery() {
    const form = document.getElementById("addDeliveryForm");
  
    // Validate the form
    if (!validateForm(form)) {
      return;
    }
  
    // Get current deliveries from localStorage
    const deliveries = JSON.parse(localStorage.getItem("delivery")) || [];
  
    // Create a new delivery object
    const newDelivery = {
      id: deliveries.length + 1,
      date: document.getElementById("deliveryDate").value,
      partName: document.getElementById("partName").value,
      destination: document.getElementById("destination").value,
      planning: parseInt(document.getElementById("planning").value, 10),
      actual: parseInt(document.getElementById("actual").value, 10),
    };
  
    // Add the new delivery to the array and save it to localStorage
    deliveries.push(newDelivery);
    localStorage.setItem("delivery", JSON.stringify(deliveries));
  
    // Re-render table
    renderDelivery(deliveries);
  
    // Update statistics
    document.getElementById("totalDelivery").textContent = deliveries.length;
    const destinations = [...new Set(deliveries.map((d) => d.destination))];
    document.getElementById("totalDestination").textContent = destinations.length;
  
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addDeliveryModal"));
    modal.hide();
  
    // Reset the form
    form.reset();
    form.classList.remove("was-validated");
  
    // Show success alert
    showAlert("Delivery added successfully!", "success");
  }
  
  // Add event listener for the save button
  document.getElementById("saveDelivery").addEventListener("click", addDelivery);
  
  // Reset form when modal is closed
  document.getElementById("addDeliveryModal").addEventListener("hidden.bs.modal", function () {
    const form = document.getElementById("addDeliveryForm");
    form.reset();
    form.classList.remove("was-validated");
  });
  
  // Function to render table rows (already in your code, no changes needed)
  function renderDelivery(deliveryData) {
    const tableBody = document.getElementById("deliveryTableBody");
    tableBody.innerHTML = deliveryData
      .map((emp) => {
        const badgeColor =
          emp.actual < emp.planning ? "bg-danger" :
          emp.actual > emp.planning ? "bg-warning" : "bg-success";
        return `
              <tr>
                  <td>${emp.id}</td>
                  <td>${emp.date}</td>
                  <td><span class="badge bg-info department-badge">${emp.partName}</span></td>
                  <td>${emp.destination}</td>
                  <td><span class="badge bg-success status-badge">${emp.planning}</span></td>
                  <td><span class="badge ${badgeColor} status-badge">${emp.actual}</span></td>
                  <td>
                      <button class="btn btn-sm btn-outline-primary me-1">Edit</button>
                      <button class="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
              </tr>
          `;
      })
      .join("");
  }
  


function formatEmail(email) {
  return email.split("@")[0];
}
