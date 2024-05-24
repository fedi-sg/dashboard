
let humidityHistory = [];

var ctxx = document.getElementById('humidityChartt').getContext('2d');
var humidityChartt = new Chart(ctxx, {
 type: 'line',
 data: {
     labels: [], // Placeholder for labels (e.g., time intervals)
     datasets: [{
         label: 'Humidity (%)',
         backgroundColor: 'rgba(54, 162, 235, 0.2)',
         borderColor: 'rgba(54, 162, 235, 1)',
         data: [] // Placeholder for data points
     },
     {
         label: '   normal',
         backgroundColor: '#0fffdf' ,
         borderColor: '#0fffdf',
     }]
 },
 options: {
     scales: {
         y: { // Corrected from y: [{}] to y: {}
             ticks: {
                 beginAtZero: true,
                 suggestedMax: 100
             }
         }
     },
     legend: {
         labels: {
           usePointStyle: true  //<-- set this
         }
     }
 }
});

 // Initialiser le graphique d'humidité avec Chart.js
 var ctx = document.getElementById('humidityChart').getContext('2d');
 var humidityChart = new Chart(ctx, {
     type: 'line',
     data: {
         labels: [],
         datasets: [{
             label: 'Humidity (%)',
             backgroundColor: 'rgba(54, 162, 235, 0.2)',
             borderColor: 'rgba(54, 162, 235, 1)',
             data: []
         }]
     },
     options: {
         scales: {
             y: [{
                 ticks: {
                     beginAtZero: true,
                     suggestedMax: 100
                 }
             }]
         }
     }
 });

// Event listeners for time frame buttons
document.getElementById('4').addEventListener('click',async function() {
   
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
 initializeHumidityChart(`http://localhost:3000/api/humidities/5min/${organizationName}`);
});
document.getElementById('5').addEventListener('click',async function() {
   
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
 initializeHumidityChart(`http://localhost:3000/api/humidities/day/${organizationName}`);
});
document.getElementById('6').addEventListener('click',async function() {
   
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
 initializeHumidityChart(`http://localhost:3000/api/humidities/week/${organizationName}`);
});
document.getElementById('16').addEventListener('click',async function() {
   
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
initializeHumidityChartt(`http://localhost:3000/api/humidities/5min/${organizationName}`);
});
document.getElementById('17').addEventListener('click',async function() {
     
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
 initializeHumidityChartt(`http://localhost:3000/api/humidities/day/${organizationName}`);
});
document.getElementById('18').addEventListener('click',async function() {
     
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
 initializeHumidityChartt(`http://localhost:3000/api/humidities/week/${organizationName}`);
});

function updateTable(date, humidity) {
 humidityHistory.unshift({ date, humidity });
 if (humidityHistory.length > 10) humidityHistory.length = 10;

 let tableBody = document.getElementById('humidityHistory');
 tableBody.innerHTML = '';
 humidityHistory.forEach(entry => {
     let row = `<tr>
         <td>${new Date(entry.date).toLocaleTimeString()}</td>
         <td>${entry.humidity} %</td>
     </tr>`;
     tableBody.innerHTML += row;
 });
}
async function initializeHumidityChart(apiUrl) {
 try {
     const response = await fetch(apiUrl);
     if (!response.ok) {
         throw new Error('Network response was not ok');
     }
     const humidities = await response.json();
     const latestHumidities = humidities.slice(-10);


     humidityChartt.data.labels = [];
     humidityChartt.data.datasets[0].data = [];
     
     latestHumidities.forEach(entry => {
         const time = new Date(entry.date);
         const label = `${time.getHours()}:${time.getMinutes()}`;

         humidityChartt.data.labels.push(label);
         humidityChartt.data.datasets[0].data.push(entry.humidity);
         updateTable(entry.date, entry.humidity);
     });

     humidityChartt.update();
 } catch (error) {
     console.error("Error initializing the humidity chart:", error);
 }
}


