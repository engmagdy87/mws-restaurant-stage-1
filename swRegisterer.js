if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("sw.js")
    .then(function() {
      console.log("Successfully SW Registration ...");
    })
    .catch(function() {
      console.log("Failed SW Registration!");
    });
}
