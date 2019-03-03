

  //var bounds = new L.LatLngBounds(new L.LatLng(84.67351257 , -172.96875) , new L.LatLng(-54.36775852 , 178.59375)) ;
  var map = L.map('mapid' , {
     
     
    }).setView([25.3176,82.9739], 4);
  var baselayer = L.tileLayer('https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map) ; 

    var baselayer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }) ;

     var baselayer3 = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }) ;

    var baselayer4 = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }) ;   
   // LEL 
   var SkyTruth = L.layerGroup.skyTruthLayer() ;
   var ToxicRelease = L.layerGroup.toxicReleaseLayer() ;
   var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });
   var OdorReport = L.layerGroup.odorReportLayer() ;
   var cloudscls = L.OWM.cloudsClassic({});

   var precipitationcls = L.OWM.precipitationClassic({});

   var raincls = L.OWM.rainClassic({});
   var snow = L.OWM.snow({});

   var windrose = L.OWM.current({intervall: 15, minZoom: 3, markerFunction: myWindroseMarker, popup: false, clusterSize: 50,imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png' });
    windrose.on('owmlayeradd', windroseAdded, windrose); 

   var city = L.OWM.current({intervall: 15, minZoom: 3});

   var MapKnitter = L.layerGroup.mapKnitterLayer() ;

   var heatmap_data = [] ;
   var first = [] ; 
   var second = [] ; 

  var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 2,
        "maxOpacity": .8, 
        // scales the radius based on map zoom
        "scaleRadius": true, 
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
  };

  var cfg1 = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 2,
        "maxOpacity": .8, 
        // scales the radius based on map zoom
        "scaleRadius": true, 
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
  };


   var heatmapLayer = new HeatmapOverlay(cfg1) ; 
   var PurpleLayer =  new HeatmapOverlay(cfg) ;

   function get_heatmap_data()
   {
      var url = 'http://80fae82c.ngrok.io/db/region/?format=json' ; 
                    
      $.getJSON(url , function(data){
        console.log(data) ; 

        heatmap_data = data ;
        for(let i=0 ; i<data.length ; i++){
          let obj = new Object ; 
          obj.lat = data[i].latitude ; 
          obj.lng = data[i].longitude ; 
          obj.count = 2 ; 
          first[first.length] = obj ; 
        }

        for(let i=0 ; i<data.length ; i++){
          let obj = new Object ; 
          obj.lat = data[i].latitude + 0.7 ; 
          obj.lng = data[i].longitude  + 1 ; 
          obj.count = 7 ; 
          second[second.length] = obj ; 
        }

        get_second_heatmap() ; 

      });
   } 

   get_heatmap_data() ; 



   function get_second_heatmap(){
       var testData = {
          max: 8,
          data: second
        };

      heatmapLayer.setData(testData);

      var testData1 = {
          max: 8,
          data: first
        };

      PurpleLayer.setData(testData1);
   }

   var user_layergroup = L.layerGroup() ; 

   function get_users(){
      var url = 'https://80fae82c.ngrok.io/db/user/?format=json' ; 
                    
      $.getJSON(url , function(data){
            console.log(data) ; 

            for (i = 0 ; i < data.length ; i++) {

              if(data[i].pincode != null){
                var lat = data[i].pincode.latitude ; 
                var lng = data[i].pincode.longitude ;
                var address = data[i].address ;
                var name = data[i].first_name ;  

                L.marker([lat , lng]).bindPopup("<strong>Name : </strong>" + name + "<br><strong>Address :</strong> " +  address + "<br><strong> Lat : </strong>" + lat + "  ,  <strong> Lon : </strong>" + lng).addTo(user_layergroup) ;

              }
               
            }
            //user_layergroup.addTo(map) ;

      });
    }

    get_users() ;

            

   var baseMaps = {
      "Baselayer2": baselayer , 
      "baselayer1" : baselayer1 ,
      "baselayer3" : baselayer3 , 
      "baselayer4" : baselayer4
    };

   var overlayMaps = {
        "All Users": user_layergroup,
         "Actual HeatMap": PurpleLayer ,
         "Actual Markers Clusters": MapKnitter,
         "Predicted HeatMap": heatmapLayer,
         "clouds (classic)": cloudscls ,
         "precipitation (classic)": precipitationcls , 
         "rain (classic)": raincls ,
         "snow": snow ,  
         "Cities (zoom in)": city  , 
         "windrose (zoom in)": windrose
    };

    L.control.layers(baseMaps,overlayMaps).addTo(map);




