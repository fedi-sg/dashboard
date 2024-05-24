
  var ctxNH3 = document.getElementById('nh3Chart').getContext('2d');
var nh3Chart = new Chart(ctxNH3, {
type: 'line',
data: {
labels: [],
datasets: [{
label: 'NH3 (ppm)',
backgroundColor: 'rgba(54, 162, 235, 0.2)',
borderColor: 'rgba(54, 162, 235, 1)',
data: []
},
        {
            label: '   normal',
            backgroundColor: '#0fffdf' ,
            borderColor: '#0fffdf',
        }]
},
options: {
scales: {
y: { // Correct the axis object key from 'yAxes' to 'y' for Chart.js v3
beginAtZero: true
}
},
        legend: {
            labels: {
              usePointStyle: true  //<-- set this
            }
        }
}
});

var ctxCO2 = document.getElementById('co2Chart').getContext('2d');
var co2Chart = new Chart(ctxCO2, {
type: 'line',
data: {
labels: [],
datasets: [{
label: 'CO2 (ppm)',
backgroundColor: 'rgba(75, 192, 192, 0.2)',
borderColor: 'rgba(75, 192, 192, 1)',
data: []
},
        {
            label: '   normal',
            backgroundColor: '#0fffdf' ,
            borderColor: '#0fffdf',
        }]
},
options: {
scales: {
y: { // Correct the axis object key from 'yAxes' to 'y' for Chart.js v3
beginAtZero: true
}
},
        legend: {
            labels: {
              usePointStyle: true  //<-- set this
            }
        }
}
});

const ctxDust = document.getElementById('dustChart').getContext('2d');
const dustChart = new Chart(ctxDust, {
type: 'line',
data: {
labels: [],
datasets: [{
label: 'Poussière (µg/m³)',
backgroundColor: 'rgba(255, 159, 64, 0.5)',
borderColor: 'rgba(255, 159, 64, 1)',
data: []
},
        {
            label: '   normal',
            backgroundColor: '#0fffdf' ,
            borderColor: '#0fffdf',
        }]
},
options: {
scales: {
y: { // Correct the axis object key from 'yAxes' to 'y' for Chart.js v3
beginAtZero: true,
suggestedMax: 150,
}
},
        legend: {
            labels: {
              usePointStyle: true  //<-- set this
            }
        }
}
});

var nh3Gaug = new JustGage({
      id: 'nh3--gauge',
      value: 5,
      min: 0,
      max: 100,
      title: "NH3",
      label: "ppm",
      gaugeWidthScale: 0.6,
      levelColors: ["#2ecc71"],
      valueFontColor: "#E0E0E0", // Set value color to white
      titleFontColor: "#E0E0E0", // Set title color to white
      labelFontColor: "#E0E0E0", // Set label color to white
  });

  // CO2 Gauge
  var co2Gaug = new JustGage({
      id: 'co2--gauge',
      value: 400,
      min: 0,
      max: 3000,
      title: "CO2",
      label: "ppm",
      gaugeWidthScale: 0.6,
      levelColors: ["#e74c3c"],
      valueFontColor: "#E0E0E0", // Set value color to white
      titleFontColor: "#E0E0E0", // Set title color to white
      labelFontColor: "#E0E0E0", // Set label color to white
  });

var dustGauge = new JustGage({
id: 'dust-Gauge',
value: 0,
min: 0,
max: 150,
title: "Poussière",
label: "µg/m³",
gaugeWidthScale: 0.6,
levelColors: ["#FF9F40"],
valueFontColor: "#E0E0E0",
titleFontColor: "#E0E0E0",
labelFontColor: "#E0E0E0",
});

let nh3History = [];
let co2History = [];
let dustHistory = [];
let dateHistory = [];

// Les fonctions pour mettre à jour les tableaux et jauges ici...
function fetchEmail() {
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

// Fonction pour récupérer et mettre à jour les données NH3, CO2, et Poussière
async function fetchDataAndUpdate() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
await initializeDustChart(`http://localhost:3000/api/dustt/5min/${organizationName}`);
await initializeNH3Chart(`http://localhost:3000/api/nh3s/5min/${organizationName}`);
await initializeCO2Chart(`http://localhost:3000/api/co2s/5min/${organizationName}`);


}
   

