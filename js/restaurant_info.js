let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = callback => {
  return new Promise((resolve, reject) => {
    if (self.restaurant) {
      // restaurant already fetched!
      resolve(self.restaurant);
    }

    const id = getParameterByName("id");
    if (!id) {
      // no id found in URL
      error = "No restaurant id in URL";
      reject(error);
    } else {
      DBHelper.fetchRestaurantById(id)
        .then(res => {
          self.restaurant = res;
          if (!restaurant) reject("error");
          fillRestaurantHTML();
          resolve(restaurant);
        })
        .catch(err => reject(err));
    }
  });

  // if (self.restaurant) {
  //   // restaurant already fetched!
  //   callback(null, self.restaurant);
  //   return;
  // }
  // const id = getParameterByName("id");
  // if (!id) {
  //   // no id found in URL
  //   error = "No restaurant id in URL";
  //   callback(error, null);
  // } else {
  //   DBHelper.fetchRestaurantById(id, (error, restaurant) => {
  //     self.restaurant = restaurant;
  //     if (!restaurant) {
  //       console.error(error);
  //       return;
  //     }
  //     fillRestaurantHTML();
  //     callback(null, restaurant);
  //   });
  // }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;
  name.setAttribute("aria-labelledby", "restaurant-name");

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;
  address.setAttribute("aria-labelledby", "restaurant-address");

  const image = document.getElementById("restaurant-img");
  image.className = "restaurant-img";
  image.alt = `restaurant ${restaurant.name}`;
  image.setAttribute("aria-labelledby", "restaurant-img");
  image.setAttribute("src", `/img/normal/${restaurant.photograph}`);
  image.setAttribute(
    "srcset",
    `/img/small/${restaurant.photograph} 2x, /img/normal/${
      restaurant.photograph
    } 3x`
  );

  const cuisine = document.getElementById("restaurant-cuisine");
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute("aria-labelledby", "restaurant-cuisine");

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  const hours = document.getElementById("restaurant-hours");
  hours.setAttribute("aria-labelledby", "restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  container.setAttribute("aria-labelledby", "reviews-container");

  const title = document.createElement("h3");
  title.innerHTML = "Reviews";
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.innerHTML = "No reviews yet!";
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById("reviews-list");
  ul.setAttribute("aria-labelledby", "reviews-list");

  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = review => {
  const li = document.createElement("li");
  const reviewHeader = document.createElement("div");
  reviewHeader.style.display = "flex";
  reviewHeader.style.backgroundColor = "rgba(0,0,0,0.8)";

  const name = document.createElement("p");
  name.style.margin = "10px";
  name.style.width = "50%";
  name.style.color = "white";
  name.style.fontSize = "1rem";
  name.style.fontWeight = "bold";
  name.innerHTML = review.name;
  name.setAttribute("aria-label", review.name);
  reviewHeader.appendChild(name);

  const date = document.createElement("p");
  date.style.margin = "10px";
  date.style.textAlign = "right";
  date.style.width = "50%";
  date.style.color = "#BDBDBD";
  date.innerHTML = review.date;
  date.setAttribute("aria-label", review.date);
  reviewHeader.appendChild(date);
  li.appendChild(reviewHeader);

  const rating = document.createElement("p");
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.style.width = "30%";
  rating.style.padding = "5px";
  rating.style.marginTop = "10px";
  rating.style.marginLeft = "20px";
  rating.style.textAlign = "center";
  rating.style.color = "white";
  rating.style.textTransform = "uppercase";
  rating.style.fontWeight = "bold";
  rating.style.letterSpacing = "1px";
  rating.style.backgroundColor = "orange";
  rating.setAttribute("aria-label", "rating", review.rating);
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  comments.style.padding = "0 20px";
  comments.style.textAlign = "justify";
  li.appendChild(comments);

  li.style.borderRadius = "20px 0px";
  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-label", restaurant.name);
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
