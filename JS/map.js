 var bounds = new L.LatLngBounds(new L.LatLng(84.67351257 , -172.96875) , new L.LatLng(-54.36775852 , 178.59375)) ;
  var map = L.map('mapid' , {
      maxBounds: bounds , 
      maxBoundsViscosity: 0.75
    }).setView([23,77], 3);
  var baselayer = L.tileLayer('https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map) ; 


// LEL 
   var SkyTruth = L.layerGroup.skyTruthLayer().addTo(map) ;
   var ToxicRelease = L.layerGroup.toxicReleaseLayer() ;
   var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

   var cloudscls = L.OWM.cloudsClassic({});

   var precipitationcls = L.OWM.precipitationClassic({});

   var raincls = L.OWM.rainClassic({});
   var snow = L.OWM.snow({});

   var windrose = L.OWM.current({intervall: 15, minZoom: 3, markerFunction: myWindroseMarker, popup: false, clusterSize: 50,imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png' });
    windrose.on('owmlayeradd', windroseAdded, windrose); 

   var city = L.OWM.current({intervall: 15, minZoom: 3});

   var baseMaps = {
      "Baselayer": baselayer
    };