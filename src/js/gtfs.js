// Create empty arrays for stop data and a list of all stops.

// raw time and stop data
var stopData = [];
var stData = [];
// all formatted stop and time data
var stopTimeData = [];
// Routes
var routeNumbers = ["1", "2", "3", "4", "5", "6", "7", "9", "A", "B", "D", "E", "F", "G", "H", "J", "L", "M", "N", "Q", "R", "S"];


// STOP TIME DATA
$.get("../data/stop_times.txt", function(data) {
	// Parse Stop Time data.
	stData.push(Papa.parse(data));
// work with data upon success.
}).done(function() {
		// put data from stData into an array of stop and time called stopTimeData.
		// for all of the stop times in the list of stops and times
		for (var i=1; i<stData[0].data.length; i++) {
			// This piece of data
			var stDataPiece = stData[0].data[i];
			// and for all of the stops
			for (var j=0; j<stopTimeData.length; j++) {
				// day of the stop
				var stopDay = stDataPiece[0].substring(9,12);
				// if the stop name of the time list equals the stop name of the stop list
				if (stDataPiece[3] === stopTimeData[j].stop) {
					// factor out time portion of object.
					var stopTimeDataTime = stopTimeData[j].time;
					// factor out departure time
					var stDataDepartTime = stData[0].data[i][2];
					// and if the day type is a weekday
					if (stopDay === "WKD") {
						// push it into the weekday array.
						stopTimeDataTime.weekday.push(stDataDepartTime);
					// or if it is a Saturday
					} else if (stopDay === "SAT") {
						// push it into the saturday array.
						stopTimeDataTime.saturday.push(stDataDepartTime);
					// or if it is a Sunday.
					} else if (stopDay === "SUN") {
						// put it into the Sunday array.
						stopTimeDataTime.sunday.push(stDataDepartTime);
					}
				}
			}
		}
		// Sort all of the saturday, sunday, and weekday times after the array is created.
		for (var i=0; i<stopTimeData.length; i++) {
			// factor out stopTimeData time
			var stopTimeDataTimes = stopTimeData[i].time;
			stopTimeDataTimes.saturday.sort();
			stopTimeDataTimes.sunday.sort();
			stopTimeDataTimes.weekday.sort();
		}
	});

