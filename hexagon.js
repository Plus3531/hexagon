const turf = require('@turf/turf');
const http = require("http");

const pt1 = turf.point([52.458379, 6.122787]); // ,
pt1.properties = {dotId: 8000, comp: 'AL'}
const pt2 = turf.point([ 52.455990,6.125036]); // 52.455990, 6.125036
pt2.properties = {dotId: 8001, comp: 'PL'}
const pt3 = turf.point([ 52.448091,5.840200]); // 52.448091, 5.840200
pt3.properties = {dotId: 8002, comp: 'PLL'}
const points = turf.featureCollection([pt1, pt2, pt3]);
const g = createHexGrid();
http.createServer(function (request, response) {

	response.writeHead(200, {'Content-Type': 'application/json'});

	const features = g.features.map((f, i) => ({...f, properties:{pid: i}}))
	g.features = features;
	const tagged = turf.tag(points, g, 'pid', 'pid');
	const pids = tagged.features.map(f => f.properties.pid);
	const uniqPids = [...new Set(pids)];
	const selected = uniqPids.map(up => features.find(f => f.properties.pid === up));
	r = selected.map(s => ({...s, properties: {...s.properties, hello: 'number'}}));
	response.end(JSON.stringify(r));
 }).listen(8081);

 // Console will print the message
 console.log('Server running at http://127.0.0.1:8081/');


 function createHexGrid() {
	var bbox = [50, 3, 54, 8]; //50.748023, 3.112693 -- 53.661219, 7.594254
	var cellSide = 2.5; // default = km
	var options = {units: 'kilometers'};

	return turf.hexGrid(bbox, cellSide, options);
 }
