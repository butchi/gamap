function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 1,
    streetViewControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['ff4_dot', 'ff4_paint']
    }
  });

  var ff4MapTypeDot = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var type = 'dot';
      var normalizedCoord = getNormalizedCoord(coord, zoom);
      if (!normalizedCoord) {
        return null;
      }
      var bound = Math.pow(2, zoom);
      var id = normalizedCoord.x + normalizedCoord.y * bound + 1;
      var idStr = ('0000' + id).slice(-2);
      return 'img/ff4/' + type + '/' + zoom + '/ff4_' + idStr + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 3,
    minZoom: 0,
    radius: 1738000,
    name: 'Final Fantasy IV 0'
  });

  var ff4MapTypePaint = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var type = 'paint';
      var normalizedCoord = getNormalizedCoord(coord, zoom);
      if (!normalizedCoord) {
        return null;
      }
      var bound = Math.pow(2, zoom);
      var id = normalizedCoord.x + normalizedCoord.y * bound + 1;
      var idStr = ('0000' + id).slice(-2);
      return 'img/ff4/' + type + '/' + zoom + '/ff4_' + idStr + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 3,
    minZoom: 0,
    radius: 1738000,
    name: 'Final Fantasy IV 1'
  });

  map.mapTypes.set('ff4_dot', ff4MapTypeDot);
  map.setMapTypeId('ff4_dot');
  map.mapTypes.set('ff4_paint', ff4MapTypePaint);
  map.setMapTypeId('ff4_paint');

  var markerArr = [];
  var infoWindowArr = [];

  Object.keys(spotLi).forEach(function(key) {
    var marker;
    var infoWindow;
    var spot = spotLi[key];

    marker = new google.maps.Marker({
      position: {lat: spot.lat, lng: spot.lng},
      map: map,
      title: spot.title,
    });

    markerArr.push(marker);

    infoWindow = new google.maps.InfoWindow({
      content: spot.title,
    });

    infoWindowArr.push(infoWindow);

    infoWindowArr.forEach(function(iw, i) {
      google.maps.event.addListener(markerArr[i], 'click', function(evt) {
        iw.open(map, markerArr[i]);
      })
    });
  });

  map.addListener('click', function(evt) {
    console.log(evt.latLng.lat(), evt.latLng.lng());
  });
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  var y = coord.y;
  var x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  var tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    y = (y % tileRange + tileRange) % tileRange;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange;
  }

  return {x: x, y: y};
}
