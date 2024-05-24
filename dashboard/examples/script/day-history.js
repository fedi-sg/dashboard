const tempDate = document.getElementById('datetemp');
const humDate = document.getElementById('datehum');
const AirDate = document.getElementById('dateair');
async function initializeTemperatureChartWithDate(dateSelected) {
const userEmail = await fetchEmail();
const organizationName = await fetchOrganizationName(userEmail);
const apiUrl = `http://localhost:3000/api/sensor-data-hourly/${dateSelected}/${organizationName}`;

try {
const response = await fetch(apiUrl);
if (!response.ok) throw new Error('Failed to fetch data');

const hourlyData = await response.json();

if (!hourlyData.length) {
  alert('Aucune donnée trouvée pour cette date.');
  return;
}

const labels = hourlyData.map(data => `${data._id.hour}:00`);
const temperatures = hourlyData.map(data => data.avgTemperature);

temperatureChartt.data.labels = labels;
temperatureChartt.data.datasets[0].data = temperatures;
temperatureChartt.update();
} catch (error) {
console.error('Error initializing the chart:', error);
}
}

document.getElementById('datetemp').addEventListener('change', async function() {
const dateSelected = this.value;
initializeTemperatureChartWithDate(dateSelected);
});

