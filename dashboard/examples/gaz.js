// Initialiser le graphique des gaz avec Chart.js
var x=0;
var ctx = document.getElementById('gasChart').getContext('2d');
var gasChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'CO2 (ppm)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: []
        }, {
            label: 'NH3 (ppm)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: []
        }]
    },
    options: {
        scales: {
            y: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
// Supposons une fonction générique pour récupérer les données historiques de l'API

function fetchEmaill() {
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
async function fetchOrganizationNamme(email) {
  try {
    const response = await fetch(`http://localhost:3000/api/organization-name/${email}`);
    const data = await response.json();
    return data.organizationName;

  } catch (error) {
    console.error('Error:', error);
  }
}


// Function to initialize the gas chart with historical data from specific API endpoint
async function initializeChart(apiUrlCO2, apiUrlNH3) {
    gasChart.data.labels = [];
    gasChart.data.datasets[0].data = [];
    gasChart.data.datasets[1].data = [];
  
    try {
        const responseCO2 = await fetch(apiUrlCO2);
        const responseNH3 = await fetch(apiUrlNH3);

        if (!responseCO2.ok) {
            throw new Error(`Network response was not ok for CO2 data from ${apiUrlCO2}`);
        }
        if (!responseNH3.ok) {
            throw new Error(`Network response was not ok for NH3 data from ${apiUrlNH3}`);
        }

        const co2Data = await responseCO2.json();
        const nh3Data = await responseNH3.json();

        const last10CO2 = co2Data.slice(-10);
        const last10NH3 = nh3Data.slice(-10);

        last10CO2.forEach((data, index) => {
            const time = new Date(data.date);
            const label = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            gasChart.data.labels.push(label);
            gasChart.data.datasets[0].data.push(data.co2);

            if (last10NH3[index]) {
                gasChart.data.datasets[1].data.push(last10NH3[index].nh3);
            } else {
                gasChart.data.datasets[1].data.push(null);
            }
        });

        gasChart.update();
    } catch (error) {
        console.error("Failed to initialize chart with historical data:", error);
        alert(error.message); // Provide feedback to the user
    }
}

document.getElementById('10').addEventListener('click',async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
    initializeChart(`http://localhost:3000/api/co2s/5min/${organizationName}`, `http://localhost:3000/api/nh3s/5min/${organizationName}`);
});
document.getElementById('11').addEventListener('click',async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
    initializeChart(`http://localhost:3000/api/co2s/day/${organizationName}`, `http://localhost:3000/api/nh3s/day/${organizationName}`);
});
document.getElementById('12').addEventListener('click',async function() {
  const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
    initializeChart(`http://localhost:3000/api/co2s/week/${organizationName}`, `http://localhost:3000/api/nh3s/week/${organizationName}`);
});

function addData(chart, label, co2Data, nh3Data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(co2Data);
    chart.data.datasets[1].data.push(nh3Data);
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
    }
    chart.update();
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
async function getCO2() {
    try {
      const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
        const response = await fetch(`http://localhost:3000/api/co2/${organizationName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok for CO2');
        }
        const data = await response.json();
        return data.co2; // Assurez-vous que cela correspond à la structure de votre réponse JSON
    } catch (error) {
        console.error("Could not fetch CO2 level:", error);
        return null;
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
async function getNH3() {
    try {
      const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
        const response = await fetch(`http://localhost:3000/api/nh3/${organizationName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok for NH3');
        }
        const data = await response.json();
        return data.nh3; // Assurez-vous que cela correspond à la structure de votre réponse JSON
    } catch (error) {
        console.error("Could not fetch NH3 level:", error);
        return null;
    }
}

// Fonction pour mettre à jour les jauges de CO2 et NH3 et le graphique
async function updateGases() {
    var co2 = await getCO2();
    var nh3 = await getNH3();

    if (co2 !== null && nh3 !== null) {
        // Mettre à jour les jauges de CO2 et NH3
        co2Gauge.refresh(co2);
        nh3Gauge.refresh(nh3);
    }
}
// Fonction pour mettre à jour les jauges de CO2 et NH3 et le graphique
async function updatecharts() {
    var co2 = await getCO2();
    var nh3 = await getNH3();
    if (co2 !== null && nh3 !== null) {


        // Mettre à jour le graphique pour CO2 et NH3
        var now = new Date();
        var label = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        addData(gasChart, label, co2, nh3);
    }
}
// Fonction modifiée pour ajouter des données CO2 et NH3 au graphique
function addData(chart, label, co2Data, nh3Data) {
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
    }
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(co2Data);
    chart.data.datasets[1].data.push(nh3Data);
    chart.update();
}



// Continuez à mettre à jour les jauges et le graphique à intervalles réguliers
setInterval(updateGases, 5000);
setInterval(updatecharts, 30000);
 
updateGases();

updatecharts();




