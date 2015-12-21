'use strict';

function rad(deg) {
  return deg / 180 * Math.PI;
}

// Based on http://www.movable-type.co.uk/scripts/latlong.html
export default function(a, b) {
  let lat1 = a[0], lat2 = b[0], lon1 = a[1], lon2 = b[1];
  var R = 6371000; // metres
  var φ1 = rad(lat1);
  var φ2 = rad(lat2);
  var Δφ = rad(lat2-lat1);
  var Δλ = rad(lon2-lon1);

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
