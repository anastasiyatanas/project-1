
$(document).ready(function(){
    //Global Variables
      //var userFoodInput = .val("#food_search");
    
      //SYGIC API
      $(document).on("click", "#activity_submit_button", function (event) {
        event.preventDefault();
        var activityUserSearch = $('#activity_search').val();
        console.log(activityUserSearch, "click");
    
        var queryURL = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + activityUserSearch;
        $.ajax({
            headers: { "x-api-key" : "0we6G7cNvy1wmjnxPTKXja29TI4ySBFk7PnGToWt"},
            method: "GET",
            url: queryURL,
            data: {
    
            }
          }).then(function(response) {
            console.log(response.data.places);
            var results = response.data.places;
    
            for (var i=0; i < results.length; i++) {
              // Creates div to put in the API response into #activity_map
              var tBody = $("#sygic_tablebody");
              var tRow = $("<tr>");
    
              //Creates an p tag to put the data
              var sygicSubmitName = $("<td>").text(results[i].name);
              var sygicSubmitDescription = $("<td>").text(results[i].perex);
              var sygicSubmitLocation = $("<td>").text(results[i].name_suffix);
              console.log(results[i].location.lat);
              console.log(results[i].location.lng);
    
              //Append data to html
              tRow.append(sygicSubmitName, sygicSubmitDescription, sygicSubmitLocation);
              tBody.prepend(tRow);
            };
          });
        });
    
      // ZOMATO API
      $(document).on("click", "#food_submit_button", function (event) {
        event.preventDefault();
        var food = $('#food_search').val();
        var type = $('#type_search').val();
        var apiKey = "99a5742a67eabda241969985091e9c61";
        console.log(food, "click");
    
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
    
        for (var i=0; i < results.length; i++) {
          // Creates div to put in the API response into #activity_map
          var tBody = $("#zomato_tablebody");
          var tRow = $("<tr>");
    
          //Creates an p tag to put the data
          var zomatoSubmitName = $("<td>").text(results[i].restaurant.name);
          var zomatoSubmitCuisine = $("<td>").text(results[i].restaurant.cuisines);
          var zomatoSubmitPrice = $("<td>").text(results[i].restaurant.currency);
    
          console.log(zomatoSubmitName, zomatoSubmitCuisine, zomatoSubmitPrice);
    
          //Append data to html
          tRow.append(zomatoSubmitName, zomatoSubmitCuisine, zomatoSubmitPrice);
          tBody.prepend(tRow);
        };
        });
        });
    });
      
    
    // GOOGLE MAPS API
        var map;
        var markers = [];
        var cuisines, name, establishment, locality, menu, photos, rating, infoContent;
        
        var locations = [
          {name: 'The Pub at Ghirardelli Square', latlng: {lat: 37.8063722222, lng: -122.4228888889}},
          {name: 'The Irish Bank', latlng: {lat: 37.7902750000, lng: -122.4048472222}}, 
          {name: 'Rogue San Francisco Public House', latlng: {lat: 37.8001440000, lng: -122.4104550000}}, 
          {name: 'Chieftain Irish Restaurant & Pub', latlng: {lat: 37.7814900000, lng: -122.4051510000}}, 
          {name: 'Kennedy\'s Irish Pub and Curry House', latlng: {lat: 37.8042510000, lng: -122.4156040000}},
          {name: 'Murphy\'s Pub', latlng: {lat: 37.7901916667, lng: -122.4038472222}}
        ];
        
        //create instance of a map from the Google Maps API
        //Grab the reference to the "map" id to display the map
        //Set the map options object properties
        function initMap() {
          map = new google.maps.Map(document.getElementById("map"), {
           center: {
           lat: 37.7884162, 
           lng: -122.4127457
         },
         zoom: 14
        });
    
        //IP ADDRESS LOCATOR
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
    
        var marker;
        
        Zomato.init("5b0926dcfa427d35c7b9f24c899c0ccc");
        
        //$.ajax call 
        $.ajax({
          method: "GET",
          crossDomain: true,
          url: "https://developers.zomato.com/api/v2.1/search?count=6&lat=37.79161&lon=-122.42143&establishment_type=6",
          dataType: "json",
          async: true,
          headers: {"user-key": "5b0926dcfa427d35c7b9f24c899c0ccc"}, 
        success: function(data) { 
          passZomatoData(data);
        }, 
        error: function() {
          infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
        }
        });//end of $.ajax call
        
        //function passZomatoData()
        function passZomatoData(data) {
        var infowindow = new google.maps.InfoWindow();
        places = data.restaurants;
        console.log(data);
        
        for(var i = 0; i < locations.length; i++) {
          (function() {
          // get the position fronm the locations array
          var position = locations[i].latlng;
          var title = locations[i].name;
          var cuisine = places[i].restaurant.cuisines;
          var address = places[i].restaurant.location.address;
          console.log(address);
          //create a marker per location and put into markers array
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            cuisine: cuisine, 
            address: address,
            animation: google.maps.Animation.DROP
          });
          //push the marker to our array of markers
          markers.push(marker);
        
          //extend the boundaries of the map for each marker
          marker.addListener('click', function() {
            populateInfoWindow(this, infowindow);
            infowindow.setContent('<div><b>Pub name:<b> ' + marker.title + '</div><div><b>Address:<b> ' + marker.address + '</div><div><b>Cuisine:<b> ' + marker.cuisine + '</div>');
           });
           })(i);//end of closure
          }//end of for loop
         }
        
        }; //end initMap()
    
        function populateInfoWindow(marker, infowindow) {
          //check to make sure the infowindow is not already opened in this marker
          if (infowindow.marker != marker) {
          infowindow.marker = marker;
          //infowindow.setContent('<div>' + marker.title + '</div>' + marker.infoContent);
          infowindow.open(map, marker);
          //Make sure the marker property is cleared if the infowindow is closed
          infowindow.addListener('closeclick', function() {
          infowindow.setMarker = null;
          });
         }
        }