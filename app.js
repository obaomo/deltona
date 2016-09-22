var map;
var infowindow;
var myViewModel;
var markers = [];
var styles;
var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=';

//main code data for location
var Locations = [ {
	title: 'Stephen Home',
	location: {
		lat: 28.9288298,
		lng: -81.2354897
	}
}, {
	title: 'RaceTrac',
	location: {
		lat: 28.9478792,
		lng: -81.2517882
	}
}, {
	title: 'Dunkin Donuts',
	location: {
		lat: 28.9440047,
		lng: -81.2440784
	}
}, {
	title: 'Epic Theatre',
	location: {
		lat: 28.9336987,
		lng:-81.2521422
	}
}, {
	title: 'Deltona Gulf Club',
	location: {
		lat: 28.9227577,
		lng: -81.2444269
	}
}, {
	title: 'Deltona Libaray',
	location: {
		lat: 28.9277695,
		lng: -81.231004
	}
}];

//main callback function for google map API 
function initmap() {

	var style = [
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"styles": [
		{
			"color": "#444444"
		}]
	},
	{
		"featureType": "landscape",
		"elementType": "all",
		"styles": [
		{
			"color": "#f2f2f2"
		}]
	},
	{
		"featureType": "poi",
		"elementType": "all",
		"styles": [
		{
			"visibility": "off"
		}]
	},
	{
		"featureType": "road.highway",
		"elementType": "all",
		"styles": [
		{
			"visibility": "simplified"
		}]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"styles": [
		{
			"visibility": "off"
		}]
	}
];

 	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 28.9288298,
			lng: -81.2354897
		},
		zoom: 13,
		styles: styles,
		mapTypeControl: null,
	});
};

 	function showMarkers() {
        setMapOnAll(map);        
    }

    function clearMarkers() {
    	setMapOnAll(null);
    } 

	function deleteMarkers() {
		clearMarkers();
		markers = [];
	}

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        };
    };

	function initialize() {

	google.maps.event.addListener(map, 'click', function(event) {
			addMarker(event.latLng, map);
	});
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(myViewModel());

var Location = function (data, map) {
	var self = this;
	this.locations = ko.observableArray([]);
	this.showMarkers = ko.observable([]);
	this.removeMarkers = ko.observable();
	this.deleteMarkers = ko.observable();
	this.title = ko.observable();
	this.marker = ko.observable();
	this.content = '<div>' + self.title() + '</div>';

	this.marker = new google.maps. Marker({
		maps: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: myLatLng,
		title: this.title()
	});
		self.marker.addListener('click', toggleBounce);
};
	
	this.addMarker = function(location) {
		this.markers.push(marker);
	}

	this.toggleBounce = function() {
		if(self.marker.getAnimation() !== null)
		{
			self.marker.setAnimation(null);
		} else {	
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
	}
};
		

var ViewModel = function() {
	var self = this;
	this.locationList = ko.observableArray([]);
	locations.forEach(function(locationItem) {
		self.locationList.push(new Locatiokn(locationItem, map));
	});

	this.locationList().forEach(function(place){
        google.maps.event.addListener(place.marker, 'click', function () {
            self.clickLocation(place);
        });
    });

    var infowindow = new google.maps.InfoWindow();
    this.clickLocation = function(location){
        infowindow.setContent(location.content);
        infowindow.open(this.map, location.marker);
        location.toggleBounce();
    };

    self.filteredList = ko.computed(function(){
        var filtered = [];
        this.locationList().forEach(function(location){
            if (location.visible())
            {
                filtered.push(location);
            }
        });
        return filtered;
    }, this);
};
