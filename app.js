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

    var locations = [{
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

var filterText = ko.observable("");

var wikiURL ='https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=';

var location = function (data, map){
    var self = this;
    this.position = ko.observable(data.position);
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
};

var ViewModel = function(){
    var self = this;
 
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: initLocation,
        zoom: 13
    });
  
    this.locationList = ko.observableArray([]);
        mylocations.forEach(function(locationItem){
            self.locationList.push(new location(locationItem, self.map));
    });

    this.locationList().forEach(function(place){
        google.maps.event.addListener(location.marker, 'click', function () {
            self.clickLocation(location);
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
    
    this.showListings() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    this.hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    document.getElementById('show-listings').addEventListener('click',
        showListings);
    document.getElementById('hide-listings').addEventListener('click', function() {
        hideMarkers(markers);
    });
    window.addEventListener('resize', function(e) {
        map.fitBounds(mapBounds);
        $("#map-canvas").height($(window).height());
    });

    this.makeMarkerIcon = ko.observable(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
        markerColor +
        '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

function start(){
    ko.applyBindings(new ViewModel());
}

function googleError() {
    alert("failed to get google map resources");
}

