// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto, reqwest */

var map = L.map('map').setView([34.124311, -118.313141], 12);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/lkelkar/cjgzxzldr000l2rkw9vog656r/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGtlbGthciIsImEiOiJjajluZDh1N200dXplMnFwYXJyYmhncnJuIn0.DsDJNMlXoTYQXVP391utBA', 
 {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'lkelkar'
});

/*
 * Whenever you create a layer, you'll need three things:
 *  1. A source.
 *  2. A style.
 *  3. A layer.
 *
 * Here we create each of the above twice with different settings to add two layers to our map.
 */

//-------------layer1-residential-------------------//

// Initialze source data
var residentialSource = new carto.source.SQL('SELECT * FROM residential');

// Create style for the data
var residentialStyle = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #ffffff;
    opacity: 0.5;
  }
`);

// Add style to the data
var residentialLayer = new carto.layer.Layer(residentialSource, residentialStyle, {
  featureClickColumns: ['zone_cmplt', 'zone_class']
});


//---------------close layer 1 -------------------------//
//------------------layer2-parking----------------------//

// Initialze source data
var parkingSource = new carto.source.Dataset('parking');

// Create style for the data
var parkingStyle = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #D2B4DE;
    opacity: 0.5;
  }
`);

// Add style to the data
var parkingLayer = new carto.layer.Layer(parkingSource, parkingStyle);

//-------------------close layer 2 --------------------//
//------------------layer3-industrial----------------------//

// Initialze source data
var industrialSource = new carto.source.Dataset('industrial');

// Create style for the data
var industrialStyle = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #367588;
    opacity: 0.5;
  }
`);

// Add style to the data
var industrialLayer = new carto.layer.Layer(industrialSource, industrialStyle);

//-------------------close layer 3 --------------------//
//------------------layer4-commercial----------------------//

// Initialze source data
var commercialSource = new carto.source.Dataset('commercial');

// Create style for the data
var commercialStyle = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #EE9DFB;
    opacity: 0.5;
  }
`);

// Add style to the data
var commercialLayer = new carto.layer.Layer(commercialSource, commercialStyle);

//-------------------close layer 4 --------------------//
//------------------layer5-rail stops----------------------//

// Initialze source data
var railstationSource = new carto.source.Dataset('stations_all_0316');

// Create style for the data
var railstationStyle = new carto.style.CartoCSS(`
  #layer {
    marker-width: 8;
    marker-line-width: 0;
    marker-fill: #cc3399;
    marker-fill-opacity: 0.9;
    marker-placement: point;
    marker-type: ellipse;
    marker-allow-overlap: true;
  }
`);

// Add style to the data
var railstationLayer = new carto.layer.Layer(railstationSource, railstationStyle);

//-------------------close layer 5 --------------------//
//-----------layer6-affordable housing metric-----------//

// Initialze source data
var metricSource = new carto.source.Dataset('aff_hous_metric');

// Create style for the data
var metricStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: ramp([metric100], (#b2d8d8, #66b2b2, #008080, #006666, 	#004c4c), quantiles);
  opacity: 0.5;
}
#layer::outline {
  line-width: 0.5;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

// Add style to the data
var metricLayer = new carto.layer.Layer(metricSource, metricStyle);


//-------------------close layer 6 --------------------//
//------------------layer7-brt----------------------//

// Initialze source data
var brtSource = new carto.source.Dataset('rapidbrt0617_1');

// Create style for the data
var brtStyle = new carto.style.CartoCSS(`
 #layer {
  line-color: #cc3399;
  line-width: 1;
  line-opacity: 1;
}
`);

// Add style to the data
var brtLayer = new carto.layer.Layer(brtSource, brtStyle);

//-------------------close layer 7 --------------------//



// Add the data to the map as two layers. Order matters here--first one goes on the bottom
client.addLayers([parkingLayer, residentialLayer, industrialLayer, commercialLayer, railstationLayer, metricLayer, brtLayer]);
client.getLeafletLayer().addTo(map);

//-------------------toggle buttons ------------------//
// Keep track of whether the boroughs layer is currently visible
var metricVisible = true;

// When the boroughs button is clicked, show or hide the layer
var metricButton = document.querySelector('.toggle-metric');
metricButton.addEventListener('click', function () {
  if (metricVisible) {
    // Boroughs are visible, so remove that layer
    client.removeLayer(metricLayer);
    
    // Then update the variable tracking whether the layer is shown
    metricVisible = false;
  }
  else {
    // Do the reverse if boroughs are not visible
    client.addLayer(metricLayer);
    metricVisible = true;
  }
});
// Keep track of whether the boroughs layer is currently visible
var brtVisible = true;

// When the boroughs button is clicked, show or hide the layer
var brtButton = document.querySelector('.toggle-brt');
brtButton.addEventListener('click', function () {
  if (brtVisible) {
    // Boroughs are visible, so remove that layer
    client.removeLayers([railstationLayer,brtLayer]);
    
    // Then update the variable tracking whether the layer is shown
    brtVisible = false;
  }
  else {
    // Do the reverse if boroughs are not visible
    client.addLayers([railstationLayer,brtLayer]);
    brtVisible = true;
  }
});
//--------------------checkboxes---------------------------//
/*
 * A function that is called any time a checkbox changes
 */
function handleCheckboxChange() {
  // First we find every checkbox and store them in separate variables
  var r1Checkbox = document.querySelector('.r1-checkbox');
  var r2Checkbox = document.querySelector('.r2-checkbox');
  var r3Checkbox = document.querySelector('.r3-checkbox');
  var rdCheckbox = document.querySelector('.rd-checkbox');
  
  // Logging out to make sure we get the checkboxes correctly
  console.log('r1:', r1Checkbox.checked);
  console.log('r2:', r2Checkbox.checked);
  console.log('r3:', r3Checkbox.checked);
  console.log('rd:', rdCheckbox.checked);
  // Create an array of all of the values corresponding to checked boxes.
  // If a checkbox is checked, add that filter value to our array.
  var residentVariable = [];
  if (r1Checkbox.checked) {
    // For each of these we are adding single quotes around the strings,
    // this is because in the SQL query we want it to look like:
    //
    //   WHERE life_stage IN ('Adult', 'Juvenile')
    //
    residentVariable.push("'R1'");
  }
  if (r2Checkbox.checked) {
    residentVariable.push("'R2'");
  }
  if (r3Checkbox.checked) {
    residentVariable.push("'R3'");
  }
  if (rdCheckbox.checked) {
    residentVariable.push("'RD%'");
  }
  // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (residentVariable.length) {
    var sql = "SELECT * FROM residential WHERE zone_class IN (" + residentVariable.join(',') + ")";
    console.log(sql);
    residentialSource.setQuery(sql);
  }
  else {
    residentialSource.setQuery("SELECT * FROM residential");
  }
}

/*
 * Listen for changes on any checkbox
 */
var r1Checkbox = document.querySelector('.r1-checkbox');
r1Checkbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var r2Checkbox = document.querySelector('.r2-checkbox');
r2Checkbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var r3Checkbox = document.querySelector('.r3-checkbox');
r3Checkbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var rdCheckbox = document.querySelector('.rd-checkbox');
rdCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
