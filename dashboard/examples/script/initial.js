window.onload = async () => {
    // Supposer que `fetchEmail` et `fetchOrganizationName` sont des fonctions définies pour obtenir l'email de l'utilisateur et le nom de l'organisation.
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
    initializeTemperatureChart(`http://localhost:3000/api/temperatures/5min/${organizationName}`);
    initializeTemperatureChartt(`http://localhost:3000/api/temperatures/5min/${organizationName}`);
    initializeHumidityChart(`http://localhost:3000/api/humidities/5min/${organizationName}`);
    initializeHumidityChartt(`http://localhost:3000/api/humidities/5min/${organizationName}`);
    await fetchDataAndUpdate(); 
    // Initialisation du graphique avec des données actualisées toutes les 5 minutes.
    initializeChart(`http://localhost:3000/api/co2s/5min/${organizationName}`, `http://localhost:3000/api/nh3s/5min/${organizationName}`);
};