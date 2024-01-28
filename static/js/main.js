/**
 * TODO:
 * - decide position cache size (time (10s)? number of positions?)
 * - remember what i was gonna put here
 * - differentiate users (UUIDs?)
 */

const GEOLOCATION_RETRIES = 5;
const socket = io();
let status = "HEALTHY";

let username;

socket.on("getUserInfo", data => {
    data = JSON.parse(data)
    console.log(data)
    username = prompt("Enter your name:"); 
    console.log(username)
    response = JSON.stringify({
        id: data['id'], // save my id?
        displayName: username
    })

    socket.emit("register", response);
}) 

socket.on("youHaveBeenTagged", data => {
  tagger = JSON.parse(data).tagger;
  alert("You have been tagged by " + tagger);
  status = "INFECTED"
  document.getElementById('status').innerHTML = status;
  document.getElementById('status').style = `color: ${status == "INFECTED" ? "var(--red)" : "inherit"}`;
})

//  window.addEventListener("deviceorientation", (event) => {
//     console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
//   });

// Replace YOUR_API_KEY with your actual Google Geolocation API key
const apiKey = 'AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk';

// Endpoint for the Google Geolocation API
const apiUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk`;
console.log(apiUrl);

// async function getWifiInfo() {
//   try {
//     // Check if the browser supports the Wi-Fi scanning API
//     if ('wifi' in navigator) {
//       const wifiInfo = await navigator.wifi.getScanResults();
//       return wifiInfo;
//     } else {
//       throw new Error('Wi-Fi scanning not supported in this browser.');
//     }
//   } catch (error) {
//     console.error('Error getting Wi-Fi information:', error);
//     return [];
//   }
// }

// async function getCellTowerInfo() {
//   try {
//     // Check if the browser supports the connection API
//     if ('connection' in navigator && 'cellular' in navigator.connection) {
//       const cellInfo = navigator.connection.cellular;
//       return cellInfo;
//     } else {
//       throw new Error('Cell tower information not supported in this browser.');
//     }
//   } catch (error) {
//     console.error('Error getting cell tower information:', error);
//     return null;
//   }
// }

// async function assembleGeolocationRequestBody() {
//   const wifiInfo = await getWifiInfo();
//   const cellInfo = await getCellTowerInfo();

//   const requestBody = {
//     considerIp: false,
//     wifiAccessPoints: wifiInfo,
//     cellTowers: cellInfo ? [cellInfo] : [],
//   };

//   console.log('Geolocation API Request Body:', requestBody);
//   return requestBody;
// }

// // Call the function to assemble the Geolocation API request body
// assembleGeolocationRequestBody();

// Sample request payload with cell tower information
const requestBody = {
  "homeMobileCountryCode": 310,
  "homeMobileCode": 910,
  "considerIp": "true",
  "carrier": "Verizon Wireless",
  "radioType": "gsm",
  "wifiAccessPoints": [
    {
      "macAddress": "00:11:22:33:44:55",
      "signalStrength": -60,
      "signalToNoiseRatio": 40
    },
    // Add more Wi-Fi access points if needed
  ],
  "cellTowers": [
    // Add more cell towers if needed
  ]
};

socket.on("send_location", function() {
  console.log("Request for location was recieved.")
  // Assuming 'requestBody' is defined somewhere
  fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
  })
  .then(response => response.json())
  .then(data => {
      // Extract latitude, longitude, and accuracy from the response
      const latitude = data.location.lat;
      const longitude = data.location.lng;
      const accuracy = data.accuracy;

      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Accuracy:', accuracy);

      const response = JSON.stringify({lat: latitude, long: longitude, user: username});
      console.log(response)
      socket.emit("receive_location", response);
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('tag').addEventListener('click', function() {
  fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        // Extract latitude, longitude, and accuracy from the response
        const latitude = data.location.lat;
        const longitude = data.location.lng;
        const accuracy = data.accuracy;
          
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        console.log('Accuracy:', accuracy);

        response = JSON.stringify({lat: latitude, long: longitude, user: username})
        if (status == "INFECTED") {
          socket.emit("tag", response)  
        }
      })
      .catch(error => console.error('Error:', error));
});
     
document.getElementById('status').innerHTML = status;
document.getElementById('status').style.color = status === "INFECTED" ? "var(--red)" : "var(--default-content)";
document.getElementById('tag').style.backgroundColor = status === "INFECTED" ? "var(--red)" : "var(--default-content)";


