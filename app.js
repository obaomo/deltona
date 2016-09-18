
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.9288298,
            lng: -81.2354897
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    } 
];


    allLocations = [{
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
            lat: 28.9336987,
            lng: -81.2521422
        }
    }, {
        title: 'Epic Theatre',
        location: {
            lat: 28.9336987,
            lng: -81.2521422
        }
    }, {
        title: 'Deltona Gulf-Club',
        location: {
            lat: 28.9227577,
            lng: -81.2444269
        }
    }, {
        title: 'Deltona Library',
        location: {
            lat: 28.9277695,
            lng: -81.231004
        }
    }];
}

var filteredText = ko.observable("");
var infowindow = ko.observable();

var wikiURL ='https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=';

var allLocation = function (data, map){
    var self = this;
    this.filteredList = ko.observable("");
    this.allLocations = ko.observableArray([]); 
    this.showListings = ko.observableArray([]);                                
    this.position = ko.observable(data.location);
    this.title = ko.observable(data.title);
    this.marker = ko.observable();
    this.searchWiki = data.search;
    this.content = '<div>' + self.title() + '</div>';

    this.marker = new google.maps.Marker({
        position: this.position(),
        map: map,
        title: this.title()
      });
    self.marker.setAnimation(null);

    document.getElementById('show-listing').addListener('click', show);
    document.getElementById('hide-listing').addListener('click', hide);
        };

    this.visible = ko.computed(function(){
        if (filterText().length > 0){
            return (self.title().toLowerCase().indexOf(filterText().toLowerCase()) > -1);
        }
        else{
            return true;
        }
    },this);

    $.ajax({
        url: wikiURL+self.searchWiki,
        dataType: 'jsonp',
        timeout: 1000
    }).done(function(data) {
           self.content = '<div>' + self.title() + '</div>'+'<p>' + data[2][0] +'<a href=' + data[3][0] + ' target="blank"> Wikipedia</a></p>';
    }).fail(function(jqXHR, textStatus){
            alert("failed to get wikipedia resources");
    });

    this.toggleBounce = function() {
        if (self.marker.getAnimation() !== null)
        {
            self.marker.setAnimation(null);
        }
        else
        {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                self.marker.setAnimation(null);
            }, 2000);
        }
};

var ViewModel = function(){
    var self = this;

    this.allLocationList = ko.observableArray([]);
    allLocations.forEach(function(allLocationItem){
        self.allLocationList.push(new allLocation(allLocationItem, map));
    });

    this.allLocationList().forEach(function(place){
        google.maps.event.addListener(place.marker, 'click', function () {
            self.clickLocation(place);
        });
    });

    var infowindow = function() {
    this.clickLocation = function(location){
        infowindow.setContent(location.content);
        infowindow.open(this.map, location.marker);
        location.toggleBounce();
    };

    var trafficLayer = new google.maps.TrafficLayer();
    this.trafficLayer = ko.observable();
        trafficLayer.setMap(map);
    };

    this.allLocation = function () {
        if ((this.filteredList() !=="") && (this.allLocations.indexOf(this.filteredList()) < 0)) 
            this.allLocations.push(this.filteredList());
        this.filteredList(""); 
    };
 
    this.hidelistings = function () {
        this.allLocations.hideAll(this.showListings());
        this.showListings([]);
    };
 
    this.showListings = function() {
        this.allLocations.show();
    };
 
ko.applyBindings(new ViewModel());
};

