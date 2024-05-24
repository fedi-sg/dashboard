// Initialiser le graphique de température avec Chart.js
const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(temperatureCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Température (°C)',
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            data: []
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 50,
                suggestedMin: -10
            }
        }
    }
});

const temperatureCtxx = document.getElementById('temperatureChartt').getContext('2d');
const temperatureChartt = new Chart(temperatureCtxx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Température (°C)',
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            data: []
        },
        {
            label: 'normal',
            backgroundColor: '#0fffdf',
            borderColor: '#0fffdf',
            data: []
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 50,
                suggestedMin: -10
            }
        },
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    }
});


document.getElementById('0').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChartt(`http://localhost:3000/api/temperatures/5min/${organizationName}`);
});

document.getElementById('1').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChartt(`http://localhost:3000/api/temperatures/day/${organizationName}`);
});

document.getElementById('2').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChartt(`http://localhost:3000/api/temperatures/week/${organizationName}`);
});

document.getElementById('16').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChart(`http://localhost:3000/api/temperatures/5min/${organizationName}`);
});

document.getElementById('17').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChart(`http://localhost:3000/api/temperatures/day/${organizationName}`);
});

document.getElementById('18').addEventListener('click', async function() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChart(`http://localhost:3000/api/temperatures/week/${organizationName}`);
});

let tempHistory = [];

function updateeTable(date, temperature) {
    tempHistory.unshift({ date, temperature });
    if (tempHistory.length > 10) tempHistory.length = 10;

    let tableBody = document.getElementById('tempHistory');
    tableBody.innerHTML = '';

    tempHistory.forEach(entry => {
        let row = `<tr>
                    <td>${new Date(entry.date).toLocaleTimeString()}</td>
                    <td>${entry.temperature} °C</td>
                  </tr>`;
        tableBody.innerHTML += row;
    });
}

async function initializeTemperatureChartt(apiUrl) {
    temperatureChartt.data.labels = [];
    temperatureChartt.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const temperatures = await response.json();
        const latestTemperatures = temperatures.slice(-10);

        latestTemperatures.forEach(entry => {
            const time = new Date(entry.date);
            var label = `${time.getHours()}:${time.getMinutes()}`;
            temperatureChartt.data.labels.push(label);
            temperatureChartt.data.datasets[0].data.push(entry.temperature);
            updateeTable(entry.date, entry.temperature);
        });

        temperatureChartt.update();
    } catch (error) {
        console.error("Error initializing the chart with URL " + apiUrl + ":", error);
    }
}

async function initializeTemperatureChart(apiUrl) {
    temperatureChart.data.labels = [];
    temperatureChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const temperatures = await response.json();
        const latestTemperatures = temperatures.slice(-10);

        latestTemperatures.forEach(entry => {
            const time = new Date(entry.date);
            var label = `${time.getHours()}:${time.getMinutes()}`;
            temperatureChart.data.labels.push(label);
            temperatureChart.data.datasets[0].data.push(entry.temperature);
        });

        temperatureChart.update();
    } catch (error) {
        console.error("Error initializing the chart with URL " + apiUrl + ":", error);
    }
}

async function fetchEmail() {
    try {
        const response = await fetch('http://localhost:3000/get-email');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        return data.email;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
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

async function updateTemperature() {
    try {
        const userEmail = await fetchEmail();
        const organizationName = await fetchOrganizationName(userEmail);
        const response = await fetch(`http://localhost:3000/api/temperature/${organizationName}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        var temperature = data.temperature;

        if (temperature > 36) {
            temperatureChartt.data.datasets[1].label = 'anormal';
            temperatureChartt.data.datasets[1].backgroundColor = '#ff0000';
            temperatureChartt.data.datasets[1].borderColor = '#ff0000';
        } else {
            temperatureChartt.data.datasets[1].label = 'normal';
            temperatureChartt.data.datasets[1].backgroundColor = '#32CD32';
            temperatureChartt.data.datasets[1].borderColor = '#32CD32';
        }

        tempGauge.refresh(temperature);
        tempGaug.refresh(temperature);
        var now = new Date();
        var label = `${now.getHours()}:${now.getMinutes()}`;
        temperatureChart.data.labels.push(label);
        updateeTable(data.date, data.temperature);
        temperatureChart.data.datasets.forEach((dataset) => {
            dataset.data.push(temperature);
        });
        temperatureChartt.data.labels.push(label);
        temperatureChartt.data.datasets.forEach((dataset) => {
            dataset.data.push(temperature);
        });

        if (temperatureChart.data.labels.length > 10) {
            temperatureChart.data.labels.shift();
            temperatureChart.data.datasets.forEach((dataset) => {
                dataset.data.shift();
            });
        }
        temperatureChart.update();

        if (temperatureChartt.data.labels.length > 10) {
            temperatureChartt.data.labels.shift();
            temperatureChartt.data.datasets.forEach((dataset) => {
                dataset.data.shift();
            });
        }
        temperatureChartt.update();

        if (temperature > 40) {
            const notificationId = 't';
            const email = await fetchEmail();

            const checkNotificationUrl = `http://localhost:3000/api/check-notification/${email}/${notificationId}`;
            const checkResponse = await fetch(checkNotificationUrl);
            const checkResult = await checkResponse.json();

            if (!checkResult.exists) {
                const formtempData = {
                    email: email,
                    date: new Date(),
                    message: `Temperature level reached ${temperature}° which is higher than 40°`,
                    read: false,
                    id: notificationId
                };

                const createNotificationUrl = 'http://localhost:3000/api/newnotification';
                const createResponse = await fetch(createNotificationUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formtempData)
                });

                if (!createResponse.ok) throw new Error(`Network response was not ok: ${createResponse.statusText}`);
                
                showNotification('top', 'center', `Temperature level reached ${temperature}°`);
                sendDangerAlert(email, `Temperature level reached ${temperature}°`);
            }
        }
    } catch (error) {
        console.error('Failed to fetch temperature:', error);
    }
}


async function updategaugeTemperature() {
    try {
        const userEmail = await fetchEmail();
        const organizationName = await fetchOrganizationName(userEmail);
        const response = await fetch(`http://localhost:3000/api/temperature/${organizationName}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const temperature = data.temperature;

        tempGauge.refresh(temperature);
        tempGaug.refresh(temperature);

        if (temperature > 40) {
            const notificationId = 't';
            const email = await fetchEmail();

            const checkNotificationUrl = `http://localhost:3000/api/check-notification/${email}/${notificationId}`;
            const checkResponse = await fetch(checkNotificationUrl);
            const checkResult = await checkResponse.json();

            if (!checkResult.exists) {
                const formtempData = {
                    email: email,
                    date: new Date(),
                    message: `Temperature level reached ${temperature}° which is higher than 40°`,
                    read: false,
                    id: notificationId
                };

                const createNotificationUrl = 'http://localhost:3000/api/newnotification';
                const createResponse = await fetch(createNotificationUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formtempData)
                });

                if (!createResponse.ok) throw new Error(`Network response was not ok: ${createResponse.statusText}`);
                
                showNotification('top', 'center', `Temperature level reached ${temperature}°`);
                sendDangerAlert(email, `Temperature level reached ${temperature}°`);
            }
        }
    } catch (error) {
        console.error('Failed to fetch temperature:', error);
    }
}

// Mettre à jour la température toutes les 5 min
setInterval(updateTemperature, 300000);
// Mettre à jour la jauge de température toutes les 5 secondes
setInterval(updategaugeTemperature, 5000);

// Appel initial pour mettre à jour dès le chargement de la page
updateTemperature();
updategaugeTemperature();