// Adding event listeners for different time frames
document.getElementById('btn5min').addEventListener('click',async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
    initializeCO2Chart(`http://localhost:3000/api/co2s/5min/${organizationName}`);
    initializeNH3Chart(`http://localhost:3000/api/nh3s/5min/${organizationName}`);
    initializeDustChart(`http://localhost:3000/api/dustt/5min/${organizationName}`);
});
document.getElementById('btnDay').addEventListener('click', async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
  initializeCO2Chart(`http://localhost:3000/api/co2s/day/${organizationName}`);
  initializeNH3Chart(`http://localhost:3000/api/nh3s/day/${organizationName}`);
  initializeDustChart(`http://localhost:3000/api/dustt/day/${organizationName}`);

});
document.getElementById('btnWeek').addEventListener('click',async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
  initializeCO2Chart(`http://localhost:3000/api/co2s/week/${organizationName}`);
    initializeNH3Chart(`http://localhost:3000/api/nh3s/week/${organizationName}`);
    initializeDustChart(`http://localhost:3000/api/dustt/week/${organizationName}`);
});



// Function to initialize NH3 chart with data fetched from an API URL
async function initializeNH3Chart(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const nh3Data = await response.json();
        const latestNH3Data = nh3Data.slice(-10);

        nh3Chart.data.labels = [];
        nh3Chart.data.datasets[0].data = [];
        
        latestNH3Data.forEach(data => {
            const time = new Date(data.date);
            const label = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            nh3Chart.data.labels.push(label);
            nh3Chart.data.datasets[0].data.push(data.nh3);
            updateNh3Table(data.nh3);
        });

        nh3Chart.update();
    } catch (error) {
        console.error("Error initializing NH3 chart:", error);
    }
}
// Function to initialize the CO2 chart
async function initializeCO2Chart(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const co2Data = await response.json();
        const latestCO2Data = co2Data.slice(-10); // Assumes the latest 10 entries are needed
        co2Chart.data.labels = [];
        co2Chart.data.datasets[0].data = [];

        latestCO2Data.forEach(data => {
            const time = new Date(data.date);
            const label = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            co2Chart.data.labels.push(label);
            co2Chart.data.datasets[0].data.push(data.co2);
            uppdatecTable(data.co2);
            updatedatTable(data.date);
        });
        co2Chart.update();
    } catch (error) {
        console.error("Error initializing the CO2 chart:", error);
        // Show user feedback here
    }
}

async function initializeDustChart(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const dustData = await response.json();
        const latestDustData = dustData.slice(-10);

        dustChart.data.labels = [];
        dustChart.data.datasets[0].data = [];

        latestDustData.forEach(entry => {
            const time = new Date(entry.date);
            // Including seconds in the label, for consistency with other charts
            const label = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            dustChart.data.labels.push(label);
            dustChart.data.datasets[0].data.push(entry.dust);
            updateDustTable( entry.dust);
        });

        dustChart.update();
    } catch (error) {
        console.error("Error initializing the dust chart:", error);
        // It's helpful to provide some form of user feedback here
    }
}

var n=0;

// Fonction pour mettre à jour le tableau historique avec les 10 dernières valeurs d'ammoniac
function updateNh3Table(concentration) {
// Ajoute la nouvelle concentration d'ammoniac au début du tableau
nh3History.unshift({ concentration });
if (concentration < 60) {
  const notificationId = 'n';

  function fetchEmail() {
    return fetch('http://localhost:3000/get-email')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => data.email)
      .catch(error => {
        console.error('Failed to fetch:', error);
        throw error; // Re-throw to be handled by the caller
      });
  }

  fetchEmail().then(email => {
    // Now include email in the check for an existing notification
    fetch(`http://localhost:3000/api/check-notification/${email}/${notificationId}`)
      .then(response => response.json())
      .then(result => {
        if (!result.exists) {
          const formnh3Data = {
            email: email,
            date: new Date(),
            message: 'nh3 level reached less than 60',
            read: false,
            id: 'n'
          };
          
          // Create a new notification
          return fetch('http://localhost:3000/api/newnotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formnh3Data)
          });
        } else {
          console.log('Notification already exists for this email.');
        }
      })
      .then(response => {
        if (response && !response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response ? response.text() : null;
      })
      .then(data => {
        if (data) {
          showNotification('top', 'center', 'nh3 level reached less than 60');
        }
      })
      .catch(error => {
        console.error('Failed to create notification:', error);
      });
  })
  .catch(error => {
    console.error('Failed to check notification existence:', error);
  });
}
// Limite le tableau à 10 entrées
if (nh3History.length > 10) nh3History.length = 10; // Garde uniquement les 10 premières entrées

// Sélectionne l'élément du DOM pour le tableau historique d'ammoniac
let tableBody = document.getElementById('NH3History');

// Réinitialise le contenu du tableau
tableBody.innerHTML = '';

