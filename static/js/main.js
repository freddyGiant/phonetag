/**
 * TODO:
 * - decide position cache size (time (10s)? number of positions?)
 * - remember what i was gonna put here
 * - differentiate users (UUIDs?)
 */

const GEOLOCATION_RETRIES = 5;
const socket = io();
var name = null;

socket.on("getUserInfo", data => {
    data = JSON.parse(data)
    console.log(data)
    name = prompt("Enter your name:"); 
    console.log(name)
    response = JSON.stringify({
        id: data['id'], // save my id?
        displayName: name
    })

    socket.emit("register", response);
}) 

//  window.addEventListener("deviceorientation", (event) => {
//     console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
//   });

 // Replace YOUR_API_KEY with your actual Google Geolocation API key
 const apiKey = 'AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk';

 // Endpoint for the Google Geolocation API
 const apiUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCOzg3e1FKHyOl9lUcvCHpozFOyfav1Vpk`;
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

        const response = JSON.stringify({lat: latitude, long: longitude});
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

          response = JSON.stringify({lat: latitude, long: longitude})
          socket.emit("tag", response)  

        })
        .catch(error => console.error('Error:', error));
});
     
 
 
 






// /**
//  * Track the user location and continuously get latitude and longitude.
//  * @param {Object} onSuccess - Callback function to handle successful location tracking.
//  */

//  const continuousLocation = onSuccess => {
//     if ('geolocation' in navigator === false) {
//         // Handle lack of geolocation support
//         console.error('Geolocation is not supported by your browser.');
//         return;
//     }

//     // Continuously watch the user's position and call the onSuccess callback with coordinates
//     navigator.geolocation.watchPosition(
//         ({ coords: { latitude: lat, longitude: lng } }) => {
//             onSuccess(lat, lng);
//         },
//         error => {
//             // Handle location tracking errors
//             console.error('Error getting location /f continuous:', error.message || getPositionErrorMessage(error.code));
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0
//         }
//     );
// };

// // TODO: rename to getPosition()?
// const instantLocation = async (retries, delay) => new Promise((resolve, reject) => {
//     console.log(`Getting location. Retries left: ${retries}`);
//     if(retries <= 0) {
//         reject(`Unable to retrieve location.`);
//     }
//     navigator.geolocation.getCurrentPosition(
//         position => {
//             console.log(`Location retrieved.`);
//             resolve(position);
//         },
//         async error => {
//             console.error(`Error getting location: ${error.message}`);
//             await new Promise(r => setTimeout(r, delay));
//             instantLocation(retries - 1, delay);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 10 * 1000,
//             maximumAge: 0
//         }
//     );
// });

// const tag = async () => {
//     console.log('Tag button clicked at');
  
//     const currentTime = new Date().now();
    
//     const geoposition = await instantLocation(GEOLOCATION_RETRIES, 100);
//     // TODO: get iphone heading information
//     const locationData = {
//         latitude: geoposition.coords.latitude.toFixed(5),
//         longitude: geoposition.coords.longitude.toFixed(5),
//         timestamp: currentTime
//     };
    
//     console.log(`Emitting location data...`);
//     socket.emit('tag', locationData);
// }

// // cross-platform logic:
// // if (typeof window.webkitCompassHeading!== "undefined") {
// //     alpha = window.webkitCompassHeading; //iOS non-standard
// //     var heading = alpha;
// //     console.log('Angle' + heading);
// //     document.getElementById('compass').innerHTML = `Compass: ${heading}`;
// //   }
// // else {
// //     alert("Your device is reporting relative alpha values, so this compass won't point north! ");
// //     alpha = window.webkitCompassHeading;
// //     var heading = 360 - alpha; //heading [0, 360)
// //     console.log('Angle' + heading);
// //     document.getElementById('compass').innerHTML = `Compass: ${heading}`;
// // }

// // // // Compass stuffs
// const handleOrientation = event => {
//     console.log("Measuring direction...")
//     const compassDirection = event.alpha;
//     console.log('Compass Direction:', compassDirection);
//     document.getElementById('direction').innerHTML = `Compass: ${compassDirection}`;
// }

// const main = () => {
//     if (!('geolocation' in navigator)) {
//         console.error('Longitude/latitude data is not supported by your browser.');
//         return;
//     }
    
//     document.getElementById('tag').addEventListener('click', tag);
  
//     if (window.DeviceOrientationAbsoluteEvent) {
//         console.log("DeviceOrientationAbsoluteEvent is supported")
//         window.addEventListener("DeviceOrientationAbsoluteEvent", handleOrientation);
//     }
//     else if(window.DeviceOrientationEvent){
//         console.log("DeviceOrientationEvent is supported")
//         window.addEventListener("deviceorientation", handleOrientation);
//     }
//     else {
//       alert('Heading data is not supported by your browser.');
//       return;
//     }
// };

// main();


