$(document).ready(function() {
    var mapData = [];

    function searchByCity() {
    	$('#new-city').on('submit', function(){
	        var queryCity = $('#city-input').val().trim();
	        var queryURL = "http://api.eventful.com/json/events/search?app_key=crQBBZznzX5Sn2R4&location=" + queryCity;

	        mapData = [];
	        $('#display').empty();

	        $.ajax({
	            url: queryURL,
	            method: "GET",
	            dataType: 'jsonp',
	            data: {
	                format: "jsonp",
	                apikey: 'crQBBZznzX5Sn2R4',
	            }
	        }).done(function(response){
	            var events = response.events.event;
	            var description = "";

	            for(var i = 0; i < events.length; i++) {
	            	mapData.push({
	            		name: events[i].title,
	            		url: events[i].venue_url,
	            		lat: events[i].latitude,
	            		lng:  events[i].longitude});


	           		$('#display').append("<a href=" + events[i].venue_url +" class='eventLink' data-url=" +
	           			events[i].venue_url + " target='_blank'>" + events[i].title + "</a>" +
						"<br>" + events[i].venue_address + "<br>" + events[i].city_name + ", " + events[i].region_abbr +
						"<br>" + moment(events[i].start_time).format('MMMM Do YYYY, h:mm:ss A') + "<br><br>");

	           	}

	            console.log(mapData);
                mapStuff(mapData);
	        });

	        return false;
	    });
    }

    function firebaseStore() {
    	var fb = new Firebase("https://events04.firebaseio.com/");

    	var popEvents;
    	var url = "";

    	$('.eventLink').on('click', function() {
    		var test = $(this).attr('data-url');

    		fb.push({
    			url: test,
    		});

    		console.log("Is this working");

    		return false;

    	});

  //   	$('#my-form').on('submit', function() {
		// 	name = $('#nameinput').val().trim();
		// 	destination = $('#destinationinput').val().trim();
		// 	firstTrainTime = $('#firstTraininput').val().trim();
		// 	frequency = $('#frequencyinput').val().trim();

		// 	fb.push({
		// 		name: name,
		// 		destination: destination,
		// 		firstTrainTime: firstTrainTime,
		// 		frequency: frequency,
		// 	});

		// 	//Reload needed for the removal to work on last element
		// 	location.reload();
		// 	return false;
		// })
    }

    searchByCity();
    firebaseStore();

    //==================================== map feature ========================================

    //=============== dummy data needed from event API==================================

    //dummy eventURL string
    var urlString = "http://austin.eventful.com/venues/lake-austin-marina-/V0-001-009303062-2?utm_source=apis&utm_medium=apim&utm_campaign=apic"
    //end dummy data ================================================================

    var map;
    var bounds = new google.maps.LatLngBounds();

    // map placeholder centered on Austin
    (function () {
        var mapDiv = document.getElementById('map');
        map = new google.maps.Map(mapDiv, {
        center: {lat: 30.294797, lng: -97.739589},
        zoom: 10
        });
    })();

    function mapStuff(mapData) {
        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        // Loop through our array of markers & place each one on the map
        for( i = 0; i < mapData.length; i++ ) {
            //trap for missing lat or lng
            if (mapData[i].lat === null || mapData[i].lng === null) {
                console.log("mapData[i].lat = "+mapData[i].lat + " mapData[i].lng = " + mapData[i].lng + " i = "+i)
            }
            else{
                            var position = new google.maps.LatLng(mapData[i].lat, mapData[i].lng);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: mapData[i].name
            });

            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    //infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.setContent('<div class="info_content">' +
                                        '<h3>' + mapData[i].name+'</h3>' +
                                        '<p>' + mapData[i].name+'</p>' +
                                        '<p><a href="'+mapData[i].url+'" target="_blank">Click to open Event URL in new tab</a></p>'+
                                        '</div>');
                    marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                    });
                }
            })(marker, i));
            //add code to change the color desired
            if(i === 0){
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
            }
            else if(i>0 && i<6){
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
            }
            else{
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
            }
            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
            }
        }
    };
});

