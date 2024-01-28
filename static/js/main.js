/**
 * TODO:
 * - decide position cache size (time (10s)? number of positions?)
 * - remember what i was gonna put here
 * - differentiate users (UUIDs?)
 */

const GEOLOCATION_RETRIES = 5;
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

// TODO: rename to getPosition()?
const instantLocation = async (retries, delay) => new Promise((resolve, reject) => {
    console.log(`Getting location. Retries left: ${retries}`);
    if(retries <= 0) {
        reject(`Unable to retrieve location.`);
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(`Location retrieved.`);
            resolve(position);
        },
        async error => {
            console.error(`Error getting location: ${error.message}`);
            await new Promise(r => setTimeout(r, delay));
            instantLocation(retries - 1, delay);
        },
        {
            enableHighAccuracy: true,
            timeout: 10 * 1000,
            maximumAge: 0
        }
    );
});

document.getElementById('tag').addEventListener('click', async () => {
    console.log('Tag button clicked.');
    
    const currentTime = new Date().now();
    
    const geoposition = await instantLocation(GEOLOCATION_RETRIES, 100);
    // TODO: get iphone heading information
    const locationData = {
        latitude: geoposition.coords.latitude.toFixed(5),
        longitude: geoposition.coords.longitude.toFixed(5),
        timestamp: currentTime
    };
    
    console.log(`Emitting location data...`);
    socket.emit('tag', locationData);
});

const main = () => {
    if (!('geolocation' in navigator)) {
        console.error('Geolocation is not supported by your browser.');
        return;
    }
    
    // navigator.geolocation.getCurrentPosition(
    //     position => {
    //         console.log('GOD DAMNIT YOU PIECE OF SHIT');
    //     },
    //     error => {},
    // );
};

main();