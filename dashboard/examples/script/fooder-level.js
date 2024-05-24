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
    // Fonction pour récupérer le niveau de nourriture et la date de l'API
    async function getFooder() {
        try {
          const userEmail = await fetchEmail();
    const organizationName = await fetchOrganizationName(userEmail);
            const response = await fetch(`http://localhost:3000/api/fooder/${organizationName}`);
            if (!response.ok) {
                throw new Error('Network response was not ok for fooder');
            }
            const data = await response.json();
            // Assurez-vous que 'data' contient les champs 'fooder' et 'date'
            return {
              fooder: data.fooder, // Niveau de nourriture
              date: data.date // Date de la mesure
            };
        } catch (error) {
            console.error("Could not fetch fooder level:", error);
            return null; // Ou vous pourriez retourner un objet avec des valeurs par défaut
        }
    }
     // Fonction pour mettre à jour la jauge de nourriture
     async function updateFeederGauge() {
          var food = await getFooder();
          if (food !== null) {
              upddateTable(food.fooder);
              updatedateeTable(food.date);
    
          }
  
          if (food.fooder < 20) {
    const notificationId = 'f';
  
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
            const formFoodData = {
              email: email,
              date: new Date(),
              message: 'fooder level reached less than 20%',
              read: false,
              id: 'f'
            };
  
            // Create a new notification
            return fetch('http://localhost:3000/api/newnotification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formFoodData)
            });
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
          })
          .then(data => {
            showNotification('top', 'center', 'fooder level reached less than 20%');
            
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
         }    let fooderHistory = [];
      let Historyy = [];
      function updatedateeTable(temperature) {
      // Ajoute la nouvelle TEMPERATURE au début du tableau
      Historyy.unshift({ temperature });
      
      // Limite le tableau à 10 entrées
      if (Historyy.length > 10) Historyy.length = 10; // Garde uniquement les 10 premières entrées
    
      // Sélectionne l'élément du DOM pour le tableau historique
      let tableeBody = document.getElementById('Historry');
      
      // Réinitialise le contenu du tableau
      tableeBody.innerHTML = '';
      
      // Remplit le tableau avec les nouvelles données
      Historyy.forEach(entry => {
        let row = `<tr>
                      <td>${entry.temperature} </td>
                    </tr>`;
        tableeBody.innerHTML += row; // Ajoute la nouvelle entrée en haut du tableau
      });
    }
      function upddateTable(temperature) {
      // Ajoute la nouvelle TEMPERATURE au début du tableau
      fooderHistory.unshift({ temperature });
      
      // Limite le tableau à 10 entrées
      if (fooderHistory.length > 10) fooderHistory.length = 10; // Garde uniquement les 10 premières entrées
    
      // Sélectionne l'élément du DOM pour le tableau historique
      let tableBodyy = document.getElementById('fourrageHistory');
      
      // Réinitialise le contenu du tableau
      tableBodyy.innerHTML = '';
      
      // Remplit le tableau avec les nouvelles données
      fooderHistory.forEach(entry => {
        let row = `<tr>
                      <td>${entry.temperature} %</td>
                    </tr>`;
        tableBodyy.innerHTML += row; // Ajoute la nouvelle entrée en haut du tableau
      });
    }
  
     
    
      // Mettre à jour la jauge de nourriture dès le chargement de la page et toutes les 5 secondes
      setInterval(updateFeederGauge, 5000);
    