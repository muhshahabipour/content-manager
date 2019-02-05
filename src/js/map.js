import general from './general-functions'
var CONSTANTS = {
    map_key: "437bff04f52ec692189de4d944bba2fc474b6792"
};
var map;
var marker;
export default class maping {
    modal = null;
    coreClass = null;

    constructor(modal = null, coreClass = {}) {
        this.modal = modal;
        this.coreClass = coreClass;

        const submit = document.querySelector("#map-submit");
        
        // submit.removeEventListener('click', (event) => {});
        submit.addEventListener('click', (event) => {
          
            const mapInput = document.querySelector("#mapInput");
            var $button = $(event.currentTarget);
            // TODO: test "dsafsgg" not okey
         
                document.querySelector('#cm-content-' + $button.data("sectionId")).innerHTML = mapInput.value;
                document.querySelector('#cm-content-' + $button.data("sectionId")).dataset.latlng = mapInput.value;
                coreClass.updateContentObject(document.getElementById('cm-content-' + $button.data("sectionId")), $button.data("type"));

                if($(submit).data("latlng") === ""){
                    coreClass.createSection(document.querySelector("#cm-section-" + $button.data("sectionId")));
                }
                general.setEndOfContenteditable(document.querySelector(".cm-wrapper").lastElementChild.querySelector('.cm-content'));


                let buttonCtrl = document.querySelector('#btn-create-' + $button.data("sectionId"));
                let buttonDel = document.querySelector('#btn-delete-' + $button.data("sectionId"));
                buttonCtrl.classList.add("hidden");
                buttonDel.classList.remove("hidden");

                this.modal.modal("hide");
           
        });

    }

    

    addMarker = (lat, lng , id) => {
        let self = this;
        var location = {latitude: lat, longitude: lng};


        if (marker !== undefined){
            map.removeLayer(marker);

        }
        if (!_.contains(this.markers)) {

            var geojsonFeature = {
                type: "Feature",
                properties: {
                    icon: {
                        iconUrl: 'https://www.mapbox.com/mapbox.js/assets/images/astronaut1.png',
                        iconSize: [50, 50], // size of the icon
                        iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -25], // point from which the popup should open relative to the iconAnchor
                        className: 'dot'
                    },
                    position: location,
                    map: map,
                    id: id,

                },
                geometry: {
                    type: "Point",
                    coordinates: [lat, lng]
                }
            };

            L.geoJson(geojsonFeature, {

                pointToLayer: function (feature, latlng) {
                  
                    var infoWindow = document.createElement("div");

                    var titleElm = document.createElement("b");
//                            titleElm.innerHTML = title;
//                            titleElm.id = id;
                    var contentElm = document.createElement("p");
                    // contentElm.innerHTML = 'آیا مایل به حذف این مورد هستید؟' + '<br><br>' +
                        // '<button type="button" class="btn btn-danger btn-sm remove-marker" data-id="' + id + '" data-marker-lat="' + location.latitude + '" data-marker-lng="' + location.longitude + '">بلی</button>';

                    infoWindow.appendChild(titleElm);
                    infoWindow.appendChild(contentElm);

                    marker = L.marker([location.latitude, location.longitude], {
                        "position": location,
                        "map": map
                    })
                    // .bindPopup(infoWindow, {
                    //     autoPan: true,
                    //     autoPanPadding: L.point(40, 40),
                    //     closeButton: true
                    // });

                    // marker.on("popupopen", self.onPopupOpen());

                    return marker;
                }
            }).addTo(map);
        }


    }

    initMap = (latLng) => {
let self = this;
        // TODO: add to constants.js
        L.cedarmaps.accessToken = CONSTANTS.map_key; // See the note below on how to get an access token

        // TODO: add to constants.js
        // Getting maps info from a tileJSON source
        var tileJSONUrl = 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=' + L.cedarmaps.accessToken;



        if(latLng === null){
              // initilizing map into div#map
        map = L.cedarmaps.map('locationMap', tileJSONUrl, {
            scrollWheelZoom: true
        }).setView([35.689248286487595, 51.38906293182373], 14);
        }else{
            var point = latLng.split('-')
              // initilizing map into div#map
        map = L.cedarmaps.map('locationMap', tileJSONUrl, {
            scrollWheelZoom: true
        }).setView([point[0], point[1]], 14);
        self.addMarker(point[0], point[1], guid())

        }

      

        map.on('click', function (event) {
            debugger;
            var lat = event.latlng.lat;
            var lng = event.latlng.lng;

            const mapInput = self.modal.find("#mapInput");
            mapInput.val(lat+"-"+lng)


            self.addMarker(lat, lng, guid())
        });




    }
    removeMap = () =>{
        map.remove();
    }

    onPopupOpen =  () => {
        var tempMarker = this;
        const submit = document.querySelector("#map-submit");
        $(".remove-marker:visible").click(function (event) {
            map.removeLayer(tempMarker);
            $(submit).data("latlng", "")
        });
    }
  


   

}
//         var locationMap = {
//             markers: [],

//             initMap: function () {

