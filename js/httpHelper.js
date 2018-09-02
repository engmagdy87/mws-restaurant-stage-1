// import idb from "./idb.js";

/**
 * Common database helper functions.
 */
class HttpHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get getRestaurants() {
    const domain = "localhost"; // Change this to your domain
    const port = 1337; // Change this to your server port
    return `http://${domain}:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return new Promise((resolve, reject) => {
      fetch(HttpHelper.getRestaurants)
        .then(res => res.json())
        .then(data => {
          HttpHelper.saveInIDB(data);
          resolve(data);
        })
        .catch(() => {
          const dbPromise = idb.open("restaurants-store", 1, () => {});
          dbPromise
            .then(db => {
              let tx = db.transaction("restaurants");
              let store = tx.objectStore("restaurants");

              return store.getAll();
            })
            .then(restaurants => {
              resolve(restaurants);
            })
            .catch(err => reject(`Request failed. Returned status of ${err}`));
        });
    });
  }

  static saveInIDB(data) {
    const dbPromise = idb.open("restaurants-store", 1, upgradeDB => {
      upgradeDB.createObjectStore("restaurants", { keyPath: "id" });
    });
    dbPromise
      .then(db => {
        let tx = db.transaction("restaurants", "readwrite");
        let store = tx.objectStore("restaurants");

        data.map(restaurant => store.put(restaurant));

        return tx.complete;
      })
      .then(() => {
        console.log("finish writing data");
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          const restaurant = res.find(r => r.id == id);

          if (restaurant) {
            // Got the restaurant
            resolve(restaurant);
          } else {
            // Restaurant does not exist in the database
            resolve("Restaurant does not exist");
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          // Filter restaurants to have only given cuisine type
          const results = restaurants.filter(r => r.cuisine_type == cuisine);
          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          // Filter restaurants to have only given cuisine type
          const results = restaurants.filter(
            r => r.neighborhood == neighborhood
          );
          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          let results = res;
          if (cuisine != "all") {
            // filter by cuisine
            results = results.filter(r => r.cuisine_type == cuisine);
          }
          if (neighborhood != "all") {
            // filter by neighborhood
            results = results.filter(r => r.neighborhood == neighborhood);
          }
          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          // Get all neighborhoods from all restaurants
          const neighborhoods = res.map((v, i) => res[i].neighborhood);
          // Remove duplicates from neighborhoods
          const uniqueNeighborhoods = neighborhoods.filter(
            (v, i) => neighborhoods.indexOf(v) == i
          );
          resolve(uniqueNeighborhoods);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    // Fetch all restaurants

    return new Promise((resolve, reject) => {
      HttpHelper.fetchRestaurants()
        .then(res => {
          // Get all cuisines from all restaurants
          const cuisines = res.map((v, i) => res[i].cuisine_type);
          // Remove duplicates from cuisines
          const uniqueCuisines = cuisines.filter(
            (v, i) => cuisines.indexOf(v) == i
          );

          resolve(uniqueCuisines);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: HttpHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}
