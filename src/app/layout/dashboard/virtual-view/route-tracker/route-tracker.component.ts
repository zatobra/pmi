import { Component, OnInit, ViewChild } from "@angular/core";
import { VirtualViewService } from "../virtual-view.service";
import { environment } from "src/environments/environment";
import { MatCardModule } from "@angular/material/card";
import { Config } from "src/assets/config";
import { Toast, ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import {
  EventType,
  TravelData,
  TravelMarker,
  TravelMarkerOptions,
} from "travel-marker";

@Component({
  selector: "app-route-tracker",
  templateUrl: "./route-tracker.component.html",
  styleUrls: ["./route-tracker.component.scss"],
})
export class RouteTrackerComponent implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  title = "";

  supervisor: any = [];
  surveyor: any = [];
  selectedRegionFilter: any = -1;
  selectedSupervisorFilter: any = -1;
  selectedSurveyorFilter: any = -1;
  selectedDe: any = -1;
  selectedDsr: any = -1;
  chooseDate = new Date();
  startDate = new Date();
  endDate = new Date();
  userType: any = -1;
  latitude;
  longitude;
  // lat: Number;
  // lng: Number;
  visitedShops: any = [];

  trackedShops: any = [];
  dataShops: any = [];
  liveTrackingDataMap: any = [];
  prodata: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  legends;
  projectType;
  loadingMap = false;
  showMap = false;
  show: boolean;
  surveyorId: any;
  origin: any;
  destination: any;
  waypoints = [
    { location: { lat: 24.9379389, lng: 67.1514844 } },
    { location: { lat: 41.8339037, lng: -87.8720468 } },
  ];
  speedMultiplier = 10;
  map: any;
  line: any;
  totalDistanceCovered: any = 0;
  colorType1 = "../../../../../assets/map-marker-icons/";
  colorType = Config.BASE_URI + "/images/map-marker-icons/";
  loading = false;
  params: any = {};
  marker: TravelMarker = null;
  obj: any = {};
  visitedtrackedShops: any = [];
  labels: any;


  constructor(
    private httpService: VirtualViewService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.title = this.labels.surveyorLabel
    this.activatedRoute.queryParams.subscribe((p) => {
      console.log("active params", p);
      this.params = p;
      if (p.surveyorId && p.startDate && p.userType) {
        this.getShopsTrackingBySurveyorId(p);
        this.obj = {
          startDate: moment(p.startDate).format("YYYY-MM-DD"),
          userId: p.userType,
          surveyorId: p.surveyorId,
        };
      }
    });
  }

  ngOnInit() {
    // tslint:disable-next-line:radix

    this.latitude = 24.8357775;
    this.longitude = 67.0264893;
    this.lat=24.8357775;
    this.lng = 67.0264893;
    this.projectType = localStorage.getItem("projectType");
  }

  getSupervisorData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem("user_type")),
      userId: parseInt(localStorage.getItem("user_id")),
      surveyorId: parseInt(localStorage.getItem("u_surveyor_id")),
    };
    this.httpService.getSupervisorList(obj).subscribe((data) => {
      this.supervisor = data;
      this.loading = false;
    });
  }

  getSurveyourData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem("user_type")),
      userId: parseInt(localStorage.getItem("user_id")),
      surveyorId: this.selectedSupervisorFilter,
    };
    this.httpService.getSupervisorList(obj).subscribe((data) => {
      this.surveyor = data;
      this.loading = false;
    });
  }

  refresh() {
    this.getShopsTrackingBySurveyorId(this.obj);
  }

  // goToEvaluation(id, visitType) {
  //   window.open(
  //     `${environment.hash}dashboard/evaluation/list/details/${id}/${visitType}`,
  //     "_blank"
  //   );
  // }
  // goToEvaluation() {
  //   window.open(`${environment.hash}dashboard/virtual_view/list/vo-live-tracking/${this.surveyorId}`, '_blank');
  // }
  // // goToMap(){

  // // }

  resetFilters() {
    this.selectedSupervisorFilter = -1;
    this.selectedSurveyorFilter = -1;
    this.startDate = new Date();
    this.prodata = -1;
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2, index?) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Number(index > 0 ? d.toFixed(2) : 0);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getShopsTrackingBySurveyorId(p) {
    this.totalDistanceCovered = 0;
    this.waypoints = [];
    this.trackedShops = [];
    this.loading = true;
    const obj = {
      startDate: moment(p.startDate).format("YYYY-MM-DD"),
      userId: p.userType,
      surveyorId: p.surveyorId,
    };
    this.httpService
      .getShopsForSurveyorLiveTrackingById(obj)
      .subscribe((res: any) => {
        if (res.length <= 0) {
          this.toastr.error("No Tracked Shops");
          // this.toastr.error(error.description, "Error");
          this.loading = false;
        } else {
          this.trackedShops = res.liveTrackingDataMap;
          console.log("trackedshops: ",this.trackedShops);
          this.dataShops = res.shopDataMap;
          this.visitedtrackedShops = this.trackedShops.filter(
            (t) => t.Type == "Visit"
          );
          this.setTimeDifference();
          this.removeMarkers();
          this.getvisitedShops();

          // this.getCapturedShops();
          this.latitude = this.trackedShops[0].latitude;
          this.longitude = this.trackedShops[0].longitude;
          this.visitedShops.forEach((element, i) => {
            element.trackNumber = (i + 1).toString();
            this.totalDistanceCovered =
              this.totalDistanceCovered +
              Math.ceil(
                i > 0
                  ? this.getDistanceFromLatLonInKm(
                      this.visitedShops[i - 1].latitude,
                      this.visitedShops[i - 1].longitude,
                      this.visitedShops[i].latitude,
                      this.visitedShops[i].longitude,
                      i
                    )
                  : 0
              );
            this.loading = false;
            const alldata = this.trackedShops.map((id) => {
              return id.shop_flag + "," + id.shop_status;
            });

            this.legends = new Set(alldata);
          });
          //console.log('this.trackedShops', this.trackedShops)

          let locations = this.trackedShops.map((m) => {
            let obj = {
              location: { lat: +m.latitude, lng: +m.longitude },
              stopover: true,
            };
            return obj;
          });

          // this.waypoints = locations.slice(0, 24);
          this.waypoints = locations;
          // this.trackedShops=[];
          // this.trackedShops=[...this.waypoints]
          this.loading = false;
        }
      });
  }

  removeMarkers() {
    for (let i = 0; i < this.trackedShops.length; i++) {
      this.trackedShops[i].isVisible = false;
    }
  }
  // onMapReady(map: any) {
  //   this.map = map;
  //   //this.calcRoute();
  //   this.mockDirections();
  //   this.initEvents();
  // }
  mockDirections() {
    const locationArray = this.waypoints.map(
      (l) => new google.maps.LatLng(l.location.lat, l.location.lng)
    );
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };
    this.line = new google.maps.Polyline({
      // strokeOpacity: 0.5,
      path: [],
      map: this.map,
      strokeColor: "#5FA5EB",
      strokeWeight: 6,
      icons: [
        {
          icon: lineSymbol,
          offset: "100%",
          repeat: "100px",
        },
      ],
    });
    locationArray.forEach((l) => this.line.getPath().push(l));

    // const start = new google.maps.LatLng(51.513237, -0.099102);
    // const end = new google.maps.LatLng(51.514786, -0.080799);

    // const startMarker = new google.maps.Marker({position: start, map: this.map, label: 'A'});
    // const endMarker = new google.maps.Marker({position: end, map: this.map, label: 'B'});
    this.initRoute();
  }
  initRoute() {
    const route = this.line.getPath().getArray();

    // options
    const options: TravelMarkerOptions = {
      map: this.map, // map object
      speed: 50, // default 10 , animation speed
      interval: 10, // default 10, marker refresh time
      cameraOnMarker: true, // default false, move camera with marker
      speedMultiplier: this.speedMultiplier,
      markerType: "overlay",
      markerOptions: {
        title: "Travel Marker",
        animation: google.maps.Animation.DROP,
        icon: {
          url: "./assets/images/bicycle.gif",
          // This marker is 20 pixels wide by 32 pixels high.
          animation: google.maps.Animation.DROP,
          // size: new google.maps.Size(256, 256),
          scaledSize: new google.maps.Size(128, 128),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(53, 110),
        },
      },
    };
    // define marker
    this.marker = new TravelMarker(options);

    // add locations from direction service

    const myArray: any = [];

    for (const wp of this.waypoints) {
      myArray.push(new google.maps.LatLng(wp.location.lat, wp.location.lng));
    }

    this.marker.addLocation(myArray);
    // this.marker.addLocation([new google.maps.LatLng(24.9625457,67.0461976), new google.maps.LatLng(24.9573833,67.0592702),
    //   new google.maps.LatLng(24.9603729, 67.0620511), new google.maps.LatLng(24.9488047, 67.0437489),
    //   new google.maps.LatLng(24.948709, 67.0438441)]);

    setTimeout(() => this.play(), 2000);
  }
  goToEvaluation(shop) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${shop.survey_id}?shopId=${shop.shop_id}&surveyorId=${shop.surveyor_id}&visitDate=${shop.visit_date}`,
      "_blank"
    );
  }
  // initEvents() {
  //   this.marker.event.onEvent((event: EventType, data: TravelData) => {
  //     for (let i = 0; i < this.trackedShops.length; i++) {
  //       if (data.index == i && this.trackedShops[i].Type == "Visit") {
  //         const obj = {
  //           longitude: this.trackedShops[i].longitude,
  //           latitude: this.trackedShops[i].latitude,
  //           time: this.trackedShops[i].time,
  //           visit_datetime: this.trackedShops[i].visit_datetime,
  //           Type: this.trackedShops[i].Type,
  //           shop_code: this.trackedShops[i].shop_code,
  //           shop_title: this.trackedShops[i].shop_title,
  //           survey_id: this.trackedShops[i].survey_id,
  //           end_time: this.trackedShops[i].end_time,
  //           shop_id: this.trackedShops[i].shop_id,
  //           surveyor_id: this.trackedShops[i].surveyor_id,
  //           visit_date: this.trackedShops[i].visit_date,
  //           address: this.trackedShops[i].address,
  //           remarks_id: this.trackedShops[i].remarks_id,
  //          // iconUrl:this.trackedShops[i].remarks_id==1 ? this.colorType + 'yellow' + '.png': this.colorType + 'red' + '.png',
  //           isVisible: true,
  //         };
  //         this.trackedShops.splice(i, 1, obj);
  //       }
  //     }
  //   });
  // }

  play() {
    this.marker.play();
  }

  // pause animation
  pause() {
    this.marker.pause();
  }

  // reset animation
  reset() {
    this.removeMarkers();
    this.marker.setSpeedMultiplier(10);
    this.marker.reset();
  }
  
  next() {
    this.marker.next();
  }

  // jump to previous location
  prev() {
    this.marker.prev();
  }

  // fast forward
  fast() {
    this.speedMultiplier *= 2;
    this.marker.setSpeedMultiplier(this.speedMultiplier);
  }

  // slow motion
  slow() {
    this.speedMultiplier /= 2;
    this.marker.setSpeedMultiplier(this.speedMultiplier);
  }

  getProductivityData() {
    const obj = {
      act: 22,
      supervisorId: this.selectedSupervisorFilter,
      surveyorId: this.selectedSurveyorFilter,
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      userId: localStorage.getItem("user_id"),
    };
    this.httpService.getProdata(obj).subscribe((data) => {
      this.prodata = data;
    });
  }

  getvisitedShops() {
    this.visitedShops = [];
    for (const visitShop of this.trackedShops) {
      if (visitShop.Type == "Visit") {
        this.visitedShops.push(visitShop);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
  }
  // getLiveShops() {
  //   this.trackedShops = [];
  //   for (const liveShop of this.trackedShops) {
  //     if (liveShop.liveTrackingDataMap == "Visit") {
  //       this.trackedShops.push(capShop);
  //     }
  //   }
  // }
  getTimeDifference(endTime, startTime) {
    var ms = moment(startTime, "HH:mm:ss").diff(moment(endTime, "HH:mm:ss"));
    var d = moment.duration(ms);
    return d.hours() + " hr " +  d.minutes() + " min " + d.seconds() + " sec";
  }

  setTimeDifference() {
    for (let i = 1; i < this.visitedtrackedShops.length; i++) {
      this.visitedtrackedShops[i].time_difference = this.getTimeDifference(
        this.visitedtrackedShops[i - 1].end_time,
        this.visitedtrackedShops[i].time
      );
    }
  }


  // new map working
  expanded: boolean = true;
  showAddEmployeeModal(): void {
    // this.addEmployee.show();
    this.expanded = !this.expanded;
  }
  hideAddEmployeeModal(): void {
    this.addEmployee.hide();
  }

  @ViewChild("addEmployee", { static: true }) addEmployee: ModalDirective;
    convertedLocationData: any;
    zoom= 15;
    // lat: number =33.7454491;
    // lng: number = 73.1884479;
    // for dataNew
    // lat: number =24.8336383;
    // lng: number = 67.0410542;
    lat =24.8357775;
    lng = 67.0264893;
    infoWindowStates: boolean[] = [];
    onMapReady(map: any) {
      // this.trackedShops = this.trackedShops.filter(e=> e.remarks_id != 1);
      this.lat = this.trackedShops[0].latitude;
      this.lng = this.trackedShops[0].longitude;
      console.log("this.lat: ",this.lat);
      console.log("this.lng: ",this.lng);
      console.log(" filtered this.trackedShops: ",this.trackedShops);
      this.convertedLocationData = this.trackedShops.map(coords => {
        return {
          latitude: coords.latitude,
          longitude: coords.longitude
        };
      });
      console.log(map);
      const centerLatLng = new google.maps.LatLng(this.lat, this.lng);

// Center the map on the specified coordinates
map.setCenter(centerLatLng);
      this.map = map;
      console.log("console.log(map);",map);
      this.mockDirections6();
      // this.initEvents();
    }
    initEvents() {
      if (this.marker && this.marker.event) {
        this.marker.event.onEvent((event: EventType, data: TravelData) => {
          const index = data.index;
          this.showMarkerAndOpenInfoWindow(index); // Call the method to show marker and open info window
        });
      } else {
        console.error('Marker or its event is not properly initialized.');
      }
    }
    showMarkerAndOpenInfoWindow(index: number) {
      // Check if convertedLocationData[index] exists and is defined
      if (this.convertedLocationData[index]) {
        // Show the marker
        this.convertedLocationData[index].isVisible = true;
    
        // Open the info window associated with the marker
        setTimeout(() => {
          // Close all other info windows
          this.closeAllInfoWindows();
    
          // Open the info window associated with the marker
          this.infoWindowStates[index] = true;
        }, 500); // Adjust the delay as needed
      } else {
        console.error(`Converted location data at index ${index} is undefined.`);
      }
    }
    
  
    closeAllInfoWindows() {
      // Close all info windows
      this.infoWindowStates.fill(false);
    }
    mockDirections5() {
      console.log("this.convertedLocationData: ",this.convertedLocationData);
      const waypoints = this.convertedLocationData.slice(1, -1).map(location => ({
        location: new google.maps.LatLng(location.latitude, location.longitude),
        stopover: true
      }));
    
      const start = new google.maps.LatLng(this.convertedLocationData[0].latitude, this.convertedLocationData[0].longitude);
      const end = new google.maps.LatLng(this.convertedLocationData[this.convertedLocationData.length - 1].latitude, this.convertedLocationData[this.convertedLocationData.length - 1].longitude);
    
      const directionsService = new google.maps.DirectionsService();
    
      const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      };
    
      directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          const route = response.routes[0].overview_path;
          this.drawRoute(route);
          this.initRoute4(route); // Call initRoute4 to initialize the marker and add locations
          // this.initEvents();
        } else {
          console.error('Directions request failed:', status);
        }
      });
    }
    drawRoute(route: google.maps.LatLng[]) {
      this.line = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: 'green',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });
    
      const startMarker = new google.maps.Marker({
        position: route[0],
        map: this.map,
        label: 'A'
      });
      const endMarker = new google.maps.Marker({
        position: route[route.length - 1],
        map: this.map,
        label: 'B'
      });
    
      // this.initRoute4(route);
    }
    
    initRoute4(route: google.maps.LatLng[]) {
      const options: TravelMarkerOptions = {
        map: this.map,
        speed: 50,
        interval: 10,
        speedMultiplier: this.speedMultiplier,

        // below line will show car icon which overides your given icon url
        markerType: "overlay",


        markerOptions: {
          title: 'Travel Marker',
          animation: google.maps.Animation.DROP,          icon: {
            animation: google.maps.Animation.DROP,


            // url: "./assets/images/bicycle.gif",
            // // This marker is 20 pixels wide by 32 pixels high.
            // animation: google.maps.Animation.DROP,
            // // size: new google.maps.Size(256, 256),
            // scaledSize: new google.maps.Size(128, 128),
            // // The origin for this image is (0, 0).
            // origin: new google.maps.Point(0, 0),
            // // The anchor for this image is the base of the flagpole at (0, 32).
            // anchor: new google.maps.Point(53, 110),

            url: 'https://i.imgur.com/eTYW75M.png',
            // url: './assets/images/rider.png',
            scaledSize: new google.maps.Size(64, 64),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(28, 54)
          }
        }
      };
    
      this.marker = new TravelMarker(options);
      this.marker.addLocation(route);
      setTimeout(() => this.play(), 2000);
    }
  
    // new map working end
    mockDirections6() {
      console.log("this.convertedLocationData: ",this.convertedLocationData);
      
      const batchSize = 25;
      const batches = [];
      
      // Divide waypoints into batches
      for (let i = 0; i < this.convertedLocationData.length; i += batchSize) {
        batches.push(this.convertedLocationData.slice(i, i + batchSize));
      }
      
      // Perform directions requests for each batch
      const requests = batches.map((batch, index) => {
        const waypoints = batch.slice(1, -1).map(location => ({
          location: new google.maps.LatLng(location.latitude, location.longitude),
          stopover: true
        }));
    
        const start = new google.maps.LatLng(batch[0].latitude, batch[0].longitude);
        const end = new google.maps.LatLng(batch[batch.length - 1].latitude, batch[batch.length - 1].longitude);
    
        const directionsService = new google.maps.DirectionsService();
    
        const request = {
          origin: start,
          destination: end,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };
    
        return new Promise((resolve, reject) => {
          directionsService.route(request, (response, status) => {
            if (status === 'OK') {
              resolve(response.routes[0].overview_path);
            } else {
              reject(`Directions request failed for batch ${index}: ${status}`);
            }
          });
        });
      });
    
      // Combine routes from all batches
      Promise.all(requests)
        .then(routes => {
          // Merge routes
          const combinedRoute = [].concat(...routes);
          this.drawRoute(combinedRoute);
          this.initRoute4(combinedRoute); // Call initRoute4 to initialize the marker and add locations
        })
        .catch(error => {
          console.error('Batch directions requests failed:', error);
        });
    }

  // new map working end
}