async function initializeHumidityChartt(apiUrl) {
 try {
     const response = await fetch(apiUrl);
     if (!response.ok) {
         throw new Error('Network response was not ok');
     }
     const humidities = await response.json();
     const latestHumidities = humidities.slice(-10);

     humidityChart.data.labels = [];
     humidityChart.data.datasets[0].data = [];

     
     latestHumidities.forEach(entry => {
         const time = new Date(entry.date);
         const label = `${time.getHours()}:${time.getMinutes()}`;
         humidityChart.data.labels.push(label);
         humidityChart.data.datasets[0].data.push(entry.humidity);

     });

     humidityChart.update();
 } catch (error) {
     console.error("Error initializing the humidity chart:", error);
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
var h=0;
// Fonction pour récupérer la dernière valeur d'humidité de l'API et mettre à jour la jauge et le graphique
async function updateHumidity() {
     try {
       const userEmail = await fetchEmail();
       const organizationName = await fetchOrganizationName(userEmail);
         const response = await fetch(`http://localhost:3000/api/humidity/${organizationName}`);
         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         const data = await response.json();

         // Assurez-vous que la clé dans votre réponse JSON correspond à 'humidity'
         var humidity = data.humidity;
         if (humidity>80){
           humidityChartt.data.datasets[1].label='anormal';
           humidityChartt.data.datasets[1].backgroundColor='#ff0000';
           humidityChartt.data.datasets[1].borderColor='#ff0000';

     }else{
       humidityChartt.data.datasets[1].label='normal';
       humidityChartt.data.datasets[1].backgroundColor='#32CD32';
       humidityChartt.data.datasets[1].borderColor='#32CD32';
     }

         var now = new Date();
         var label = `${now.getHours()}:${now.getMinutes()}`;
         humidityChart.data.labels.push(label);
         humidityChart.data.datasets.forEach((dataset) => {
             dataset.data.push(humidity);
         });
         humidityChartt.data.labels.push(label);
         humidityChartt.data.datasets.forEach((dataset) => {
             dataset.data.push(humidity);
         });
         if (humidityChart.data.labels.length >= 10) {
             humidityChart.data.labels.shift();
             humidityChart.data.datasets.forEach((dataset) => {
                 dataset.data.shift();
             });
             humidityChartt.data.labels.shift();
             humidityChartt.data.datasets.forEach((dataset) => {
                 dataset.data.shift();
             });
         }
         humidityChart.update();
         humidityChartt.update();
         updateTable(data.date, data.humidity);

     } catch (error) {
         console.error('Failed to fetch humidity:', error);
     }
     if (humidity > 80) {
const notificationId = 'h';

function fetchEmaill() {
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

fetchEmaill().then(email => {
 // Include email in the check for an existing notification
 fetch(`http://localhost:3000/api/check-notification/${email}/${notificationId}`)
   .then(response => response.json())
   .then(result => {
     if (!result.exists) {
       const formhumidityData = {
         date: new Date(),
         message: 'humidity level reached better than 80%',
         read: false,
         email: email,
         id: 'h'
       };

       // Create a new notification
       return fetch('http://localhost:3000/api/newnotification', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(formhumidityData)
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
       showNotification('top', 'center', 'humidity level reached better than 80%');
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
}
async function updategaugeHumidity() {
    try {
      const userEmail = await fetchEmail();
      const organizationName = await fetchOrganizationName(userEmail);
        const response = await fetch(`http://localhost:3000/api/humidity/${organizationName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Assurez-vous que la clé dans votre réponse JSON correspond à 'humidity'
        var humidity = data.humidity;

        humidityGauge.refresh(humidity);
        humidityGaug.refresh(humidity);


    } catch (error) {
        console.error('Failed to fetch humidity:', error);
    }
    if (humidity > 80) {
const notificationId = 'h';

function fetchEmaill() {
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

fetchEmaill().then(email => {
// Include email in the check for an existing notification
fetch(`http://localhost:3000/api/check-notification/${email}/${notificationId}`)
  .then(response => response.json())
  .then(result => {
    if (!result.exists) {
      const formhumidityData = {
        date: new Date(),
        message: 'humidity level reached better than 80%',
        read: false,
        email: email,
        id: 'h'
      };

      // Create a new notification
      return fetch('http://localhost:3000/api/newnotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formhumidityData)
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
      showNotification('top', 'center', 'humidity level reached better than 80%');
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
}

 // Mettre à jour l'humidité toutes les 5 min
 setInterval(updateHumidity, 300000);
  // Mettre à jour l'humidité toutes les 5 secondes
 setInterval(updategaugeHumidity, 5000);
 // Appel initial pour mettre à jour dès le chargement de la page
 updateHumidity();
 updategaugeHumidity();
