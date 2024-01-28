 /**
 * Track the user location and continuously get latitude and longitude.
 * @param {Object} onSuccess - Callback function to handle successful location tracking.
 */

//  window.addEventListener("deviceorientation", (event) => {
//     console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
//   });
  
 const continuousLocation = onSuccess => {
    if ('geolocation' in navigator === false) {
    // Handle lack of geolocation support
    console.error('Geolocation is not supported by your browser.');
    return;
    }

    // Continuously watch the user's position and call the onSuccess callback with coordinates
    navigator.geolocation.watchPosition(
    ({ coords: { latitude: lat, longitude: lng } }) => {
        onSuccess(lat, lng);
    },
    error => {
        // Handle location tracking errors
        console.error('Error getting location /f continuous:', error.message || getPositionErrorMessage(error.code));
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
    );
};

const instantLocation = onSuccess => {
    if ('geolocation' in navigator === false) {
    // Handle lack of geolocation support
    console.error('Geolocation is not supported by your browser.');
    return;
    }

    // Continuously watch the user's position and call the onSuccess callback with coordinates
    navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lng } }) => {
        onSuccess(lat, lng);
    },
    error => {
        // Handle location tracking errors
        console.error('Error getting location f/ instant:', error.message || getPositionErrorMessage(error.code));
    },
    {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    }
    );
};

continuousLocation((lat, lng) => {
    console.log(`Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`);
});

// When tag button is clicked, get the current location and timestamp and convert to JSON
document.getElementById('tag').addEventListener('click', function() {
    instantLocation((lat, lng) => {
        console.log('Tag button clicked, time: ' + new Date().toISOString());
        const locationData = {
            latitude: lat.toFixed(5),
            longitude: lng.toFixed(5),
            timestamp: new Date().toISOString()
        };
        const jsonLocationData = JSON.stringify(locationData);
        console.log(`Tag button -- ${jsonLocationData}`);
    });
});


// // // Compass stuffs
function handleOrientation(event) {
    console.log("Measuring direction...")
    const compassDirection = event.alpha;
    console.log('Compass Direction:', compassDirection);
}

// if (window.DeviceOrientationEvent) {
//     console.log('DeviceOrientationEvent is supported')
//     window.addEventListener('deviceorientation', handleOrientation);
// } else {
//     console.log('DeviceOrientationEvent is not supported');
// }

if (typeof window.webkitCompassHeading!== "undefined") {
    alpha = window.webkitCompassHeading; //iOS non-standard
    var heading = alpha;
    console.log('Angle' + heading);
  }
else {
    alert("Your device is reporting relative alpha values, so this compass won't point north! ");
    alpha = window.webkitCompassHeading;
    var heading = 360 - alpha; //heading [0, 360)
    console.log('Angle' + heading);
}

if (window.DeviceOrientationAbsoluteEvent) {
    console.log("DeviceOrientationAbsoluteEvent is supported")
    window.addEventListener("DeviceOrientationAbsoluteEvent", handleOrientation);
} // If not, check if the device sends any orientation data
else if(window.DeviceOrientationEvent){
    console.log("DeviceOrientationEvent is supported")
    window.addEventListener("deviceorientation", handleOrientation);
} // Send an alert if the device isn't compatible
else {
  alert("Sorry, try again on a compatible mobile device!");
}
