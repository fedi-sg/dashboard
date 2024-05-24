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
    async function getLuminosity() {
      try {
            
  const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
          const response = await fetch(`http://localhost:3000/api/luminosity/${organizationName}`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data.luminosity; // Assurez-vous que cela correspond à la structure de votre réponse JSON
      } catch (error) {
          console.error("Could not fetch luminosity level:", error);
          return null;
      }
  }
  
  async function updateLuminosity() {
      var luminosity = await getLuminosity();
  
      if (luminosity !== null) {
          // Mettre à jour la jauge de luminosité
          luminosityGauge.refresh(luminosity);
  
        
      }
  }
  // Mettre à jour la luminosité toutes les 5 secondes
  setInterval(updateLuminosity, 5000);
  