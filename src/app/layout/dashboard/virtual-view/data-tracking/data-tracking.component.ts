import { Component, OnInit, ViewChild } from "@angular/core";
import { VirtualViewService } from "../virtual-view.service";
import { environment } from "src/environments/environment";
import { MatCardModule } from "@angular/material/card";
import { Config } from "src/assets/config";
import { ToastrService } from "ngx-toastr";
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
declare var google: any;
@Component({
  selector: "app-data-tracking",
  templateUrl: "./data-tracking.component.html",
  styleUrls: ["./data-tracking.component.scss"],
})
export class DataTrackingComponent implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  title = "Map With Track";

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
  trackedShops: any = [];
  prodata: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  legends;

  // colorType1 = '../../../../../assets/map-marker-icons/';
  colorType = Config.BASE_URI + "/images/map-marker-icons/";

  // colorType = 'assets/images/1.png';
  loading = false;
  labelOptions = {
    color: "red",
    fontFamily: "",
    fontSize: "18px",
    fontWeight: "bold",
  };
  index = 0;
  origin: any;
  destination: any;
  waypoints = [
    { location: { lat: 24.9379389, lng: 67.1514844 } },
    { location: { lat: 41.8339037, lng: -87.8720468 } },
  ];

  // map animations variables
  map: any;
  line: any;
  directionsService: any;
  marker: TravelMarker = null;
  speedMultiplier = 3;
  totalDistanceCovered: any = 0;
  capturedShops: any = [];

  constructor(
    private httpService: VirtualViewService,
    private toastr: ToastrService
  ) {
    this.latitude = 30.644579;
    this.longitude = 73.0948515;
  }

  ngOnInit() {
    // tslint:disable-next-line:radix
    this.getSupervisorData();
  }
  getNumber() {
    return this.index++;
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

  goToEvaluation(id, visitType) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${id}/${visitType}`,
      "_blank"
    );
  }

  resetFilters() {
    this.selectedSupervisorFilter = -1;
    this.selectedSurveyorFilter = -1;
    this.startDate = new Date();
  }
  getShopsTracking() {
    this.waypoints = [];
    this.trackedShops = [];
    this.capturedShops = [];

    if (this.selectedSurveyorFilter == -1) {
      this.totalDistanceCovered = 0;
      this.loading = true;
      const obj = {
        supervisorId: this.selectedSupervisorFilter,
        surveyorId: this.selectedSurveyorFilter,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        userId: localStorage.getItem("user_id"),
      };
      this.httpService.getShopsForTracking(obj).subscribe((res: any) => {
        this.trackedShops = [];
        this.trackedShops = res;
        this.loading = false;
        // this.latitude = this.trackedShops[0].latitude;
        // this.longitude = this.trackedShops[0].longitude;
        res.forEach((element, i) => {
          element.trackNumber = (i + 1).toString();
          this.totalDistanceCovered =
            this.totalDistanceCovered +
            Math.ceil(
              i > 0
                ? this.getDistanceFromLatLonInKm(
                    res[i - 1].latitude,
                    res[i - 1].longitude,
                    res[i].latitude,
                    res[i].longitude,
                    i
                  )
                : 0
            );
          const alldata = this.trackedShops.map((id) => {
            return id.shop_flag + "," + id.shop_statuss;
          });

          this.legends = new Set(alldata);
        });
        this.trackedShops = res;
        console.log("this.trackedShops", this.trackedShops);

        this.origin = {
          lat: +this.trackedShops[0].latitude,
          lng: +this.trackedShops[0].longitude,
        };
        this.destination = {
          lat: +this.trackedShops[this.trackedShops.length - 1].latitude,
          lng: +this.trackedShops[this.trackedShops.length - 1].longitude,
        };

        this.latitude = this.origin;
        this.longitude = this.destination;

        let locations = this.trackedShops.map((m) => {
          let obj = {
            location: { lat: +m.latitude, lng: +m.longitude },
            stopover: true,
          };
          return obj;
        });

        this.waypoints = locations.slice(0, 24);
        // this.trackedShops=[];
        // this.trackedShops=[...this.waypoints]
        console.log("waypoints", this.waypoints);
        this.loading = false;
      });
      this.getProductivityData();
    } else {
      this.totalDistanceCovered = 0;
      this.loading = true;
      const obj = {
        supervisorId: this.selectedSupervisorFilter,
        surveyorId: this.selectedSurveyorFilter,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        userId: localStorage.getItem("user_id"),
      };
      this.httpService
        .getShopsForSurveyorTracking(obj)
        .subscribe((res: any) => {
          if (res.length <= 0) {
            this.toastr.error("No Tracked Shops");
            // this.toastr.error(error.description, "Error");
            this.loading = false;
          } else {
            this.trackedShops = [];
            this.trackedShops = res;
            console.log(" this.trackedShops: ", this.trackedShops);
            this.getCapturedShops();
            // this.latitude = this.trackedShops[0].latitude;
            // this.longitude = this.trackedShops[0].longitude;
            this.capturedShops.forEach((element, i) => {
              element.trackNumber = (i + 1).toString();
              this.totalDistanceCovered =
                this.totalDistanceCovered +
                Math.ceil(
                  i > 0
                    ? this.getDistanceFromLatLonInKm(
                        this.capturedShops[i - 1].latitude,
                        this.capturedShops[i - 1].longitude,
                        this.capturedShops[i].latitude,
                        this.capturedShops[i].longitude,
                        i
                      )
                    : 0
                );
              this.loading = false;
              const alldata = this.capturedShops.map((id) => {
                return id.shop_flag + "," + id.shop_status;
              });

              this.legends = new Set(alldata);
            });
            // this.trackedShops = res;
            console.log("this.trackedShops", this.trackedShops);
if(this.capturedShops.length >0){
            this.origin = {
              lat: +this.capturedShops[0].latitude,
              lng: +this.capturedShops[0].longitude,
            };
            this.destination = {
              lat: +this.capturedShops[this.capturedShops.length - 1].latitude,
              lng: +this.capturedShops[this.capturedShops.length - 1].longitude,
            };

            this.latitude = this.origin;
            this.longitude = this.destination;
          }

            let locations = this.capturedShops.map((m) => {
              let obj = {
                location: { lat: +m.latitude, lng: +m.longitude },
                stopover: true,
              };
              return obj;
            });

            this.waypoints = locations.slice(0, 24);
            // this.trackedShops=[];
            // this.trackedShops=[...this.waypoints]
            console.log("waypoints", this.waypoints);
            this.loading = false;
          }
        });

      this.getProductivityData();
    }
  }
  onMapReady(map: any) {
    console.log("Testing this func is working......");
    console.log(map);
    this.map = map;
    // this.calcRoute();
    this.mockDirections();
    // this.initEvents();
  }
  mockDirections() {
    const locationArray = this.waypoints.map(
      (l) => new google.maps.LatLng(l.location.lat, l.location.lng)
    );
    this.line = new google.maps.Polyline({
      // strokeOpacity: 0.5,
      path: this.waypoints.map((m) => m.location),
      map: this.map,
      strokeColor: "#5FA5EB",
      strokeWeight: 6,
    });
    console.log("location array", locationArray);
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
      speedMultiplier: this.speedMultiplier,
      markerOptions: {
        title: "Travel Marker",
        animation: google.maps.Animation.DROP,
        icon: {
          url: "https://www.pngrepo.com/png/694/180/bicycle-pin.png",
          //  url:"https://cdn3.iconfinder.com/data/icons/map-markers-2-1/512/man_toilet-512.png",
          // url: 'https://cdn4.iconfinder.com/data/icons/user-icons-5/100/user-17-512.png',
          //   url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAAHFZJREFUeF7tXQl4Tlca/sxMLSHWEGultY9lVJWQEMPYSy0JEyKWJLYkJBERhKxIJJXFTgQRe0qnai9TaqeqNK2iJIraS4N2FGee9878FfHf7V/uvf9ynsfTPk/Ovef73vP+557znW8pQfb2BwLLli1j589/T5cuXaSCggJ69OgRPX78mPv35MkTrp+DQ1kqW9aB+6+jYzmqW7cuNWjQgBo3bkIBAf4l7HD+DwGbBiIycio7deoUXb78A927d49+/fVXevr0qUHcKFmyJDk4OFDlylWofv361KbNe5SQkGCz+NqU4qtWrWK7d++mEydO0o0b1zkimbOVKVOGateuTW3atKWePXuQj4+PzeBtE4qOHx/IPvvsM25levbsmTm5xPvuN954gxo1akRdu3al1NRUq8fdqhXs06cP+/zzz6mwsFAVMvENWqFCBerSpQtt2bLFavG3OsU2btzEMjOX05EjR7hNt5abo6MjeXh40Keffmp182BVCg0ePJht376dO82ZopUoUYLw789//jP95S9/4V6JT+nz58+JMcb9M0UrX748DRgwgFatWmU182EVisTGxrFly5bS9evXDZpnkKdcuXJUrVo1qlbNmVxcXKhBg/rc/8O0MHLkyFdwyspaybAa3rlzmy5evEQFBfl069Ytun37NkdqQwlXr149CgwMpLCwMIufF4tXoEOHDuzw4cP04sULWaTCCgQbVMuW71C7du0oPHySSbD48MN57OjRI/TVV19xtjC5hwXIhQ3+zp07TSKPLFBM2Nlihc/ImM+SkhJlrVJYmWrUqElubu2pT58+5Ovra1b9s7PXsG3bttHhw4fop59+krWSYfWaOTOahg83r4wm5NIrrzIrsOYS2s/Pn61bt1ayHQp7JFjHvby8KD4+XhWdZ8yYyXJzN9OFCxe4PZqUhr3X6NGjKSUlRRWZpcjI18fiBO7ZsyfbtWuXpF//n/70J852NGyYL02bNlUTus6Zk8iys7Pp/PnvJOswaNAg2rBhgybkl0o2ixLW1dWVHTt2TJJuuFoZMWI4zZs3T5M6hoWFsdWrV3NXSWINn/AePXrSzp07NKmLPvktRtCmTZuxvLxvxOaAMwt07tyZ9uzZYxG6devWne3fv0/S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',
          // This marker is 20 pixels wide by 32 pixels high.
          animation: google.maps.Animation.DROP,
          // size: new google.maps.Size(256, 256),
          scaledSize: new google.maps.Size(80, 80),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(45, 70),
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

  // play animation
  play() {
    this.marker.play();
  }

  // pause animation
  pause() {
    this.marker.pause();
  }

  // reset animation
  reset() {
    this.marker.reset();
  }

  // jump to next location
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

  initEvents() {
    this.marker.event.onEvent((event: EventType, data: TravelData) => {
      console.log(event, data);
    });
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

  getCapturedShops() {
    this.capturedShops = [];
    for (const capShop of this.trackedShops) {
      if (capShop.shop_status == "Captured") {
        this.capturedShops.push(capShop);
      }
    }
    // const noSuperVisor={
    //   supervisorList.
    // };
    console.log(this.capturedShops);
  }
}
