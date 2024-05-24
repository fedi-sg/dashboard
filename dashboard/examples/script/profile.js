 function fetchEmail() {
    fetch('http://localhost:3000/get-email')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Now fetch user details after successfully fetching the email
        fetchUserDetails(data.email);
      })
      .catch(error => {
        console.error('Failed to fetch:', error);
      });
  }
  
  function fetchUserDetails(email) {
    if (!email) {
      console.error('No email provided for fetching user details');
      return; // Exit if no email is available
    }
    fetch(`http://localhost:3000/api/users/${email}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        return response.json();
      })
      .then(user => {
        fillFormData(user);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  function fillFormData(userData) {
    // Assurez-vous que les ID des éléments correspondent à ceux dans votre HTML
    document.getElementById('username').value = userData.username || '';
    document.getElementById('location').value = userData.location || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phoneNumber || ''; 
    document.getElementById('orgName').value = userData.organizationName || ''; 
    document.getElementById('firstName').value = userData.firstName || ''; 
    document.getElementById('lastName').value = userData.lastName || ''; 
  }
  
  document.addEventListener('DOMContentLoaded', fetchEmail);
