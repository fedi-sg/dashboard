document.addEventListener('DOMContentLoaded', async function () {
// Obtenez l'email de l'utilisateur connecté et chargez les données initiales.
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
loadInitialState(organizationName);

// Ajoutez des écouteurs d'événements pour les boutons de basculement

document.getElementById('autoSwitch').addEventListener('change', (event) => {
const auto = document.getElementById('autoSwitch').checked;
updateState('automatic', auto, organizationName);
});
document.getElementById('lampSwitch').addEventListener('change', (event) => {
const lamp = document.getElementById('lampSwitch').checked;
updateState('lampOn', lamp, organizationName);
});
document.getElementById('heaterSwitch').addEventListener('change', (event) => {
const heater = document.getElementById('heaterSwitch').checked;
updateState('heaterOn', heater, organizationName);
});
document.getElementById('fanSwitch').addEventListener('change', (event) => {
const fan = document.getElementById('fanSwitch').checked;
updateState('fanOn', fan, organizationName);
});
// Ajoutez un écouteur d'événements pour le champ de date
document.getElementById('startDate').addEventListener('change', (event) => {
const date = event.target.value;
updateState('startDateOfProduction', date, organizationName);
});
});

async function fetchEmail() {
return fetch('http://localhost:3000/get-email')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data.email; // Assuming the API returns an object with an 'email' property
    })
    .catch(error => {
        console.error('Failed to fetch:', error);
        throw error; // Re-throw to be handled by the caller
    });
}

async function fetchOrganizationName(email) {
try {
const response = await fetch(`http://localhost:3000/api/organization-name/${email}`);
const data = await response.json();
return data.organizationName;

} catch (error) {
console.error('Error:', error);
}
}

async function loadInitialState(organizationName) {
try {
const response = await fetch(`http://localhost:3000/api/get-latest-state/${organizationName}`);
const data = await response.json();
// Mettez à jour l'interface utilisateur avec les données récupérées
document.getElementById('autoSwitch').checked = data.automatic;
document.getElementById('lampSwitch').checked = data.lampOn;
document.getElementById('fanSwitch').checked = data.fanOn;
document.getElementById('startDate').value = data.startDateOfProduction.split('T')[0];
} catch (error) {
console.error('Error:', error);
}
}

async function updateState(elementId, newState, organizationName) {
try {
const payload = {
  [elementId]: newState
};
await fetch(`http://localhost:3000/api/update-state/${organizationName}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
} catch (error) {
console.error('Error:', error);
}
}
