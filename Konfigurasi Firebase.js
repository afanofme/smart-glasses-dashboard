// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dataRef = database.ref('data');  // Path di Firebase untuk data

// Inisialisasi Chart.js
const ctx = document.getElementById('distanceChart').getContext('2d');
const distanceChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],  // Waktu (s)
    datasets: [{
      label: 'Jarak (cm)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Waktu (detik)' } },
      y: { title: { display: true, text: 'Jarak (cm)' }, min: 0, max: 200 }
    }
  }
});

// Fetch data real-time dari Firebase
dataRef.on('value', (snapshot) => {
  const data = snapshot.val();
  const times = [];
  const distances = [];
  const logList = document.getElementById('eventLog');
  logList.innerHTML = '';  // Clear log sebelum update

  if (data) {
    Object.values(data).sort((a, b) => a.timestamp - b.timestamp).forEach(item => {
      times.push(item.timestamp);
      distances.push(item.distance);

      // Tambah ke event log jika ada event
      if (item.event) {
        const li = document.createElement('li');
        li.textContent = `${new Date(item.timestamp * 1000).toLocaleString()}: ${item.event} (Jarak: ${item.distance} cm)`;
        logList.appendChild(li);
      }
    });

    // Update chart
    distanceChart.data.labels = times;
    distanceChart.data.datasets[0].data = distances;
    distanceChart.update();
  }
});