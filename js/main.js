
// slide model:
// a title
// a description
// background color
var slides = [
  { title: "Philadelphia Shooting Cases", description: "This map shows all shooting crimes from 2015 to 2020 which contains 6,957 incidents. Click the point for more information.", color: "#F0F0F0" },
  { title: "Shooting cases occured in 2020", description: "There are 362 shooting cases occured in 2020. They share the same spatial patterns of past years which concentrate in West and North middle Philly.Click the point for more information.", color: "#F0F0F0" },
  { title: "Distribution of Shooting cases by race", description: "Here shows the spatial patterns of shootings cases which shooters are not African American (1,188 cases in total). Clear spatial correlation patterns could be observed especially around Chopersville.", color: "#F0F0F0" },
  { title: "Shooting cases involves teenagers", description: "Different patterns occured compare to previous map indicates that shootings which contains teenage shooters concentrate in West and North middle Philly.", color: "#F0F0F0" },
  { title: "Shooting cases involves victims", description: "Shootings incidents involves victims have wider spatial regions than teenage shootings, among Philly, Center City, University City, Southeast Phily and Juniata are the safer places consider shooting crimes. ", color: "#F0F0F0" }
]
var currentSlide = 0

var loadSlide = function(slide) {
  $('#title').text(slide.title)
  $('#description').text(slide.description)
  $('#sidebar').css("background-color", slide.color)
}




var url_1 = "https://raw.githubusercontent.com/derrickshu/MUSA611-Midterm/master/data/shootings.geojson";
var downloadData;


var parseData = function(Data_)
{
  return JSON.parse(Data_);
};


var makeMarkers = function(Data_) {
  var Markers_ = [];
  for(var i = 0; i<Data_.length; i++){
    if(Data_[i].geometry != null){
      var mark = L.circleMarker([Data_[i].geometry.coordinates[1], Data_[i].geometry.coordinates[0]],{
        radius: 3,
        color: "#C22121",
        opacity:0.6
      }).bindPopup(
        "<dl><dt>Location:</dt>"+ "<dd>" + Data_[i].properties.location + "</dd>"
        + "<dt>Crime Date:</dt>"+ "<dd>" +Data_[i].properties.date_+ "</dd>"
        + "<dt>Crime Time:</dt>"+ "<dd>" +Data_[i].properties.time+ "</dd>"
        + "<dt>Shooter's Age:</dt>"+ "<dd>" +Data_[i].properties.age+ "</dd>"
        + "<dt>Shooter's Race:</dt>"+ "<dd>" +Data_[i].properties.race+ "</dd>"
        + "<dt>Shooter's Sex:</dt>"+ "<dd>" +Data_[i].properties.sex+ "</dd>"    );
      Markers_.push(mark);
    }
  }
  return Markers_;
};

var racepoint = function(Data_) {
  if (Data_.geometry.race == "B" ) {
    return {fillColor: '#ffffaa', fillOpacity: 0.4, weight: 1, color: 'white'};
  } else if (Data_.geometry.race == "W") {
    return {fillColor: '#a2ccc2', fillOpacity: 0.4, weight: 1, color: 'white'};
  } else if (Data_.geometry.race == "A") {
    return {fillColor: '#6f93b2', fillOpacity: 0.4, weight: 1, color: 'white'};
  } else {
    return {weight: 3, color: 'white'};
  }
};

var showResults = function() {
  $('#results').show(thename);
};

var plotMarkers = function(Markers_) {
  for(var i = 0; i< Markers_.length; i++){
    Markers_[i].addTo(map);
  }
};


var removeMarkers = function(Markers_) {
  for(var i = 0; i< Markers_.length; i++){
    map.removeLayer(Markers_[i]);
  }
};


var map = L.map('map', {
  center: [40, -75.1639],
  zoom: 12
});


var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


var parsed;
var markers;

downloadData = $.ajax(url_1);
  downloadData.done(function(data) {
  parsed = parseData(data);
  markers = makeMarkers(parsed.features);
  plotMarkers(markers);});


var myFilter = function(parsed,slide) {
  var parsed_s=[]
  if(slide==0){
    for(var i = 0; i<parsed.features.length; i++){
      parsed_s=parsed.features
    };
  }
  if(slide==1){
    for(var i = 0; i<parsed.features.length; i++){
      if(parsed.features[i].properties.year=="2020"){
        parsed_s.push(parsed.features[i]);
      }
    };
  }
  else if (slide==2) {
    for(var i = 0; i<parsed.features.length; i++){
      if(parsed.features[i].properties.race!=="B"){
        parsed_s.push(parsed.features[i]);
      }
    };
  }
  else if (slide==3) {
    for(var i = 0; i<parsed.features.length; i++){
      if(parsed.features[i].properties.age<"19"&&parsed.features[i].properties.race=="B"){
        parsed_s.push(parsed.features[i]);
      }
    };
  }
  else if (slide==4) {
    for(var i = 0; i<parsed.features.length; i++){
      if(parsed.features[i].properties.fatal=="1"){
        parsed_s.push(parsed.features[i]);
      }
    };
  }
  return parsed_s;
};

var change_view = function(slide) {
  if(slide == 0){
    map.setView([40, -75.1639],12);
    console.log(slide);
  }
  else{
    map.setView([40, -75.1639],12);
    console.log(slide);
  }
}

var next = function() {
  if (currentSlide == 0) {
    $('#previousButton').show()}
  if (currentSlide == slides.length - 1) {
  } else {
    $('#nextButton').show()
    currentSlide = currentSlide + 1
    loadSlide(slides[currentSlide])
  }
  if (typeof(markers) != "undefined") {      // clear the map before each plot
    removeMarkers(markers);
  }
  downloadData = $.ajax(url_1);
    downloadData.done(function(data) {
    parsed = parseData(data);
    parsed = myFilter(parsed,currentSlide);
    markers = makeMarkers(parsed);
    plotMarkers(markers);});
  change_view(currentSlide);
  if (currentSlide == slides.length - 1) {
    $('#nextButton').hide()
  }

}


var previous = function() {
  if (currentSlide == slides.length - 1) {
    $('#nextButton').show()
  }
  if (typeof(markers) != "undefined" ) {      // clear the map before each plot
    removeMarkers(markers);                  // except the first plot
  }
  downloadData = $.ajax(url_1);
    downloadData.done(function(data) {
    parsed = parseData(data);
    parsed = myFilter(parsed,currentSlide);
    markers = makeMarkers(parsed);
    plotMarkers(markers);})
  change_view(currentSlide-1);
  if (currentSlide == 0) {
  } else {
    $('#previousButton').show()
    currentSlide = currentSlide - 1
    loadSlide(slides[currentSlide])
  }
  if (currentSlide == 0) {
    $('#previousButton').hide()}

}


$('#nextButton').click(function(e) {
  next()
})
$('#previousButton').click(function(e) {
  previous()
})
;
