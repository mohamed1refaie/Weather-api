$(document).ready(function(){
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(getWeather);
});

var lat = 0, lon = 0;
var summary = '', icon = '', tempC = '', tempF = '', address = '';

// Get weather from api
function getWeather(position) {
	lat = position.coords.latitude, lon = position.coords.longitude;
	$.ajax({
    url: 'https://api.darksky.net/forecast/32940eefa9f247ac6cc705ad71d92474/' + lat + ',' + lon,
    data: {
			format: 'json'
    },
		dataType: 'jsonp',
    error: function() {
    	console.log('An error has occurred');
    },
    success: function(weather) {
			summary = weather.currently.summary;
			icon = weather.currently.icon;
			tempF = Math.round(weather.currently.temperature);
			tempC = Math.round((tempF - 32) * 5 / 9);
			getLocationName();
		}
	});
}

// Get adress from lat and lon
function getLocationName() {
	$.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon,
    data: {
			format: 'json'
    },
		dataType: 'json',
    error: function() {
    	console.log('An error has occurred');
    },
    success: function(location_data){
			// Get address from json
			address = 'Location Error';
			if (location_data.status == 'OK') {
				address = location_data.results[0].address_components.find(function(i){
					return i.types[0] == 'administrative_area_level_2';
				}).short_name;
				address += ', ';
				address += location_data.results[0].address_components.find(function(i){
					return i.types[0] == 'country';
				}).long_name;
			}
			updateData();
		}
	});
}

function updateData() {
	var dateTime = new Date();
	var time = dateTime.toTimeString().substring(0, 5);
	var date = dateTime.toDateString().split(' ')[1] + ' ' + dateTime.toDateString().split(' ')[2];
	$('#time').html(time);
	$('#date').html(date);
	$('#temp').html(tempC);
	$('#address').html(address);
	$('#summary').html(summary);
	// Set icon
	var icon_class = {
		'clear-day': 'wi-day-sunny',
		'clear-night': 'wi-night-clear',
		'rain': 'wi-rain',
		'snow': 'wi-snow',
		'sleet': 'wi-sleet',
		'wind': 'wi-windy',
		'fog': 'wi-fog',
		'cloudy': 'wi-cloudy',
		'partly-cloudy-day': 'wi-day-cloudy',
		'partly-cloudy-night': 'wi-night-alt-partly-cloudy'
	};
	$('#icon').addClass(icon_class[icon]);
}

var cur_unit = 'C';
function changeUnit(){
	if (cur_unit == 'C') {
		$('#temp').html(tempF);
		$('#unit').html('°F');
		cur_unit = 'F';
	}
	else {
		$('#temp').html(tempC);
		$('#unit').html('°C');
		cur_unit = 'C';
	}
}
  