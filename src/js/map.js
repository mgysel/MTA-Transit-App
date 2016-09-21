var model = {

	foursquareconfig: {
		apiKey: 'NJAHHABYCD2FWFRBKTORDSHJIL3FOQBYU5E5B12HBYNCCTQN',
    	authUrl: 'https://foursquare.com/',
    	apiUrl: 'https://api.foursquare.com/'
    },

    styles: [
		    {
		        'featureType': 'landscape',
		        'stylers': [
		            {
		                'hue': '#F1FF00'
		            },
		            {
		                'saturation': -27.4
		            },
		            {
		                'lightness': 9.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.highway',
		        'stylers': [
		            {
		                'hue': '#0099FF'
		            },
		            {
		                'saturation': -20
		            },
		            {
		                'lightness': 36.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.arterial',
		        'stylers': [
		            {
		                'hue': '#00FF4F'
		            },
		            {
		                'saturation': 0
		            },
		            {
		                'lightness': 0
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.local',
		        'stylers': [
		            {
		                'hue': '#FFB300'
		            },
		            {
		                'saturation': -38
		            },
		            {
		                'lightness': 11.2
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'water',
		        'stylers': [
		            {
		                'hue': '#00B6FF'
		            },
		            {
		                'saturation': 4.2
		            },
		            {
		                'lightness': -63.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'poi',
		        'stylers': [
		            {
		                'hue': '#9FFF00'
		            },
		            {
		                'saturation': 0
		            },
		            {
		                'lightness': 0
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    }
		]
};


var initMap = function() {
	var self = this;
	// Create new StyledMapType object, passing through the styles data
	// and name of the style.
	var styledMap = new google.maps.StyledMapType(model.styles,
		{name: 'Styled Map'});

	// Create the google map object.
	self.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.730, lng: -73.990},
		zoom: 12,
		// Add MapTypeId for the map type control.
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	});

	// Associate the styled map with the MapTypeId
	self.map.mapTypes.set('map_style', styledMap);
	// Set the map to display
	self.map.setMapTypeId('map_style');
	// Apply knockout bindings after map loads.
	ko.applyBindings(new ViewModel());
};


var ViewModel = function() {
};