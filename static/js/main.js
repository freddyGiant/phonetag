 // Replace YOUR_API_KEY with your actual Google Geolocation API key
const apiKey = 'AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk';

// Endpoint for the Google Geolocation API
const apiUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
console.log(apiUrl);

// Sample request payload with cell tower information
const requestBody = {
  "considerIp": "true",
  "wifiAccessPoints": [
    {
      "macAddress": "00:11:22:33:44:55",
      "signalStrength": -60,
      "signalToNoiseRatio": 40
    },
    // Add more Wi-Fi access points if needed
  ],
  "cellTowers": [
    {
      "cellId": 123456789,
      "locationAreaCode": 987,
      "mobileCountryCode": 310,
      "mobileNetworkCode": 260,
      "signalStrength": -70
    },
    // Add more cell towers if needed
  ]
};

// function for getting location and printing to console
document.getElementById('tag').addEventListener('click', function() {
    fetch(apiUrl, {
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
          document.getElementById('latitude').innerHTML = `Latitude: ${latitude}`;
          console.log('Longitude:', longitude);
          document.getElementById('longitude').innerHTML = `Longitude: ${longitude}`;
          console.log('Accuracy:', accuracy);
          document.getElementById('accuracy').innerHTML = `Accuracy: ${accuracy}`;
        })
        .catch(error => console.error('Error:', error));
});
{
    fetch(apiUrl, {
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
        })
        .catch(error => console.error('Error:', error));
}

 
 
//  /**
//  * Track the user location and continuously get latitude and longitude.
//  * @param {Object} onSuccess - Callback function to handle successful location tracking.
//  */

// //  window.addEventListener("deviceorientation", (event) => {
// //     console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
// //   });
  
//  const continuousLocation = onSuccess => {
//     if ('geolocation' in navigator === false) {
//     // Handle lack of geolocation support
//     console.error('Geolocation is not supported by your browser.');
//     return;
//     }

//     // Continuously watch the user's position and call the onSuccess callback with coordinates
//     navigator.geolocation.watchPosition(
//     ({ coords: { latitude: lat, longitude: lng } }) => {
//         onSuccess(lat, lng);
//     },
//     error => {
//         // Handle location tracking errors
//         console.error('Error getting location /f continuous:', error.message || getPositionErrorMessage(error.code));
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//     }
//     );
// };

// const instantLocation = onSuccess => {
//     if ('geolocation' in navigator === false) {
//     // Handle lack of geolocation support
//     console.error('Geolocation is not supported by your browser.');
//     return;
//     }

//     // Continuously watch the user's position and call the onSuccess callback with coordinates
//     navigator.geolocation.getCurrentPosition(
//     ({ coords: { latitude: lat, longitude: lng } }) => {
//         onSuccess(lat, lng);
//     },
//     error => {
//         // Handle location tracking errors
//         console.error('Error getting location f/ instant:', error.message || getPositionErrorMessage(error.code));
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: Infinity,
//         maximumAge: 0
//     }
//     );
// };

// continuousLocation((lat, lng) => {
//     console.log(`Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`);
//     document.getElementById('continuous').innerHTML = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
// });

// // When tag button is clicked, get the current location and timestamp and convert to JSON
// document.getElementById('tag').addEventListener('click', function() {
//     instantLocation((lat, lng) => {
//         console.log('Tag button clicked, time: ' + new Date().toISOString());
//         const locationData = {
//             latitude: lat.toFixed(5),
//             longitude: lng.toFixed(5),
//             timestamp: new Date().toISOString()
//         };
//         const jsonLocationData = JSON.stringify(locationData);
//         console.log(`Tag button -- ${jsonLocationData}`);
//         document.getElementById('tag_text').innerHTML = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
//     });
// });


// // // // Compass stuffs
// function handleOrientation(event) {
//     console.log("Measuring direction...")
//     const compassDirection = event.alpha;
//     console.log('Compass Direction:', compassDirection);
//     document.getElementById('direction').innerHTML = `Compass: ${compassDirection}`;
// }

// // if (window.DeviceOrientationEvent) {
// //     console.log('DeviceOrientationEvent is supported')
// //     window.addEventListener('deviceorientation', handleOrientation);
// // } else {
// //     console.log('DeviceOrientationEvent is not supported');
// // }

// if (typeof window.webkitCompassHeading!== "undefined") {
//     alpha = window.webkitCompassHeading; //iOS non-standard
//     var heading = alpha;
//     console.log('Angle' + heading);
//     document.getElementById('compass').innerHTML = `Compass: ${heading}`;
//   }
// else {
//     alert("Your device is reporting relative alpha values, so this compass won't point north! ");
//     alpha = window.webkitCompassHeading;
//     var heading = 360 - alpha; //heading [0, 360)
//     console.log('Angle' + heading);
//     document.getElementById('compass').innerHTML = `Compass: ${heading}`;
// }

// if (window.DeviceOrientationAbsoluteEvent) {
//     console.log("DeviceOrientationAbsoluteEvent is supported")
//     window.addEventListener("DeviceOrientationAbsoluteEvent", handleOrientation);
// } // If not, check if the device sends any orientation data
// else if(window.DeviceOrientationEvent){
//     console.log("DeviceOrientationEvent is supported")
//     window.addEventListener("deviceorientation", handleOrientation);
// } // Send an alert if the device isn't compatible
// else {
//   alert("Sorry, try again on a compatible mobile device!");
// }
