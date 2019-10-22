// The main js file to be executed in the client's browser

// Global demParams variable, which will
// be sent back to the server on submit:
var demParams = {
  area: 'colorado',
  areatype: 'state',
  algo: 'hillshade',
  params: {
    az: 315,
    alt: 45,
    z: 1,
    s: 1
  },
  filetype: 'GTiff'
}

var dims = {
  width: $(window).width(),
  height: $(window).height(),
  margins: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  }
}

var coJson = 'assets/data/mastermap.json';

// Socket.io
var socket = io.connect("/");

socket.on("connect", function(){
    console.log("Browser connected!")
});

socket.on('dem-success',(refToDEMonServer) => {
  promptDEMdownload(refToDEMonServer);
});

// D3 geo - let's make maps
// Mike Bostock is a 👑
var proj = d3.geoMercator()
  .scale(3550)
  .center([-116,41]);

var graticule = d3.geoGraticule();
var path = d3.geoPath(proj);

var map = d3.select('#map')
  .attr('viewbox', function () {
    return '0 0 ' + dims.width + ' ' + dims.height
  });

var g = map.append('g');

d3.json(coJson, (data) => {

  g.append('path')
    .datum(graticule)
    .attr('class','graticule')
    .attr('d', path);

  // Draw geometries, assigning each element appropriate attributes
  // based on metadata contained in geojson
  g.selectAll('path')
      .data(data.features)
      .enter()
    .append('path')
      .attr('d', path)
      .attr('class', (d) => {
        // if country, return country
        // if state, return state
        if (d.properties.sov_a3 == 'CAN') {
          if (!d.properties.gn_name) {
            return 'country CAN';
          } else {
            return 'province ' + d.properties.gn_name.toLowerCase().replace(' ', '-');
          }
        } else if (d.properties.gn_name) {
          if (d.properties.gn_name == 'Colorado') {
            return 'serviced state hidden ' + d.properties.gn_name.toLowerCase().replace(' ', '-')
          } else {
            return 'state ' + d.properties.gn_name.toLowerCase().replace(' ', '-');
          }
        } else if (d.properties.COUNTY) {
          return 'county serviced ' + d.properties.COUNTY.toLowerCase().replace(' ', '-');
        } else if (d.properties.ISO_A3 == 'USA'){
          return 'country USA hidden';
        } else {
          return 'country ' + d.properties.ISO_A3;
        }
      })
      .classed('geography', true)
      .attr('data-iso', (d) => {
        // If county:
        if (d.properties.COUNTY) {
          return d.properties.COUNTY.toLowerCase().replace(' ', '-'); }
        // If state:
        else if (d.properties.gn_name) {
          return d.properties.gn_name.toLowerCase().replace(' ', '-');
        } else if (d.properties.ISO_A3) {
          return d.properties.ISO_A3;
        }
      });
});

// EVENT LISTENERS:
$('#dl').click( () => {
  $('.check-mark').addClass('hidden');
  var ref = $('#dl').attr('data-ref');
  window.open(ref, '_blank');
  $('#dl-modal').modal('toggle');
});

// A function to execute upon receipt of success DEM
// process completion from the server
function promptDEMdownload(refToDEMonServer) {
  $('#generate-dem-request').find('p').removeClass('hidden');
  $('.lds-ellipsis').addClass('hidden');
  $('.check-mark').removeClass('hidden');
  $('#dl').attr('disabled', false).text('Download');

  $('#dl').attr('data-ref', refToDEMonServer);
}

// A snazzy little helper function for smooth jQuery scrolling from
// https://stackoverflow.com/questions/2346011/how-do-i-scroll-to-an-element-within-an-overflowed-div
// - thanks @lepe!!!!
jQuery.fn.scrollTo = function(elem, speed) {
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    }, speed == undefined ? 1000 : speed);
    return this;
};