// get data from stops.txt.
$.get("../data/stops.txt", function(data) {
	// Parse data.
	stopData.push(Papa.parse(data));
	for (var i=1; i<stopData[0].data.length-2; i+=3) {
		// Create a list of all stops with an object of the route and stop name
		// for each stop.
		var thisStop = stopData[0].data;
		// filtering stop
		var thisStopOne = thisStop[i+1];
		// filtering stop
		var thisStopTwo = thisStop[i+2];
		// Create stopTimeData element for this piece of data
		stopTimeData.push({
			stop: thisStopOne[0],
			name: thisStopOne[2],
			time: {
				weekday: [],
				saturday: [],
				sunday: []
			}
		});
		// Create stopTimeData element for this piece of data
		stopTimeData.push({
			stop: thisStopTwo[0],
			name: thisStopTwo[2],
			time: {
				weekday: [],
				saturday: [],
				sunday: []
			}
		});
		// Create option list for depart and arrive stations
		$("#depart-stations-list").append("<option value='" + thisStop[i][2] + "'>");
		$("#arrive-stations-list").append("<option value='" + thisStop[i][2] + "'>");
	}
}, 'text')
	.done(function() {
		// Route Inputs
		var subwayLine = $("#subway-line");
		var departStation = $("#depart-station");
		var arriveStation = $("#arrive-station");
		// Append all routes to route inout
		for (var i=0; i<routeNumbers.length; i++) {
			var thisRoute = routeNumbers[i];
			subwayLine.append("<option value=" + thisRoute + ">" + thisRoute + "</option>");
		}
		// On the depart station changing.
		subwayLine.change(function() {
			// Subway line chosen
			var subwayLine = $("#subway-line").val();
			// FILTER DEPART AND ARRIVE STATIONS TO ONLY HAVE STATIONS ON THAT ROUTE.
				// for all the directionless stations
			for (var j=0; j<stopTimeData.length; j+=2) {
				// if the departure route is the same as the route
				// of the arrive stop in the array of all stops
				if (subwayLine === stopTimeData[j].stop[0]) {
					// append that stop to the arrive stops.
					var thisStopTime = stopTimeData[j].stop.substring(0,3) + " - " + stopTimeData[j].name;
					$("#depart-station").append("<option class='option' value=" + thisStopTime + ">" + thisStopTime + "</option>");
					$("#arrive-station").append("<option class='option' value=" + thisStopTime + ">" + thisStopTime + "</option>");
				}
			}
		});
		// On the arrive station changing
		$("#arrive-station").change(function() {
			// DETERMINE DATE NOW AND PUT IN USABLE FORM
			// date now
			var date = Date($.now());
			// date now in number form
			var dateNowNum = date.substring(16,18) + date.substring(19,21);
			// day now
			var dayNow = date.substring(0,3).toLowerCase();
			// day variable to be used later
			var day = "";
			// determine the day and put in usable form for day variable.
			if (dayNow == "sat") {
				day = "saturday";
			} else if (dayNow == "sun") {
				day = "sunday";
			} else {
				day = "weekday";
			}
			// IF THE DEPART AND ARRIVE STATIONS AREN'T EMPTY
			var departStaVal = departStation.val();
			var arriveStaVal = arriveStation.val();
			var departSta = departStaVal.substring(0,3);
			var arriveSta = arriveStaVal.substring(0,3);
			var depRouteDir = "";
			var arrRouteDir = "";
			if (departStaVal !== "" && arriveStaVal !== "") {
				// determine the direction of the subway.
				console.log(departStaVal);
				console.log(arriveStaVal);
				if (departSta > arriveSta) {
					depRouteDir = departSta + "N";
					arrRouteDir = arriveSta + "N";
				} else {
					depRouteDir = departSta + "S";
					arrRouteDir = arriveSta + "S";
				}
				// console.log("depRouteDir = " + depRouteDir + " arrRouteDir = " + arrRouteDir);

				var arrayNextTimes = [];
				var travelTime = [];
				var firstStopFirstDate;
				var secondStopSecondDate;
				for (var i=0; i<stopTimeData.length; i++) {
					if (stopTimeData[i].stop == arrRouteDir) {
						secondStopSecondDate = stopTimeData[i].time[day][0];
						secondStopSecondDate = secondStopSecondDate.substring(0,2) + secondStopSecondDate.substring(3,5);
						console.log(secondStopSecondDate);
					} else if (stopTimeData[i].stop == depRouteDir) {
						// First date for finding travel time.
						firstStopFirstDate = stopTimeData[i].time[day][0];
						firstStopFirstDate = firstStopFirstDate.substring(0,2) + firstStopFirstDate.substring(3,5);
						for (var j=0; j<stopTimeData[i].time[day].length; j++) {
							var thisDate = stopTimeData[i].time[day][j];
							var thisDateNum = thisDate.substring(0,2) + thisDate.substring(3,5);
							arrayNextTimes.push(parseInt(thisDateNum) - parseInt(dateNowNum));
						}
						// FIX SORT SO IT IS FROM LOWEST TO HIGHEST NUMBERS.
						arrayNextTimes.sort((function(a,b) { return a-b; }));
						arrayNextTimes = arrayNextTimes.filter(function(x){ return x > -1; });
						var nextBusTime = (parseInt(dateNowNum) + parseInt(arrayNextTimes[0]));
						nextBusTime = nextBusTime.toString();
						nextBusTime = nextBusTime.substring(0,2) + ":" + nextBusTime.substring(2,4);
					}
				}
				// Determining the travel time
				travelTime = secondStopSecondDate - firstStopFirstDate;
				// Determining the arrival time
				var arrivalTime = parseInt(nextBusTime.substring(0,2) + nextBusTime.substring(3,5)) + travelTime;
				arrivalTime = arrivalTime.toString();
				arrivalTime = arrivalTime.substring(0,2) + ":" + arrivalTime.substring(2,4);
				// adding the departure, travel time, and arrival to the webpage.
				$("#subway-times").append("<p id='next-times' class='text-center main-form center-block input'>Depart Time: " + nextBusTime + "<br>Duration: " + travelTime + " minutes<br>Arrival Time: " + arrivalTime + " </p>");
				$(".map-button").css("margin-top","12px");
				if (window.matchMedia("(max-width: 450px)").matches) {
					$(".inputs").css("margin-top","130px");
				} else {
					$(".inputs").css("margin-top","calc(calc(4vh + 160px))");
				}
			}
		});
	});