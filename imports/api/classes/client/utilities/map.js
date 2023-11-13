import mapboxgl from "mapbox-gl";

class map {
    /**
     * 
     * @param {string} id container id
     * @param {number} longitude longtitude coordinates for setting center of map in initialization
     * @param {number} latitude latitude coordinates for setting center of map in initialization
     * @returns {object} new mapbox 
     */
    initialize(id, longitude, latitude) {
        mapboxgl.accessToken = "pk.eyJ1IjoibnVjbGV1czA0IiwiYSI6ImNsbzNic29ycDE1ODAya28zY2RpdmdqbWcifQ.6Mlc0pRlwX5Ck2BkNrYS6A";
        return new mapboxgl.Map({
            container: id,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: 9,
        });
    }
    /**
     * this function return current location of user
     * @returns {Array} user coordinates
     */
    async getUserLocation() {
        if ('geolocation' in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve([longitude, latitude]);
                }, function (error) {
                    console.error('Error getting location:', error);
                });
            })
        } else {
            console.log("Navigastions is not supported");
        }
    }
}


export default new map;