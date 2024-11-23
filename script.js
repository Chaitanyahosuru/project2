document.addEventListener('DOMContentLoaded', () => {
    const pincodeInput = document.getElementById('pincodeInput');
    const lookupButton = document.getElementById('lookupButton');
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error');
    const detailsDiv = document.getElementById('details');
    const filterInput = document.getElementById('filterInput');
    const filteredResultsDiv = document.getElementById('filteredResults');
    const filterGroup = document.querySelector('.filter-group');

    async function fetchPincodeDetails(pincode) {
        try {
            loader.style.display = 'block';
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            loader.style.display = 'none';
            if (data[0].Status === 'Error') {
                showError('Could not fetch pincode details.');
            } else {
                displayDetails(data[0].PostOffice);
            }
        } catch (error) {
            loader.style.display = 'none';
            showError('An error occurred while fetching data.');
        }
    }

    function displayDetails(postOffices) {
        detailsDiv.innerHTML = '';
        postOffices.forEach(postOffice => {
            const postOfficeDiv = document.createElement('div');
            postOfficeDiv.innerHTML = `
                <strong>Post Office Name:</strong> ${postOffice.Name}<br>
                <strong>Pincode:</strong> ${postOffice.Pincode}<br>
                <strong>District:</strong> ${postOffice.District}<br>
                <strong>State:</strong> ${postOffice.State}
            `;
            detailsDiv.appendChild(postOfficeDiv);
        });
        filterGroup.style.display = 'block';
        filterInput.value = '';
    }

    function filterResults() {
        const filterValue = filterInput.value.toLowerCase();
        const filteredPostOffices = postOffices.filter(postOffice =>
            postOffice.Name.toLowerCase().includes(filterValue)
        );
        if (filteredPostOffices.length > 0) {
            displayDetails(filteredPostOffices);
        } else {
            showError("Couldn’t find the postal data you’re looking for…");
        }
    }

    function showError(message) {
        errorDiv.textContent = message;
        detailsDiv.innerHTML = '';
        filterGroup.style.display = 'none';
    }

    lookupButton.addEventListener('click', () => {
        const pincode = pincodeInput.value.trim();
        if (pincode.length === 6) {
            errorDiv.textContent = '';
            fetchPincodeDetails(pincode);
        } else {
            showError('Please enter a valid 6-digit pincode.');
        }
    });

    filterInput.addEventListener('input', filterResults);
});
