  document.getElementById('accountForm').addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const formData = {
          username: document.getElementById('username').value,
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          location: document.getElementById('location').value,
          email: document.getElementById('email').value,
          phoneNumber: document.getElementById('phone').value
      };
  
      // Fetch the user's email; this function should already handle its own errors
      fetchEmail().then(userEmail => {
          fetch(`http://localhost:3000/api/update-user/${userEmail}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to update account details');
              }
              return response.json();
          })
          .then(data => {
              alert('Account details updated successfully!');
          })
          .catch(error => {
              console.error('Error during update:', error);
              alert('Failed to update account details');
          });
      }).catch(error => {
          console.error('Error fetching email:', error);
          alert('Failed to fetch email, cannot update account');
      });
  });
  
  async function fetchEmail() {
      try {
          const response = await fetch('http://localhost:3000/get-email');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data.email; // Ensure that this is the correct path to the email in your API's response
      } catch (error) {
          console.error('Failed to fetch:', error);
          throw error; // Re-throw to be handled by the caller
      }
  }
