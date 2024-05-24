
  async function fetchAndDisplayNotifications() {
    try {
      const emailResponse = await fetch('http://localhost:3000/get-email');
      if (!emailResponse.ok) {
        throw new Error('Failed to fetch email');
      }
      const emailData = await emailResponse.json();
      const userEmail = encodeURIComponent(emailData.email); // URL-encode the email

      if (!userEmail) {
        console.error('Email is undefined or empty');
        return; // Exit if no email is fetched
      }

      const response = await fetch(`http://localhost:3000/api/notifications/${userEmail}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notifications = await response.json();
      const container = document.getElementById('notification-container');
      container.innerHTML = '';

      notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('alert', 'alert-info', 'alert-with-icon');
        notificationElement.setAttribute('data-notify', 'container');

        const closeButton = document.createElement('button');
        closeButton.setAttribute('type', 'button');
        closeButton.classList.add('close');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.innerHTML = '<i class="tim-icons icon-simple-remove"></i>';

        closeButton.addEventListener('click', async function() {
          try {
            // Delete request includes the userEmail for additional security
            await fetch(`http://localhost:3000/notifications/${userEmail}/${notification._id}`, {
              method: 'DELETE'
            });
            notificationElement.remove();
          } catch (error) {
            console.error('Failed to delete notification:', error);
          }
        });

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('tim-icons', 'icon-bell-55');

        const messageSpan = document.createElement('span');
        messageSpan.textContent = notification.message;

        notificationElement.appendChild(closeButton);
        notificationElement.appendChild(iconSpan);
        notificationElement.appendChild(messageSpan);

        container.appendChild(notificationElement);
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  fetchAndDisplayNotifications();