// Remplit le tableau avec les nouvelles données
nh3History.forEach(entry => {
let row = `<tr>
<td>${entry.concentration} ppm</td>
</tr>`;
tableBody.innerHTML += row; // Ajoute la nouvelle entrée en haut du tableau
});
}
var c=0;
// Fonction pour mettre à jour le tableau historique avec les 10 dernières valeurs de CO2
function uppdatecTable(concentration) {
co2History.unshift({ concentration });


if (concentration < 400) {
  const notificationId = 'c';

  function fetchEmail() {
    return fetch('http://localhost:3000/get-email')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => data.email) // Assuming the API returns an object with an 'email' property
      .catch(error => {
        console.error('Failed to fetch:', error);
        throw error; // Re-throw to be handled by the caller
      });
  }

  // Check if the notification exists
  fetch(`http://localhost:3000/api/check-notification/${email}/${notificationId}`)
    .then(response => response.json())
    .then(result => {
      if (!result.exists) {
        fetchEmail().then(email => {
          const formCO2Data = {
            email: email,
            date: new Date(),
            message: 'co2 level reached better than 1000 ppm',
            read: false,
            id: 'c'
          };

          // Create a new notification
          return fetch('http://localhost:3000/api/newnotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formCO2Data)
          });
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.text();
        })
        .then(data => {
          showNotification('top', 'center', 'co2 level reached better than 1000 ppm');
          
        })
        .catch(error => {
          console.error('Failed to create notification:', error);
        });
      } 
    })
    .catch(error => {
      console.error('Failed to check notification existence:', error);
    });
}
if (co2History.length > 10) co2History.length = 10;

let tableBody = document.getElementById('co2History');
tableBody.innerHTML = '';

co2History.forEach(entry => {
let row = `<tr>
<td>${entry.concentration} ppm</td>
</tr>`;
tableBody.innerHTML += row;

});

}

function updatedatTable( date) {
dateHistory.unshift({  date });
if (dateHistory.length > 10) dateHistory.length = 10;
let tableBody = document.getElementById('date');
tableBody.innerHTML = '';
dateHistory.forEach(entry => {
let row = `<tr>
<td>${entry.date} </td>
</tr>`;
tableBody.innerHTML += row;
});
}
var d=0;

// Fonction pour mettre à jour le tableau historique avec les 10 dernières valeurs de poussière
function updateDustTable(dust) {
    dustHistory.unshift({ dust });

    // Vérifie si la poussière dépasse le seuil critique
    if (dust > 280) {
        const notificationId = 'd';

        fetchEmail().then(email => {
            checkNotificationExistence(email, notificationId).then(exists => {
                if (!exists) {
                    sendDustNotification(email, dust);
                } else {
                    console.log('Notification already exists for this email.');
                }
            });
        }).catch(error => {
            console.error('Error checking notification existence:', error);
        });
    }

    // Limite le tableau à 10 entrées
    if (dustHistory.length > 10) {
        dustHistory.length = 10;
    }

    // Met à jour le tableau dans le DOM
    const tableBody = document.getElementById('dustHistory');
    tableBody.innerHTML = '';

    dustHistory.forEach(entry => {
        const row = `<tr><td>${entry.dust} µg/m³</td></tr>`;
        tableBody.innerHTML += row;
    });
}

// Récupère l'email de l'utilisateur
function fetchEmail() {
    return fetch('http://localhost:3000/get-email')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.email)
        .catch(error => {
            console.error('Failed to fetch:', error);
            throw error;
        });
}

// Vérifie l'existence d'une notification
function checkNotificationExistence(email, notificationId) {
    return fetch(`http://localhost:3000/api/check-notification/${email}/${notificationId}`)
        .then(response => response.json())
        .then(result => result.exists)
        .catch(error => {
            console.error('Error checking notification:', error);
            throw error;
        });
}

// Envoie une notification de niveau de poussière élevé
function sendDustNotification(email, dust) {
    const formData = {
        email: email,
        date: new Date(),
        message: `Dust level reached ${dust} µg/m³`,
        read: false,
        id: 'd'
    };

    fetch('http://localhost:3000/api/newnotification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.text();
    })
    .then(data => {
        showNotification('top', 'center', `Dust level reached ${dust} µg/m³`);
    })
    .catch(error => {
        console.error('Failed to create notification:', error);
    });
}

