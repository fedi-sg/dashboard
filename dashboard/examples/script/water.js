  // Initialiser la jauge du niveau d'eau
  var waterLevelGauge = new JustGage({
      id: "water-level-gauge",
      value: 0,
      min: 0,
      max: 100,
      title: "Niveau d'Eau",
      label: "%",
      gaugeWidthScale: 0.6,
      levelColors: ["#3498db"],
      valueFontColor: "#E0E0E0",
      titleFontColor: "#E0E0E0",
      labelFontColor: "#E0E0E0",
  });
  var waterGauge = new JustGage({
      id: "water-gauge",
      value: 0,
      min: 0,
      max: 100,
      title: "Niveau d'Eau",
      label: "%",
      gaugeWidthScale: 0.6,
      levelColors: ["#3498db"],
      valueFontColor: "#E0E0E0",
      titleFontColor: "#E0E0E0",
      labelFontColor: "#E0E0E0",
  });

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
  // Fonction pour récupérer le niveau d'eau de l'API
  async function getWater() {
    const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
      try {

          const response = await fetch(`http://localhost:3000/api/water/${organizationName}`);
          if (!response.ok) {
              throw new Error('Network response was not ok for water');
          }
          const data = await response.json();
          return data.water;

      } catch (error) {
          console.error("Could not fetch water level:", error);
          return null;
      }
  }


var m=0;

  // Fonction pour mettre à jour la jauge d'eau
  async function updateWaterGauge() {
      var water = await getWater();
      if (water !== null) {
          waterLevelGauge.refresh(water);
          waterGauge.refresh(water);
         
  }}

  // Mettre à jour la jauge d'eau dès le chargement de la page et toutes les 5 secondes
  setInterval(updateWaterGauge, 5000);