//                 // TODO: add to constants.js
//                 L.cedarmaps.accessToken = CONSTANTS.map_key; // See the note below on how to get an access token

//                 // TODO: add to constants.js
//                 // Getting maps info from a tileJSON source
//                 var tileJSONUrl = 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=' + L.cedarmaps.accessToken;

//                 // initilizing map into div#map
//                 map = L.cedarmaps.map('locationMap', tileJSONUrl, {
//                     scrollWheelZoom: true
//                 }).setView([35.689248286487595, 51.38906293182373], 14);

//                 map.on('click', function (event) {
//                     debugger;
//                     var lat = event.latlng.lat;
//                     var lng = event.latlng.lng;

//                     $("#lat").val(lat);
//                     $("#lng").val(lng);
// //                    alert(lat+"----"+ lng)

//                    locationMap.addMarker(lat, lng, guid())
//                 });


//             },
//             getRadius: function () {
//                 var bounds = map.getBounds();
//                 if (bounds) {
//                     var center = bounds.getCenter();
//                     var ne = bounds.getNorthEast();

//                     // r = radius of the earth in statute miles
//                     var r = 3963.0;

//                     // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
//                     var lat1 = center.lat / 57.2958;
//                     var lon1 = center.lng / 57.2958;
//                     var lat2 = ne.lat / 57.2958;
//                     var lon2 = ne.lng / 57.2958;

//                     // distance = circle radius from center to Northeast corner of bounds
//                     var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
//                             Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

//                     // radius in meters
//                     return (dis * 1000 * 1.5).toFixed(0);

//                 } else {
//                     return 4000;
//                 }
//             },
//             addMarker: function (lat, lng , id) {
//                 var location = {latitude: lat, longitude: lng};


//                 if (marker !== undefined){
//                     map.removeLayer(marker);

//                 }
//                 if (!_.contains(this.markers)) {

//                     var geojsonFeature = {
//                         type: "Feature",
//                         properties: {
//                             icon: {
//                                 iconUrl: 'https://www.mapbox.com/mapbox.js/assets/images/astronaut1.png',
//                                 iconSize: [50, 50], // size of the icon
//                                 iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
//                                 popupAnchor: [0, -25], // point from which the popup should open relative to the iconAnchor
//                                 className: 'dot'
//                             },
//                             position: location,
//                             map: map,
//                             id: id,
// //                            title: title
// //                            categoryId: categoryId
//                         },
//                         geometry: {
//                             type: "Point",
//                             coordinates: [lat, lng]
//                         }
//                     };

//                     L.geoJson(geojsonFeature, {

//                         pointToLayer: function (feature, latlng) {

//                             var infoWindow = document.createElement("div");

//                             var titleElm = document.createElement("b");
// //                            titleElm.innerHTML = title;
// //                            titleElm.id = id;
//                             var contentElm = document.createElement("p");
//                             contentElm.innerHTML = 'آیا مایل به حذف این مورد هستید؟' + '<br><br>' +
//                                 '<button type="button" class="btn btn-danger btn-sm remove-marker" data-id="' + id + '" data-marker-lat="' + location.latitude + '" data-marker-lng="' + location.longitude + '">بلی</button>';

//                             infoWindow.appendChild(titleElm);
//                             infoWindow.appendChild(contentElm);

//                             marker = L.marker([location.latitude, location.longitude], {
//                                 "position": location,
//                                 "map": map
//                             }).bindPopup(infoWindow, {
//                                 autoPan: true,
//                                 autoPanPadding: L.point(40, 40),
//                                 closeButton: true
//                             });

//                             marker.on("popupopen", locationMap.onPopupOpen);

//                             return marker;
//                         }
//                     }).addTo(map);
//                 }


//             },
//             onPopupOpen: function () {
//                 var tempMarker = this;

//                 $(".remove-marker:visible").click(function (event) {
//                     map.removeLayer(tempMarker);
//                     $("#lat").val('0');
//                     $("#lng").val('0');
//                 });
//             }
//         };

        // window.onload = function () {
        //     locationMap.initMap();
        // };














// const urlRegExp = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");

// export default class link {
//     modal = null;

//     constructor(modal = null) {
//         this.modal = modal;
//     }

//     init = (button, coreClass) => {
//         let $modal = this.modal;
//         const submit = document.querySelector("#link-submit");

//         submit.addEventListener('click', (event) => {
//             const link = document.querySelector("#link");

//             // TODO: test "dsafsgg" not okey
//             if (link.value && (link.value).match(urlRegExp)) {
//                 document.querySelector('#cm-content-' + button.data("sectionId")).innerHTML = link.value;
//                 coreClass.updateContentObject(document.getElementById('cm-content-' + button.data("sectionId")), button.data("type"));

//                 coreClass.createSection(document.querySelector("#cm-section-" + button.data("sectionId")));

//                 general.setEndOfContenteditable(document.querySelector(".cm-wrapper").lastElementChild.querySelector('.cm-content'));

//                 $modal.modal("hide");
//             } else {
//                 if (!link.value) {
//                     console.warn("link not fill");
//                 } else {
//                     console.warn("pattern not match");
//                 }
//             }
//         });

//     }
// }