// LBL

     var options = {
        map: map, 
        InterfaceOptions: {
          latId: 'lat',
          lngId: 'lng'
        }
      }

      var blurredLocation = new BlurredLocation(options);

      blurredLocation.panMapToGeocodedLocation("placenameInput");
      blurredLocation.setBlurred(false);


  // functions for actual and predicted !

   function actual_function(){
    heatmapLayer.remove() ;
    PurpleLayer.remove() ;
    PurpleLayer.addTo(map) ; 
   }

   function predicted_function(){
    heatmapLayer.remove() ;
    PurpleLayer.remove() ; 
    heatmapLayer.addTo(map) ; 
   }

   var hospitalIcon = L.icon({
    iconUrl: 'https://cdn1.iconfinder.com/data/icons/medicine-pt-7/100/051_-_hospital_map_marker_pin_doctor-512.png',
    iconSize:     [31, 38], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

   var labsIcon = L.icon({
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/flat-icons-19/512/Chimestry_flask.png',
    iconSize:     [31, 38], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

   var dispIcon = L.icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/hospital-and-medical-v2/512/hospital_place_pin_map_location-512.png',
    iconSize:     [31, 38], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

  

   var hospitals , labs , disp ; 

   function getHospitals(){

    if(typeof labs != "undefined"){
      labs.remove() ; 
    }

    if(typeof disp != "undefined"){
      disp.remove() ; 
    }


    // var littleton = L.marker([23, 82], {icon: hospitalIcon}).bindPopup('Bhagwaan Mahavir Hospital'),
    // denver    = L.marker([25, 82], {icon: hospitalIcon}).bindPopup('JCB Hospital'),
    // aurora    = L.marker([24, 81], {icon: hospitalIcon}).bindPopup('VVS Hospital'),
    // golden    = L.marker([25, 81], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g1    = L.marker([25, 83], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g2    = L.marker([23, 77], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g3    = L.marker([21, 75], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g4    = L.marker([28, 83], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g5    = L.marker([30, 83], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g6    = L.marker([20, 83], {icon: hospitalIcon}).bindPopup('HJB Hospital');
    // g7    = L.marker([23, 75], {icon: hospitalIcon}).bindPopup('HJB Hospital');

    // hospitals = L.layerGroup([littleton, denver, aurora, golden , g1,g2,g3,g4,g5,g6,g7]).addTo(map) ;

  
      var url = 'https://80fae82c.ngrok.io/db/hospital/?format=json' ; 
                    
      $.getJSON(url , function(data){
            console.log(data) ; 

            for (i = 0 ; i < data.length ; i++) {
                var lat = data[i].pincode.latitude ; 
                var lng = data[i].pincode.longitude ;
                var address = data[i].address ;
                var name = data[i].first_name ;  

                L.marker([lat , lng] , {icon: hospitalIcon}).bindPopup("<strong>Name : </strong>" + name + "<br><strong>Address :</strong> " +  address + "<br><strong> Lat : </strong>" + lat + "  ,  <strong> Lon : </strong>" + lng).addTo(map) ;

            }
            console.log("hospitals") ;

            //hospitals.addTo(map) ;
      });

   }

    // Add marker to local DB !

   function submitMarker(name , lat , lon)
   {
    console.log(lat + "..." + lon) ;
      var temp = L.marker([lat , lon], {icon: hospitalIcon}).bindPopup(name) ;
      temp.addTo(hospitals) ; 
   }


   function getLabs(){
    if(typeof hospitals != "undefined"){
      hospitals.remove() ; 
    }

    if(typeof disp != "undefined"){
      disp.remove() ; 
    }

    var littleton = L.marker([23, 82], {icon: labsIcon}).bindPopup('Bhagwaan Mahavir Hospital'),
    denver    = L.marker([25, 82], {icon: labsIcon}).bindPopup('JCB Hospital'),
    aurora    = L.marker([24, 81], {icon: labsIcon}).bindPopup('VVS Hospital'),
    golden    = L.marker([25, 81], {icon: labsIcon}).bindPopup('HJB Hospital');
    g1    = L.marker([25, 83], {icon: labsIcon}).bindPopup('HJB Hospital');
    g2    = L.marker([23, 77], {icon: labsIcon}).bindPopup('HJB Hospital');
    g3    = L.marker([21, 75], {icon: labsIcon}).bindPopup('HJB Hospital');
    g4    = L.marker([28, 83], {icon: labsIcon}).bindPopup('HJB Hospital');
    g5    = L.marker([30, 83], {icon: labsIcon}).bindPopup('HJB Hospital');
    g6    = L.marker([20, 83], {icon: labsIcon}).bindPopup('HJB Hospital');
    g7    = L.marker([23, 75], {icon: labsIcon}).bindPopup('HJB Hospital');

    labs = L.layerGroup([littleton, denver, aurora, golden , g1,g2,g3,g4,g5,g6,g7]).addTo(map) ;

   }

  function getDispencaries(){
    if(typeof hospitals != "undefined"){
    hospitals.remove() ; 
    }
    if(typeof labs != "undefined"){ 
    labs.remove() ; 
    }

    var littleton = L.marker([23, 82], {icon: dispIcon}).bindPopup('Bhagwaan Mahavir Hospital'),
    denver    = L.marker([25, 82], {icon: dispIcon}).bindPopup('JCB Hospital'),
    aurora    = L.marker([24, 81], {icon: dispIcon}).bindPopup('VVS Hospital'),
    golden    = L.marker([25, 81], {icon: dispIcon}).bindPopup('HJB Hospital');
    g1    = L.marker([25, 83], {icon: dispIcon}).bindPopup('HJB Hospital');
    g2    = L.marker([23, 77], {icon: dispIcon}).bindPopup('HJB Hospital');
    g3    = L.marker([21, 75], {icon: dispIcon}).bindPopup('HJB Hospital');
    g4    = L.marker([28, 83], {icon: dispIcon}).bindPopup('HJB Hospital');
    g5    = L.marker([30, 83], {icon: dispIcon}).bindPopup('HJB Hospital');
    g6    = L.marker([20, 83], {icon: dispIcon}).bindPopup('HJB Hospital');
    g7    = L.marker([23, 75], {icon: dispIcon}).bindPopup('HJB Hospital');

    disp = L.layerGroup([littleton, denver, aurora, golden , g1,g2,g3,g4,g5,g6,g7]).addTo(map) ;

   }

   function parseSymptoms()
   {
     
      var url = 'https://sandbox-healthservice.priaid.ch/symptoms?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im11ZGl0LnZlcm1hMjAxNEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQ3MTgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTktMDMtMDIiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU1MTU5MTU4MywibmJmIjoxNTUxNTg0MzgzfQ.nQ8AAwCZ2z7cgb3NA_A1xZS_lXAH9syAZk8Iaw9qPxE&format=json&language=en-gb' ; 
                    
      $.getJSON(url , function(data){
                          console.log(data) ; 

            for (i = 0 ; i < 10 ; i++) {
                var d =  $("#symptoms_id") ;
               d.append(" <input type='checkbox'  id="+ data[i].ID +" value="+ data[i].ID +" name='one'>") ; 
               d.append(" &nbsp; ") ;
               d.append("<span>" + data[i].Name + "</span><br>") ; 
               console.log(d) ;
               
            }

      });
   }

   var predicted_data ; 

   function getDisease(){

    var elements = $("#symptoms_id")[0] ;
    console.log(elements) ; 
    var arr = [] ; 
    $.each($("input[name='one']:checked") , function(){
      arr[arr.length] = $(this).val() ; 
    }) ;

    console.log(arr) ; 

    var url = "https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=["+ arr +"]&gender=male&year_of_birth=1998&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im11ZGl0LnZlcm1hMjAxNEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQ3MTgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTktMDMtMDIiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU1MTU5MTY0MCwibmJmIjoxNTUxNTg0NDQwfQ.fugeK7MkyVmimm7IOp6oDaDgk855MpQW1mcvx9wZr98&format=json&language=en-gb" ; 
    $.getJSON(url , function(data){
                          console.log(data) ; 
                        predicted_data = data ; 
                        graph_predicted() ;

    });



   }

function graph_predicted(){

var labelx = [] ; 
var valy = [] ; 

 for(let i=0 ; i < predicted_data.length ; i++){
    labelx[labelx.length] = predicted_data[i].Issue.ProfName ;
    valy[valy.length] = predicted_data[i].Issue.Accuracy ; 
 }


Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var ctx = document.getElementById("myBarChart_predicted");
var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labelx,
    datasets: [{
      label: "Accuracy",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: valy,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6
        },
        maxBarThickness: 25,
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10
    },
  }
});

   $("html, body").animate({ scrollTop: $(document).height() }, 1000);

}


