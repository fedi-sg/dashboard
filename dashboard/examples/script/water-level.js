async  function fetchEmailll() {
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
async function fetcheOrganizationName(email) {
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
      try {
        const userEmail = await fetchEmailll();
  const organizationName = await fetcheOrganizationName(userEmail);
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

      if (data.water < 20) {
  const notificationId = 'w';

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
          const formWaterData = {
            email: email,
            date: new Date(),
            message: 'water level reached less than 20%',
            read: false,
            id: 'w'
          };

          // Create a new notification
          return fetch('http://localhost:3000/api/newnotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formWaterData)
          });
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.text();
        })
        .then(data => {
          showNotification('top', 'center', 'water level reached less than 20%');
          
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


  }
  
  
  // Fonction pour mettre à jour la jauge d'eau
  async function updateWaterGauge() {
      var water = await getWater();
      if (water !== null) {
          updatewaterTable(water);
      }
  }
  let waterHistory = [];
  
  function updatewaterTable(temperature) {
  
  // Ajoute la nouvelle TEMPERATURE au début du tableau
  waterHistory.unshift({ temperature });
  
  // Limite le tableau à 10 entrées
  if (waterHistory.length > 10) waterHistory.length = 10; // Garde uniquement les 10 premières entrées
  
  // Sélectionne l'élément du DOM pour le tableau historique
  let tableBody = document.getElementById('waterHistory');
  
  // Réinitialise le contenu du tableau
  tableBody.innerHTML = '';
  
  // Remplit le tableau avec les nouvelles données
  waterHistory.forEach(entry => {
    let row = `<tr>
                  <td>${entry.temperature} %</td>
                </tr>`;
    tableBody.innerHTML += row; // Ajoute la nouvelle entrée en haut du tableau
  });
  }

  
  // Mettre à jour la jauge d'eau dès le chargement de la page et toutes les 5 secondes
  setInterval(updateWaterGauge, 5000);
  