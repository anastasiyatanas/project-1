// Firebase
var config = {
	apiKey: "AIzaSyBuYvCZhfVXMSy58wlH7Ystv4zhNHbrh_k",
	authDomain: "voyage-33779.firebaseapp.com",
	databaseURL: "https://voyage-33779.firebaseio.com",
	projectId: "voyage-33779",
	storageBucket: "voyage-33779.appspot.com",
	messagingSenderId: "546324991338"
  };
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();

var map; // instance of the map init'ed by the mapInit function and then referenced to place markers
var map; // instance of the map init'ed by the mapInit function and then referenced to place markers

$(document).ready(function(){

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

  //-----------------------------------SYGIC API-----------------------------------//
  $(document).on("click", "#activity_submit_button", function (event) {
    event.preventDefault();
		var activityUserSearch = $('#activity_search').val().trim();
	console.log(activityUserSearch, "click");
	saveQueryToDatabase(activityUserSearch);
    // the user input validation
    if (!activityUserSearch || !isNaN(activityUserSearch)) {
			console.log("response");
			$("#error").append('Please enter correct data');    
			return;         
    }
    $("#error").empty();

    var queryURL = "https://api.sygictravelapi.com/1.0/en/places/list/?query=" + activityUserSearch;
    $.ajax({
        headers: { "x-api-key" : "0we6G7cNvy1wmjnxPTKXja29TI4ySBFk7PnGToWt"},
        method: "GET",
        url: queryURL,
        data: {

        }
      }).then(function(response) {
        console.log(response.data.places);
        var results = response.data.places;
        $("#sygic_tablebody").empty();
        for (var i=0; i < results.length; i++) {
          // Creates div to put in the API response into #activity_map
          var tBody = $("#sygic_tablebody");
          var tRow = $("<tr class='row_click'>");

          //Creates an p tag to put the data
          var sygicSubmitName = $("<td class='row_name'>").text(results[i].name);
          var sygicSubmitDescription = $("<td class='row_description'>").text(results[i].perex);
          var sygicSubmitLocation = $("<td class='row_location'>").text(results[i].name_suffix);

          //LATITUDE AND LONGITUDE
          console.log(results[i].location.lat);
          var lat = Number(results[i].location.lat);
          console.log(results[i].location.lng);
          var lng = Number(results[i].location.lng);

          var title = results[i].name;

          placeMarkers(lat, lng, title);

          //Append data to html
          tRow.append(sygicSubmitName, sygicSubmitDescription, sygicSubmitLocation);
          tBody.prepend(tRow);
        };
      });
    });

  //-----------------------------------ZOMATO API-----------------------------------//
  $(document).on("click", "#food_submit_button", function (event) {
    event.preventDefault();
	var food = $('#food_search').val().trim();
    var type = $('#type_search').val();
    var apiKey = "99a5742a67eabda241969985091e9c61";
	console.log(food, "click");
	// UPDATE DATABASE WITH THE food QUERY
	saveQueryToDatabase(food);
    //user input validation
    if (!food || !isNaN(food)) {
			console.log("response");
			$("#error").append('Please enter correct data');    
			return;         
    }
    $("#error").empty();
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=10&cuisines=" + type + "&q=" +
      food + "&apikey=" + apiKey;

    $.ajax({
      url: queryURL,
      contentType: "application/json",
      method: "GET",
      })
      .done(function (response) {
        console.log(response.restaurants);
        var results = response.restaurants;
        $("#zomato_tablebody").empty();

          for (var i=0; i < results.length; i++) {
            // Creates div to put in the API response into #activity_map
            var tBody = $("#zomato_tablebody");
            var tRow = $("<tr class='row_click'>");

            //Creates an p tag to put the data
            var zomatoSubmitName = $("<td class='row_name'>").text(results[i].restaurant.name);
            var zomatoSubmitCuisine = $("<td class='row_description'>").text(results[i].restaurant.cuisines);
            var zomatoSubmitAddress = $("<td class='row_location'>").text(results[i].restaurant.location.address);

            console.log(zomatoSubmitName, zomatoSubmitCuisine, zomatoSubmitAddress);

            //LONGITUDE AND LATITUDE
            console.log(results[i].restaurant.location.latitude);
            var lat = Number(results[i].restaurant.location.latitude);

            console.log(results[i].restaurant.location.longitude);
            var lng = Number(results[i].restaurant.location.longitude);

            var title = results[i].restaurant.name;

            placeMarkers(lat, lng, title);

            //Append data to html
            tRow.append(zomatoSubmitName, zomatoSubmitCuisine, zomatoSubmitAddress);
            tBody.prepend(tRow);
          };
      });
    });

    //-----------------------------------ITINERARY ON CLICK-----------------------------------//
    $(document).on("click", ".submit_tables", function (event) {
      var rows = document.getElementsByClassName("row_click");

      for (var i=0; i < rows.length; i++) {
        var currentRow = rows[i];
        var createClickHandler = 
          function(row) {
            return function() { 

              var tBody = $("#itinerary_tablebody");
              var tRow = $("<tr>");

              var rowClickName = row.getElementsByClassName("row_name")[0];
              var rowClickDescription = row.getElementsByClassName("row_description")[0];
              var rowClickLocation = row.getElementsByClassName("row_location")[0];

              tRow.append(rowClickName, rowClickDescription, rowClickLocation);
              tBody.append(tRow);
            };
          };
        currentRow.onclick = createClickHandler(currentRow);
      }
    });
});

function saveQueryToDatabase(query) {
	console.log(query);
	database.ref("queries").set(query);
}
	

//-----------------------------------GOOGLE MAPS API-----------------------------------//
function placeMarkers(lat, lng, title) {
  console.log('placeMarkers FUNCTION: -----------------------', typeof(lat));
  console.log('placeMarkers FUNCTION: -----------------------', typeof(lng));

  var latlng = { lat: lat, lng: lng };
  var marker = new google.maps.Marker({ 
    position: latlng,
    map: map,
    title: title,
    label: {
      text: title,
      color: "blue",
      background:"green",
      fontWeight: "bold"
    }
  });
  return marker.setMap(map);
}
    var markers = [];
    
    //create instance of a map from the Google Maps API
    //Grab the reference to the "map" id to display the map
    //Set the map options object properties
    function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
       center: {
       lat: 37.7884162, 
       lng: -122.4127457
     },
     zoom: 8.5
    });

    //-----------------------------------IP ADDRESS LOCATOR-------------------------------------
    infoWindow = new google.maps.InfoWindow;
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };
         //Makes location variable global
         //window.pos = pos1;
 
         infoWindow.setPosition(pos);
         infoWindow.setContent('Location found.');
         infoWindow.open(map);
         map.setCenter(pos);
       }, function() {
         handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       // Browser doesn't support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
     }
    }