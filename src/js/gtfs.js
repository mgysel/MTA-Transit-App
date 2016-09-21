// var txtFileStops = "../data/stop_times.txt";
// var file = new File(txtFileStops);
// console.log(file);

// var client = new XMLHttpRequest();
// client.open('GET', '../data/stop_times.txt');
// client.onreadystatechange = function() {
//   console.log(client.responseText);
// };
// client.send();
var stopData = [];
var listStops = [];

$.get("../data/stops.txt", function(data) {
	stopData.push(Papa.parse(data));
	// alert(data);
	// console.log(stopData);
	// console.log(stopData[0].data[1][2]);
	for (var i=1; i<stopData[0].data.length; i+=3) {
		// console.log(stopData[0].data[i][2]);
		listStops.push(stopData[0].data[i][2]);
		$("#stations-list").append("<option value='" + stopData[0].data[i][2] + "'>");
	}
}, 'text');

$("#stations-list").append("<option value='mikey'>");


