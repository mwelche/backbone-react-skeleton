// js/modules/geolocate.js

define(function() {
	var Geo = {};
	Geo = {
		getUserLocation: function() {
			if (navigator.geolocation) {
				require(["async!http://maps.google.com/maps/api/js?sensor=false"], function() {
					navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
				});
			}
			//Get the latitude and the longitude;
			function successFunction(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				console.log('Latitude:' + lat);
				console.log('Longitude:' + lng);

				// Google Map API
				// codeLatLng(lat, lng);

				// Factual GeoCode API (http://developer.factual.com/api-docs/#Geocode)
				Backbone.ajax({
					url: "http://api.v3.factual.com/places/geocode",
					dataType: "json",
					data: {
						geo:"{\"$point\":[" + lat + "," + lng + "]}",
						KEY:"mkRf4uZ7AFsFiX8WyW5ossvVmUKTyJnRozIQ5eh3"
					},
					success: function(result){
						var city = result["response"]["data"][0]["locality"],
							state = result["response"]["data"][0]["region"],
							zip = result["response"]["data"][0]["postcode"];
						console.log("HTML5 Location: " + city + ", " + state + " " + zip);
						if (($('#l').val() === '') && !($("#l").is(":focus"))) {
							$('#l').val(city + ', ' + state);
							$.cookie('user_location', (city + ', ' + state), {expires:1, path: '/'});
						}
					}
				});
			}
			function errorFunction(){
				console.log("Geocoder failed");
			}
			function codeLatLng(lat, lng) {
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(lat, lng);
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						console.log(results);
						if (results[1]) {
							//formatted address
							//alert(results[0].formatted_address);
							getCityState(results);
						}
					}
				});
				function getCityState(results) {
					var a = results[0].address_components;
					var city, state, zip, i;
					for(i = 0; i <  a.length; ++i) {
						var t = a[i].types;
						if(compIsType(t, 'administrative_area_level_1')) {
							state = a[i].short_name; //store the state
						} else if(compIsType(t, 'locality')) {
							city = a[i].long_name; //store the city
						} else if(compIsType(t, 'postal_code')) {
							zip = a[i].short_name; //store the zip
						}
					}
					if (typeof city !== 'undefined' &&
						typeof state !== 'undefined' &&
						typeof zip !== 'undefined') {
						console.log("HTML5 Location: " + city + ", " + state + " " + zip);
						if (($('#l').val() === '') && !($("#l").is(":focus"))) {
							$('#l').val(city + ', ' + state);
							$.cookie('user_location', (city + ', ' + state), {expires:1, path: '/'});
						}
					}
				}
				function compIsType(t, s) {
					var z;
					for(z = 0; z < t.length; ++z) {
						if(t[z] === s) {
							return true;
						}
					}
					return false;
				}
			}
		}
	};

	return Geo;
});