function fetchEmail() {
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
async function fetchCO2Data() {
try {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
const response = await fetch(`http://localhost:3000/api/co2/${organizationName}`);
if (!response.ok) {
throw new Error('Network response was not ok');
}
const data = await response.json();
if (data.co2>700){
              co2Chart.data.datasets[1].label='anormal';
              co2Chart.data.datasets[1].backgroundColor='#ff0000';
              co2Chart.data.datasets[1].borderColor='#ff0000';

        }else{
          co2Chart.data.datasets[1].label='normal';
          co2Chart.data.datasets[1].backgroundColor='#32CD32';
          co2Chart.data.datasets[1].borderColor='#32CD32';
        }
updateCO2Chart(data.co2);
uppdatecTable(data.co2);

} catch (error) {
console.error("Erreur lors de la récupération des données de CO2:", error);
}
}
async function updateCO2Data() {
  try {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
  const response = await fetch(`http://localhost:3000/api/co2/${organizationName}`);
  if (!response.ok) {
  throw new Error('Network response was not ok');
  }
  const data = await response.json();
  co2Gaug.refresh(data.co2);

  
  } catch (error) {
  console.error("Erreur lors de la récupération des données de CO2:", error);
  }
  }




function fetchEmail() {
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
async function fetchNH3Data() {
try {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
const response = await fetch(`http://localhost:3000/api/nh3/${organizationName}`);
if (!response.ok) {
throw new Error('Network response was not ok');
}
const data = await response.json();
const date = data.date; // Exemple : "2023-03-16T09:00:00Z"
if (data.nh3>40){
              nh3Chart.data.datasets[1].label='anormal';
              nh3Chart.data.datasets[1].backgroundColor='#ff0000';
              nh3Chart.data.datasets[1].borderColor='#ff0000';

        }else{
          nh3Chart.data.datasets[1].label='normal';
          nh3Chart.data.datasets[1].backgroundColor='#32CD32';
          nh3Chart.data.datasets[1].borderColor='#32CD32';
        }
// Met à jour la jauge et le graphique d'NH3
updateNH3Chart(data.nh3);
updateNh3Table(data.nh3);
updatedatTable(data.date);
} catch (error) {
console.error("Erreur lors de la récupération des données d'NH3:", error);
}
}
async function updateNH3Data() {
  try {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
  const response = await fetch(`http://localhost:3000/api/nh3/${organizationName}`);
  if (!response.ok) {
  throw new Error('Network response was not ok');
  }
  const data = await response.json();
  const date = data.date; // Exemple : "2023-03-16T09:00:00Z"
  // Met à jour la jauge et le graphique d'NH3
  nh3Gaug.refresh(data.nh3);
  } catch (error) {
  console.error("Erreur lors de la récupération des données d'NH3:", error);
  }
  }
async function fetchDustData() {
try {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
const response = await fetch(`http://localhost:3000/api/dust/${organizationName}`);
if (!response.ok) {
throw new Error('Network response was not ok');
}
const data = await response.json();
if (data.dust>80){
              dustChart.data.datasets[1].label='anormal';
              dustChart.data.datasets[1].backgroundColor='#ff0000';
              dustChart.data.datasets[1].borderColor='#ff0000';

        }else{
          dustChart.data.datasets[1].label='normal';
          dustChart.data.datasets[1].backgroundColor='#32CD32';
          dustChart.data.datasets[1].borderColor='#32CD32';
        }
updateDustChart(data.dust);
updateDustTable( data.dust);
} catch (error) {
console.error("Erreur lors de la récupération des données de poussière:", error);
}
}
async function updateDustData() {
  try {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
  const response = await fetch(`http://localhost:3000/api/dust/${organizationName}`);
  if (!response.ok) {
  throw new Error('Network response was not ok');
  }
  const data = await response.json();
  dustGauge.refresh(data.dust);
  } catch (error) {
  console.error("Erreur lors de la récupération des données de poussière:", error);
  }
  }


function updateNH3Chart(value) {
const now = new Date();
const label = `${now.getHours()}:${now.getMinutes()}`;
// Ajoute la nouvelle valeur d'NH3 et met à jour le graphique
if (nh3Chart.data.labels.length >= 10) {
nh3Chart.data.labels.shift();
nh3Chart.data.datasets[0].data.shift();
}
nh3Chart.data.labels.push(label);
nh3Chart.data.datasets[0].data.push(value);
nh3Chart.update();
}

function updateCO2Chart(value) {
const now = new Date();
const label = `${now.getHours()}:${now.getMinutes()}`;
if (co2Chart.data.labels.length >= 10) {
co2Chart.data.labels.shift();
co2Chart.data.datasets[0].data.shift();
}
co2Chart.data.labels.push(label);
co2Chart.data.datasets[0].data.push(value);
co2Chart.update();
}
function updateDustChart(value) {
const now = new Date();
const label = `${now.getHours()}:${now.getMinutes()}`;
if (dustChart.data.labels.length >= 10) {
dustChart.data.labels.shift();
dustChart.data.datasets[0].data.shift();
}
dustChart.data.labels.push(label);
dustChart.data.datasets[0].data.push(value);
dustChart.update();
}

setInterval(fetchNH3Data, 300000);
setInterval(fetchCO2Data, 300000);
setInterval(fetchDustData, 300000);
setInterval(updateNH3Data,5000);
setInterval(updateCO2Data,5000);
setInterval(updateDustData,5000);

