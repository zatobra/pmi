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
  selector: "app-route-tracker-pmirm",
  templateUrl: "./route-tracker-pmirm.component.html",
  styleUrls: ["./route-tracker-pmirm.component.scss"],
})
export class RouteTrackerPMIRMComponent implements OnInit {
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
  merchandiserLocations: any = [];

  trackedShops: any = [];
  trackedShops2: any = [];
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
  index: number;
  totalDistance: number;
  planned: any;
  visited: any;

  constructor(
    private httpService: VirtualViewService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.labels = JSON.parse(localStorage.getItem("labelProperties"));
    this.title = this.labels.surveyorLabel;
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
    this.lat = 24.8357775;
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
          this.trackedShops2 = res.liveTrackingDataMap;
          console.log("trackedshops: ", this.trackedShops);
          this.dataShops = res.shopDataMap;
          debugger;
          this.planned = this.trackedShops2.filter(
            (e) => e.Type == "planned"
          ).length;
          this.visited = this.trackedShops2.filter(
            (e) => e.Type == "Visit"
          ).length;
          this.visitedtrackedShops = this.trackedShops.filter(
            (t) => t.Type == "Visit"
          );
          this.setTimeDifference();
          this.removeMarkers();
          // this.getvisitedShops();
          this.getMerchandiserLocations();

          // this.getCapturedShops();
          this.latitude = this.trackedShops[0].latitude;
          this.longitude = this.trackedShops[0].longitude;

          // Calculate total distance covered
          this.totalDistance = 0;
          for (let i = 0; i < this.merchandiserLocations.length - 1; i++) {
            const { latitude: lat1, longitude: lon1 } =
              this.merchandiserLocations[i];
            const { latitude: lat2, longitude: lon2 } =
              this.merchandiserLocations[i + 1];
            this.totalDistance += this.calculateDistance(
              lat1,
              lon1,
              lat2,
              lon2
            );
          }

          console.log(
            "Total distance covered:",
            this.totalDistance.toFixed(2),
            "kilometers"
          );

          this.merchandiserLocations.forEach((element, i) => {
            // element.trackNumber = (i + 1).toString();
            // this.totalDistanceCovered =
            //   this.totalDistanceCovered +
            //   Math.ceil(
            //     i > 0
            //       ? this.getDistanceFromLatLonInKm(
            //           parseFloat(this.merchandiserLocations[i - 1].latitude),
            //           parseFloat(this.merchandiserLocations[i - 1].longitude),
            //           parseFloat(this.merchandiserLocations[i].latitude),
            //           parseFloat(this.merchandiserLocations[i].longitude),
            //           i
            //         )
            //       : 0
            //   );
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

  // new working for totaldistance
  calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers
    return distance;
  }
  toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  removeMarkers() {
    for (let i = 0; i < this.trackedShops.length; i++) {
      this.trackedShops[i].isVisible = false;
    }
  }
 
 
  goToEvaluation(shop) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${shop.survey_id}?shopId=${shop.shop_id}&surveyorId=${shop.surveyor_id}&visitDate=${shop.visit_date}`,
      "_blank"
    );
  }
  initEvents() {
    debugger;
    this.marker.event.onEvent((event: EventType, data: TravelData) => {
      // debugger;
      // console.log("data: ", data);
      // console.log("event: ", event);
      for (let i = 0; i < this.convertedLocationData.length; i++) {
        if (data.index == i) {
          // this.index = i;

          // const obj = {
          //   longitude: this.trackedShops[i].longitude,
          //   latitude: this.trackedShops[i].latitude,
          //   time: this.trackedShops[i].time,
          //   visit_datetime: this.trackedShops[i].visit_datetime,
          //   Type: this.trackedShops[i].Type,
          //   shop_code: this.trackedShops[i].shop_code,
          //   shop_title: this.trackedShops[i].shop_title,
          //   survey_id: this.trackedShops[i].survey_id,
          //   end_time: this.trackedShops[i].end_time,
          //   shop_id: this.trackedShops[i].shop_id,
          //   surveyor_id: this.trackedShops[i].surveyor_id,
          //   visit_date: this.trackedShops[i].visit_date,
          //   address: this.trackedShops[i].address,
          //   remarks_id: this.trackedShops[i].remarks_id,
          //  // iconUrl:this.trackedShops[i].remarks_id==1 ? this.colorType + 'yellow' + '.png': this.colorType + 'red' + '.png',
          //   isVisible: true,
          // };
          // this.trackedShops.splice(i, 1, obj);

          // this.lat = this.trackedShops2[i].latitude;
          // console.log("this.lat: ",this.lat);
          //   this.lng = this.trackedShops2[i].longitude;
          // if ((data.index + 1) % 10 == 0) {
          //   console.log(
          //     "index: ",
          //     this.index,
          //     " -- (this.index+1)%10==0: ",
          //     (this.index + 1) % 10 == 0
          //   );
          //   // this.updateMapFocus(
          //   //   parseFloat(this.convertedLocationData[i].latitude),
          //   //   parseFloat(this.convertedLocationData[i].longitude)
          //   // );

          //   // this.map.setCenter({ lat: parseFloat(this.convertedLocationData[i].latitude),
          //   //   lng: parseFloat(this.convertedLocationData[i].longitude)});
          // }
        }
      }
    });
  }

  updateMapFocus(lat: any, lng: any) {
    this.lat = lat;
    this.lng = lng;
    console.log("this.lat: ", this.lat);
    console.log("this.lng: ", this.lng);
  }
  public markerClicked = (markerObj) => {
    if (this.map)
      this.map.setCenter({ lat: markerObj.latitude, lng: markerObj.longitude });
    console.log("clicked", markerObj, {
      lat: markerObj.latitude,
      lng: markerObj.longitude,
    });
  };

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
  }
  getMerchandiserLocations() {
    this.merchandiserLocations = [];
    for (const visitShop of this.trackedShops) {
      if (visitShop.Type == "Location") {
        this.merchandiserLocations.push(visitShop);
      }
    }
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
    return d.hours() + " hr " + d.minutes() + " min " + d.seconds() + " sec";
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
  zoom = 15;
  // lat: number =33.7454491;
  // lng: number = 73.1884479;
  // for dataNew
  // lat: number =24.8336383;
  // lng: number = 67.0410542;
  lat = 24.8357775;
  lng = 67.0264893;
  infoWindowStates: boolean[] = [];
  onMapReady(map: any) {
    this.trackedShops = this.trackedShops.filter((e) => e.Type == 'Location');
    this.lat = this.trackedShops[0].latitude;
    this.lng = this.trackedShops[0].longitude;
    console.log("this.lat: ", this.lat);
    console.log("this.lng: ", this.lng);
    console.log(" filtered this.trackedShops: ", this.trackedShops);
    this.convertedLocationData = this.trackedShops.map((coords) => {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    });
    console.log(map);
    const centerLatLng = new google.maps.LatLng(this.lat, this.lng);

    // Center the map on the specified coordinates
    map.setCenter(centerLatLng);
    this.map = map;
    console.log("console.log(map);", map);
    this.mockDirections6();
    // this.initEvents();
  }
  initEvents2() {
    debugger;
    if (this.marker && this.marker.event) {
      this.marker.event.onEvent((event: EventType, data: TravelData) => {
        debugger;
        const index = data.index;
        this.showMarkerAndOpenInfoWindow(index); // Call the method to show marker and open info window
      });
    } else {
      console.error("Marker or its event is not properly initialized.");
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
 
  drawRoute(route: google.maps.LatLng[]) {
    this.line = new google.maps.Polyline({
      path: route,
      geodesic: true,
      strokeColor: "#1f456E",
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map: this.map,
    });

    const startMarker = new google.maps.Marker({
      position: route[0],
      map: this.map,
      label: "A",
    });
    const endMarker = new google.maps.Marker({
      position: route[route.length - 1],
      map: this.map,
      label: "B",
    });

    // this.initRoute4(route);
  }
  // mapStyles = [
  //   {
  //     featureType: 'water',
  //     elementType: 'geometry',
  //     stylers: [{ color: 'red' }]
  //   },
  //   // Add more custom styles as needed
  // ];
  mapStyles = [
    // Set the overall color scheme of the map
    // {
    //   elementType: 'geometry',
    //   stylers: [
    //     { color: 'whitesmoke' } // Light gray background color
    //   ]
    // },
    // Customize the colors of roads
    {
      elementType: 'geometry.stroke',
      stylers: [
        { color: 'whitesmoke' } // Light gray road color
      ]
    },
    // Adjust the color of labels and icons
    {
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#616161' } // Dark gray text color
      ]
    },
    // Highlight parks and natural features
    // {
    //   featureType: 'landscape.natural',
    //   elementType: 'geometry.fill',
    //   stylers: [
    //     { color: '#e0e0e0' } // Light green color for parks
    //   ]
    // },
    // Remove points of interest
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' } // Hide points of interest icons
      ]
    },
    // Customize the appearance of water bodies
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#b3e5fc' } // Light blue color for water bodies
      ]
    }
  ];
  
  
  
  
  initRoute4(route: google.maps.LatLng[]) {
    const options: TravelMarkerOptions = {
      map: this.map,
      speed: 50,
      interval: 10,
      speedMultiplier: this.speedMultiplier,

      // below line will show car icon which overides your given icon url
      // markerType: "overlay",

      cameraOnMarker: true,  // default false, move camera with marker
      markerType: 'overlay',  // default: 'default'
      overlayOptions: {
        offsetX: 0, // default: 0, x-offset for overlay
        offsetY: 0, // default: 0, y-offset for overlay
        offsetAngle: 0, // default: 0, rotation-offset for overlay
        imageUrl: './assets/images/lDrin.png', // image used for overlay
        imageWidth: 36, // image width of overlay
        imageHeight: 58, // image height of overlay
      }
    };
    this.marker = new TravelMarker(options);
    this.marker.addLocation(route);
    // Subscribe to marker events after it's initialized
    this.initEvents();
    setTimeout(() => this.play(), 2000);
  }

  // new map working end
  mockDirections6() {
    console.log("this.convertedLocationData: ", this.convertedLocationData);
   // const slicedArray: number[] = this.convertedLocationData.slice(0, 122);
    const batchSize = 25;
    const batches = [];

    // Divide waypoints into batches
    for (let i = 0; i < this.convertedLocationData.length; i += batchSize) {
      batches.push(this.convertedLocationData.slice(i, i + batchSize));
    }

    // Perform directions requests for each batch
    const requests = batches.map((batch, index) => {
      const waypoints = batch.slice(1, -1).map((location) => ({
        location: new google.maps.LatLng(location.latitude, location.longitude),
        stopover: true,
      }));

      const start = new google.maps.LatLng(
        batch[0].latitude,
        batch[0].longitude
      );
      const end = new google.maps.LatLng(
        batch[batch.length - 1].latitude,
        batch[batch.length - 1].longitude
      );

      const directionsService = new google.maps.DirectionsService();

      const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      return new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
          if (status === "OK") {
            resolve(response.routes[0].overview_path);
          } else {
            reject(`Directions request failed for batch ${index}: ${status}`);
          }
        });
      });
    });

    // Combine routes from all batches
    Promise.all(requests)
      .then((routes) => {
        // Merge routes
        const combinedRoute = [].concat(...routes);
        this.drawRoute(combinedRoute);
        this.initRoute4(combinedRoute); // Call initRoute4 to initialize the marker and add locations
      })
      .catch((error) => {
        console.error("Batch directions requests failed:", error);
      });
  }

  // new map working end
}
