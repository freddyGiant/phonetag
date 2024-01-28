/**
 * TODO:
 * - decide position cache size (time (10s)? number of positions?)
 * - remember what i was gonna put here
 */

const socket = io();

/**
 * Track the user location and continuously get latitude and longitude.
 * @param {Object} onSuccess - Callback function to handle successful location tracking.
 */
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

// Example usage:
continuousLocation((lat, lng) => {
    // Do something with the latitude and longitude values
    console.log(`Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`);
});

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