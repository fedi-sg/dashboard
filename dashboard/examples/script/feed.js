// Initialiser la jauge du niveau de fourrage
  var feedLevelGauge = new JustGage({
      id: "feed-level-gauge",
      value: 0,
      min: 0,
      max: 100,
      title: "Niveau de Fourrage",
      label: "%",
      gaugeWidthScale: 0.6,
      levelColors: ["#3498db"],
      valueFontColor: "#E0E0E0",
      titleFontColor: "#E0E0E0",
      labelFontColor: "#E0E0E0",
  });
    // Initialiser la jauge du niveau de fourrage
    var feedGauge = new JustGage({
      id: "feed-gauge",
      value: 0,
      min: 0,
      max: 100,
      title: "Niveau de Fourrage",
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
  // Fonction pour récupérer le niveau de nourriture de l'API
  async function getFooder() {
      try {
        const userEmail = await fetchEmail();
  const organizationName = await fetchOrganizationName(userEmail);
          const response = await fetch(`http://localhost:3000/api/fooder/${organizationName}`);
          if (!response.ok) {
              throw new Error('Network response was not ok for fooder');
          }
          const data = await response.json();
          return data;
      } catch (error) {
          console.error("Could not fetch fooder level:", error);
          return null;
      }
  }
  // Fonction pour mettre à jour la jauge de nourriture
  async function updateFeederGauge() {
      var food = await getFooder();
      if (food !== null) {
          feedLevelGauge.refresh(food.fooder);
          feedGauge.refresh(food.fooder);
      }
  }
  

  

  // Mettre à jour la jauge de nourriture dès le chargement de la page et toutes les 5 secondes
  setInterval(updateFeederGauge, 5000);
