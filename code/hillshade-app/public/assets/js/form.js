$('#generate-dem-request').click(function() {

  // Update interface state
  $(this).find('p').addClass('hidden');
  $('.lds-ellipsis').removeClass('hidden');
  $('#dl-modal').modal('show');

  // Transmit parameters to server
  socket.emit("getDEM", demParams);
  // and for good measure
  console.log(demParams);
});

$('.card-li').click(function() {
  $('.card-li.selected').removeClass('selected');
  $('.geography.selected').removeClass('selected');

  // This logic was written to enable selection of geometries
  // at different administrative levels - not used in this version,
  // but will be deployed in future iterations.
  if ($(this).hasClass('state') || $(this).hasClass('county')) {

    // hide USA polygon
    $('.geography.CAN').removeClass('hidden');
    $('.geography.USA').addClass('hidden');

  } else if ($(this).hasClass('province')) {

    // hide Canada polygon
    $('.geography.USA').removeClass('hidden');
    $('.geography.CAN').addClass('hidden');

  } else if ($(this).hasClass('USA')) {
    $('.geography.USA').removeClass('hidden');
    $('.geography.CAN').removeClass('hidden');


  } else if ($(this).hasClass('CAN')) {
    $('.geography.USA').removeClass('hidden');
    $('.geography.CAN').removeClass('hidden');
  }

  $(this).addClass('selected');

  // Here's the crux - collect attributes attached to elements
  // and store them in demParams variable, preparing it for
  // transmission to the server
  var geog = $(this).attr('data-geography'),
    geogtype = $(this).attr('data-geogtype');
  $('.geography.' + geog).addClass('selected')
  demParams.area = geog;
  // This parameter is a hook for future iterations not used in this version
  demParams.areatype = geogtype;
});

$('svg').on('click', '.geography', function() {
  var geog = $(this).attr('data-iso');

  if (!$(this).hasClass('serviced')) {
    // Small visual feedback to indicate clicked
    // geometry is out of service area.
    outOfService(this);
    return;
  }

  $('.geography.selected').removeClass('selected');
  $('.card-li.selected').removeClass('selected');
  $(this).addClass('selected');
  $('.card-li.' + geog).addClass('selected');
  demParams.area = geog;
  $('#area-card .card-body').scrollTo('.card-li.' + geog); // Not original code - see fn declaration for attribution!
});

$('input').blur(function() {
  validateDEMinput(this);
});

// Deprecated for now as the MVP only offers access to the
// gdaldem hillshade algorithm
$('#algorithm-card .card-radio').click(function() {
  $('#algorithm-card .card-radio .selected').removeClass('selected');
  $(this).find('.circle').addClass('selected');
  var algorithm = $(this).attr('data-algo');
  demParams.algo = algorithm;

  $('.params-select').addClass('hidden');
  $('#select-' + algorithm + '-params').removeClass('hidden');

  // if (algorithm == 'hillshade') {
  //   // hide others
  //   $('.params-select').addClass('hidden');
  //   // show hillshade params div
  //   $('#select-hillshade-params').removeClass('hidden');
  // } else if (algorithm == 'slope') {
  //   $('.params-select').addClass('hidden');
  //   $('#select-slope-')
  // } else if (algorithm == 'aspect') {
  //   $('.params-select').addClass('hidden');
  // }

});

// Handle output filetype selection
$('#parameters-card .card-radio').click(function() {
  $('#parameters-card .card-radio .selected').removeClass('selected');
  $(this).find('.circle').addClass('selected');
  demParams.filetype = $(this).attr('data-filetype');
});

// Functions
function validateDEMinput(jqElement) {

  // To give feedback for both valid and invalid form inputs
  if ($(jqElement).attr('id').includes('altitude')) {
    var p = 'altitude';
  } else if ($(jqElement).attr('id').includes('azimuth')) {
    var p = 'azimuth';
  } else if ($(jqElement).attr('id').includes('z-factor')) {
    var p = 'z-factor'
  } else if ($(jqElement).attr('id').includes('scale')) {
    var p = 'scale';
  }

  var val = $(jqElement).val();
  if (!Number(val)) {
    $(jqElement).removeClass('is-valid');
    $(jqElement).addClass('is-invalid');
  } else {
    val = Number(val);
    if (p == 'azimuth') {
      if (val < 360 && val >= 0) {
        demParams.params.az = val;
        $(jqElement).removeClass('is-invalid')
        $(jqElement).addClass('is-valid');
      } else {
        $(jqElement).removeClass('is-valid');
        $(jqElement).addClass('is-invalid');
      }
    } else if (p == 'altitude') {
      if (val <= 90 && val >= 0) {
        demParams.params.alt = val;
        $(jqElement).removeClass('is-invalid')
        $(jqElement).addClass('is-valid');
      } else {
        $(jqElement).removeClass('is-valid');
        $(jqElement).addClass('is-invalid');
      }
    } else if (p == 'z-factor') {
      demParams.params.z = val;
      $(jqElement).removeClass('is-invalid')
      $(jqElement).addClass('is-valid');
    } else if (p == 'scale') {
      demParams.params.s = val;
      $(jqElement).removeClass('is-invalid')
      $(jqElement).addClass('is-valid');
    }
  }
}


function outOfService (jqElement) {
  $(jqElement).addClass('out-of-service');
  setTimeout(function () {
    $(jqElement).removeClass('out-of-service');
  }, 100);
}
