document.addEventListener('DOMContentLoaded', function() {
  const startDateInput = document.getElementById('startDate');
  const temperatureIdeal = document.querySelector('#environmentTable tr:nth-child(1) td:nth-child(3)');
  const lightHoursIdeal = document.querySelector('#environmentTable tr:nth-child(6) td:nth-child(3)');
  const humidityIdeal = document.querySelector('#environmentTable tr:nth-child(2) td:nth-child(3)');
  const ventilationIdeal = document.querySelector('#environmentTable tr:nth-child(5) td:nth-child(3)');

  startDateInput.addEventListener('change', function() {
    updateIdealConditions(new Date(startDateInput.value));
  });

  function updateIdealConditions(startDate) {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Update Temperature based on days
    if (diffDays <= 4) {
      temperatureIdeal.textContent = '35°-32°';
    } else if (diffDays <= 7) {
      temperatureIdeal.textContent = '32°-30°';
    } else if (diffDays <= 14) {
      temperatureIdeal.textContent = '30°';
    } else if (diffDays <= 21) {
      temperatureIdeal.textContent = '28°';
    } else if (diffDays <= 28) {
      temperatureIdeal.textContent = '26°';
    } else {
      temperatureIdeal.textContent = '21°-18°';
    }

    // Update Light Hours based on days
    if (diffDays <= 7) {
      lightHoursIdeal.textContent = '23H';
    } else if (diffDays <= 21) {
      lightHoursIdeal.textContent = '20H';
    } else {
      lightHoursIdeal.textContent = '19H';
    }

    // Update Humidity based on weeks
    let weeks = Math.floor(diffDays / 7);
    if (weeks <= 3) {
      humidityIdeal.textContent = '55-60%';
    } else if (weeks == 4) {
      humidityIdeal.textContent = '55-65%';
    } else {
      humidityIdeal.textContent = '60-70%';
    }

    // Update Ventilation based on weeks
    if (weeks == 1) {
      ventilationIdeal.textContent = '0.16 m3/H';
    } else if (weeks == 2) {
      ventilationIdeal.textContent = '0.42 m3/H';
    } else if (weeks == 3) {
      ventilationIdeal.textContent = '0.59 m3/H';
    } else if (weeks == 4) {
      ventilationIdeal.textContent = '0.84 m3/H';
    } else if (weeks == 5) {
      ventilationIdeal.textContent = '0.93 m3/H';
    } else if (weeks > 5) {
      ventilationIdeal.textContent = '1.18 m3/H';
    }
  }
});
