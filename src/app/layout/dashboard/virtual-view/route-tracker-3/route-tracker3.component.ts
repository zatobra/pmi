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
import { InfoWindowManager } from '@agm/core';
import * as _ from "lodash";
import {
  EventType,
  TravelData,
  TravelMarker,
  TravelMarkerOptions,
} from "travel-marker";
// import * as locationData from '../loc';


@Component({
  selector: "app-route-tracker3",
  templateUrl: "./route-tracker3.component.html",
  styleUrls: ["./route-tracker3.component.scss"],
})
export class RouteTracker3Component implements OnInit {
  convertedLocationData: { latitude: number; longitude: number; }[];
  locationData2 = [
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:25:47 AM",
      latitude: 33.7454491,
      longitude: 73.1884479,
      "time": "11:25:47",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:26:23 AM",
      latitude: 33.7453093,
      longitude: 73.1885091,
      "time": "11:26:23",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": 15272860,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "PCC Barakaho",
      "channel": "Super Markets",
      "visit_datetime": "Mar 28, 2024 11:26:42 AM",
      latitude: 33.7452281,
      longitude: 73.1885235,
      "time": "11:26:42",
      "end_time": "12:46:11",
      "address": "Main Muree Road",
      "surveyor_id": 901,
      "remarks_id": 1,
      "shop_id": 653004,
      "visit_date": "2024-03-28",
      "timespent": "01:19:29"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:33:23 AM",
      latitude: 33.7464866,
      longitude: 73.1908271,
      "time": "11:33:23",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:39:23 AM",
      latitude: 33.7464866,
      longitude: 73.1908271,
      "time": "11:39:23",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:45:23 AM",
      latitude: 33.7464866,
      longitude: 73.1908271,
      "time": "11:45:23",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:51:23 AM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "11:51:23",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 11:58:28 AM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "11:58:28",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:02:28 PM",
      latitude: 33.7464866,
      longitude: 73.1908271,
      "time": "12:02:28",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:06:28 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:06:28",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:12:28 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:12:28",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:17:40 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:17:40",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:21:40 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:21:40",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:25:41 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:25:41",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:28:59 PM",
      latitude: 33.7465381,
      longitude: 73.1911958,
      "time": "12:28:59",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:34:59 PM",
      latitude: 33.7447694,
      longitude: 73.1882461,
      "time": "12:34:59",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:40:58 PM",
      latitude: 33.7415922,
      longitude: 73.1849277,
      "time": "12:40:58",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:40:59 PM",
      latitude: 33.7415922,
      longitude: 73.1849277,
      "time": "12:40:59",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Mar 28, 2024 12:46:59 PM",
      latitude: 33.7445636,
      longitude: 73.1867713,
      "time": "12:46:59",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-03-28",
      "timespent": ""
    }
  ];
  locationData = [
    [51.51324, -0.09909000000000001],
    [51.5133, -0.09908],
    [51.5133, -0.09908],
    [51.513290000000005, -0.09895000000000001],
    [51.513290000000005, -0.09885000000000001],
    [51.513290000000005, -0.09871],
    [51.513290000000005, -0.09861],
    [51.513290000000005, -0.0985],
    [51.513290000000005, -0.09838000000000001],
    [51.51328, -0.09826000000000001],
    [51.51328, -0.09826000000000001],
    [51.5133, -0.09816000000000001],
    [51.51332000000001, -0.0981],
    [51.51334000000001, -0.09806000000000001],
    [51.51339, -0.098],
    [51.513400000000004, -0.09791000000000001],
    [51.51342, -0.09781000000000001],
    [51.51343000000001, -0.09767],
    [51.513450000000006, -0.09756000000000001],
    [51.51346, -0.09748000000000001],
    [51.51346, -0.09741000000000001],
    [51.513470000000005, -0.09732],
    [51.51344, -0.09719000000000001],
    [51.51342, -0.09705000000000001],
    [51.51341000000001, -0.09694000000000001],
    [51.51339, -0.09681000000000001],
    [51.513360000000006, -0.09648000000000001],
    [51.51335, -0.09634000000000001],
    [51.51335, -0.09634000000000001],
    [51.51342, -0.09634000000000001],
    [51.513470000000005, -0.09634000000000001],
    [51.51350000000001, -0.09633000000000001],
    [51.513540000000006, -0.09634000000000001],
    [51.513580000000005, -0.09634000000000001],
    [51.51364, -0.09636],
    [51.51368, -0.09637000000000001],
    [51.513720000000006, -0.09638000000000001],
    [51.51375, -0.09639],
    [51.5138, -0.09642],
    [51.513830000000006, -0.09643],
    [51.513850000000005, -0.09644000000000001],
    [51.513870000000004, -0.09646],
    [51.51391, -0.09649],
    [51.513960000000004, -0.09652000000000001],
    [51.51399000000001, -0.09656],
    [51.514030000000005, -0.09659000000000001],

  ];



//   locationData: any;
//   ngOnInit(): void {
//     // throw new Error("Method not implemented.");
//     this.locationData = [[51.51324,-0.09909000000000001],[51.5133,-0.09908],[51.5133,-0.09908],[51.513290000000005,-0.09895000000000001],[51.513290000000005,-0.09885000000000001],[51.513290000000005,-0.09871],[51.513290000000005,-0.09861],[51.513290000000005,-0.0985],[51.513290000000005,-0.09838000000000001],[51.51328,-0.09826000000000001],[51.51328,-0.09826000000000001],[51.5133,-0.09816000000000001],[51.51332000000001,-0.0981],[51.51334000000001,-0.09806000000000001],[51.51339,-0.098],[51.513400000000004,-0.09791000000000001],[51.51342,-0.09781000000000001],[51.51343000000001,-0.09767],[51.513450000000006,-0.09756000000000001],[51.51346,-0.09748000000000001],[51.51346,-0.09741000000000001],[51.513470000000005,-0.09732],[51.51344,-0.09719000000000001],[51.51342,-0.09705000000000001],[51.51341000000001,-0.09694000000000001],[51.51339,-0.09681000000000001],[51.513360000000006,-0.09648000000000001],[51.51335,-0.09634000000000001],[51.51335,-0.09634000000000001],[51.51342,-0.09634000000000001],[51.513470000000005,-0.09634000000000001],[51.51350000000001,-0.09633000000000001],[51.513540000000006,-0.09634000000000001],[51.513580000000005,-0.09634000000000001],[51.51364,-0.09636],[51.51368,-0.09637000000000001],[51.513720000000006,-0.09638000000000001],[51.51375,-0.09639],[51.5138,-0.09642],[51.513830000000006,-0.09643],[51.513850000000005,-0.09644000000000001],[51.513870000000004,-0.09646],[51.51391,-0.09649],[51.513960000000004,-0.09652000000000001],[51.51399000000001,-0.09656],[51.514030000000005,-0.09659000000000001],[51.514120000000005,-0.09671],[51.514160000000004,-0.09675],[51.514210000000006,-0.09680000000000001],[51.51424,-0.09685],[51.514250000000004,-0.09688000000000001],[51.51428000000001,-0.09690000000000001],[51.514300000000006,-0.09692],[51.51433,-0.09693],[51.51437000000001,-0.09694000000000001],[51.514410000000005,-0.09695000000000001],[51.51447,-0.09694000000000001],[51.514520000000005,-0.09694000000000001],[51.51462,-0.09693],[51.51462,-0.09693],[51.514610000000005,-0.09681000000000001],[51.51456,-0.09655000000000001],[51.514540000000004,-0.09644000000000001],[51.514480000000006,-0.09621],[51.514430000000004,-0.09595000000000001],[51.514410000000005,-0.09586000000000001],[51.51435000000001,-0.09552000000000001],[51.514320000000005,-0.09534000000000001],[51.51429,-0.09508000000000001],[51.51422,-0.09473000000000001],[51.5142,-0.09461000000000001],[51.51418,-0.09445],[51.514140000000005,-0.09419000000000001],[51.514140000000005,-0.09419000000000001],[51.51437000000001,-0.09411000000000001],[51.51455000000001,-0.09404000000000001],[51.51456,-0.09404000000000001],[51.51458,-0.09402],[51.514590000000005,-0.09401000000000001],[51.514630000000004,-0.09396],[51.514660000000006,-0.09394000000000001],[51.51476,-0.09382000000000001],[51.51485,-0.09374],[51.51489,-0.0937],[51.51494,-0.09365000000000001],[51.51500000000001,-0.09361000000000001],[51.51507,-0.09357000000000001],[51.515100000000004,-0.09354000000000001],[51.51512,-0.09353],[51.515170000000005,-0.09350000000000001],[51.51527,-0.09345],[51.51532,-0.09343000000000001],[51.515370000000004,-0.09340000000000001],[51.51543,-0.09336000000000001],[51.51543,-0.09336000000000001],[51.51538000000001,-0.09323000000000001],[51.5153,-0.09307000000000001],[51.51527,-0.09301000000000001],[51.515260000000005,-0.09296],[51.515240000000006,-0.09293000000000001],[51.51523,-0.09288],[51.51520000000001,-0.09273],[51.51518,-0.0926],[51.515150000000006,-0.09245],[51.51511000000001,-0.09213],[51.51503,-0.09135],[51.514990000000004,-0.09107000000000001],[51.51494,-0.09061000000000001],[51.51491000000001,-0.09035000000000001],[51.51491000000001,-0.09035000000000001],[51.51489,-0.09018000000000001],[51.514810000000004,-0.08967000000000001],[51.514790000000005,-0.08956],[51.514770000000006,-0.08943000000000001],[51.51475000000001,-0.08932000000000001],[51.51475000000001,-0.08926],[51.51473000000001,-0.08912],[51.514720000000004,-0.08901],[51.514700000000005,-0.08884],[51.514680000000006,-0.08856000000000001],[51.51467,-0.08845],[51.51467,-0.0884],[51.51465,-0.08808],[51.51464000000001,-0.08783],[51.514630000000004,-0.08779],[51.514630000000004,-0.08779],[51.51447,-0.08767000000000001],[51.51433,-0.08758],[51.514140000000005,-0.08743000000000001],[51.513920000000006,-0.08728000000000001],[51.513920000000006,-0.08728000000000001],[51.513960000000004,-0.08704],[51.514010000000006,-0.08681000000000001],[51.514030000000005,-0.08672],[51.514050000000005,-0.08665],[51.514070000000004,-0.08657000000000001],[51.514100000000006,-0.08646000000000001],[51.51411,-0.0864],[51.514120000000005,-0.08633],[51.514120000000005,-0.08620000000000001],[51.514140000000005,-0.08593],[51.514160000000004,-0.08578000000000001],[51.514160000000004,-0.08567000000000001],[51.514190000000006,-0.08545000000000001],[51.5142,-0.08537],[51.51424,-0.08509000000000001],[51.51429,-0.08482],[51.51431,-0.08469],[51.51435000000001,-0.08441000000000001],[51.5144,-0.08415],[51.51442,-0.08402000000000001],[51.51442,-0.08396],[51.514430000000004,-0.08391000000000001],[51.514430000000004,-0.08386],[51.514430000000004,-0.08380000000000001],[51.51442,-0.08374000000000001],[51.5144,-0.08366000000000001],[51.5144,-0.08366000000000001],[51.51446000000001,-0.08358],[51.51453000000001,-0.0835],[51.51464000000001,-0.08336],[51.51473000000001,-0.08322],[51.51489,-0.083],[51.51493000000001,-0.08295000000000001],[51.51493000000001,-0.08295000000000001],[51.514880000000005,-0.08285000000000001],[51.5148,-0.08264],[51.51478,-0.08261],[51.514770000000006,-0.08257],[51.514770000000006,-0.08256000000000001],[51.51476,-0.08252000000000001],[51.51475000000001,-0.08248000000000001],[51.51474,-0.08237000000000001],[51.514720000000004,-0.08226000000000001],[51.51469,-0.08214],[51.51467,-0.08207],[51.514660000000006,-0.08204],[51.51464000000001,-0.08201000000000001],[51.51462,-0.08198000000000001],[51.514590000000005,-0.08195000000000001],[51.51455000000001,-0.08191000000000001],[51.51451,-0.08188000000000001],[51.51451,-0.08188000000000001],[51.514520000000005,-0.08135],[51.514520000000005,-0.08132],[51.51451,-0.08129],[51.514500000000005,-0.08125],[51.51449,-0.08118],[51.514430000000004,-0.08099],[51.514430000000004,-0.08099],[51.51455000000001,-0.0809],[51.5146,-0.08088000000000001],[51.51464000000001,-0.08085],[51.51475000000001,-0.08080000000000001],[51.51478,-0.08078]];
//   }
//   // // google maps zoom level
//   // zoom: number = 15;

//   // // initial center position for the map
//   // lat: number = 51.512802;
//   // lng: number = -0.091324;

//   // map: any;
//   // line: any;
//   // directionsService: any;
//   // marker: TravelMarker = null;

//   // // speedMultiplier to control animation speed
//   // speedMultiplier = 1;

//   // onMapReady(map: any) {
//   //   console.log(map);
//   //   this.map = map;
//   //   // this.calcRoute();
//   //   this.mockDirections();
//   //   // this.initEvents();
//   // }

//   // /**
//   //  *                  IMPORTANT NOTICE
//   //  *  Google stopped its FREE TIER for Directions service.
//   //  *  Hence the below route calculation will not work unless you provide your own key with directions api enabled
//   //  *
//   //  *  Meanwhile, for the sake of demo, precalculated value will be used
//   //  */

//   // // get locations from direction service
//   // calcRoute() {
//   //   this.line = new google.maps.Polyline({
//   //     strokeOpacity: 0.5,
//   //     path: [],
//   //     map: this.map,
//   //   });

//   //   const start = new google.maps.LatLng(33.7454491, 73.1884479);
//   //   const end = new google.maps.LatLng(33.7401415, 73.1793968);
//   //   const request = {
//   //     origin: start,
//   //     destination: end,
//   //     travelMode: google.maps.TravelMode.BICYCLING,
//   //   };
//   //   this.directionsService = new google.maps.DirectionsService();
//   //   this.directionsService.route(request, (response, status) => {
//   //     // Empty response as API KEY EXPIRED
//   //     console.log(response);
//   //     if (status == google.maps.DirectionsStatus.OK) {
//   //       var legs = response.routes[0].legs;
//   //       for (let i = 0; i < legs.length; i++) {
//   //         var steps = legs[i].steps;
//   //         for (let j = 0; j < steps.length; j++) {
//   //           var nextSegment = steps[j].path;
//   //           for (let k = 0; k < nextSegment.length; k++) {
//   //             this.line.getPath().push(nextSegment[k]);
//   //           }
//   //         }
//   //       }
//   //       this.initRoute();
//   //     }
//   //   });
//   // }

//   // /**
//   //  *                  IMPORTANT NOTICE
//   //  *  Google stopped its FREE TIER for Directions service.
//   //  *  Hence the below route calculation will not work unless you provide your own key with directions api enabled
//   //  *
//   //  *  Meanwhile, for the sake of demo, precalculated value will be used
//   //  */

//   // // mock directions api
//   // mockDirections() {
//   //   const locationArray = this.locationData.map(
//   //     (l) => new google.maps.LatLng(l[0], l[1])
//   //   );
//   //   this.line = new google.maps.Polyline({
//   //     strokeOpacity: 0.5,
//   //     path: [],
//   //     map: this.map,
//   //   });
//   //   locationArray.forEach((l) => this.line.getPath().push(l));

//   //   const start = new google.maps.LatLng(33.7454491, 73.1884479);
//   //   const end = new google.maps.LatLng(33.7401415, 73.1793968);

//   //   const startMarker = new google.maps.Marker({
//   //     position: start,
//   //     map: this.map,
//   //     label: 'A',
//   //   });
//   //   const endMarker = new google.maps.Marker({
//   //     position: end,
//   //     map: this.map,
//   //     label: 'B',
//   //   });
//   //   this.initRoute();
//   // }

//   // // initialize travel marker
//   // initRoute() {
//   //   const route = this.line.getPath().getArray();

//   //   // options
//   //   const options: TravelMarkerOptions = {
//   //     map: this.map, // map object
//   //     speed: 50, // default 10 , animation speed
//   //     interval: 10, // default 10, marker refresh time
//   //     speedMultiplier: this.speedMultiplier,
//   //     markerOptions: {
//   //       title: 'Travel Marker',
//   //       animation: google.maps.Animation.DROP,
//   //       icon: {
//   //         url: 'https://i.imgur.com/eTYW75M.png',
//   //         // This marker is 20 pixels wide by 32 pixels high.
//   //         animation: google.maps.Animation.DROP,
//   //         // size: new google.maps.Size(256, 256),
//   //         scaledSize: new google.maps.Size(128, 128),
//   //         // The origin for this image is (0, 0).
//   //         origin: new google.maps.Point(0, 0),
//   //         // The anchor for this image is the base of the flagpole at (0, 32).
//   //         anchor: new google.maps.Point(53, 110),
//   //       },
//   //     },
//   //   };

//   //   // define marker
//   //   this.marker = new TravelMarker(options);

//   //   // add locations from direction service
//   //   this.marker.addLocation(route);

//   //   setTimeout(() => this.play(), 2000);
//   // }

//   // // play animation
//   // play() {
//   //   this.marker.play();
//   // }

//   // // pause animation
//   // pause() {
//   //   this.marker.pause();
//   // }

//   // // reset animation
//   // reset() {
//   //   this.marker.reset();
//   // }

//   // // jump to next location
//   // next() {
//   //   this.marker.next();
//   // }

//   // // jump to previous location
//   // prev() {
//   //   this.marker.prev();
//   // }

//   // // fast forward
//   // fast() {
//   //   this.speedMultiplier *= 2;
//   //   this.marker.setSpeedMultiplier(this.speedMultiplier);
//   // }

//   // // slow motion
//   // slow() {
//   //   this.speedMultiplier /= 2;
//   //   this.marker.setSpeedMultiplier(this.speedMultiplier);
//   // }

//   // initEvents() {
//   //   this.marker.event.onEvent((event: EventType, data: TravelData) => {
//   //     console.log(event, data);
//   //   });
//   // }




//   // lat: Number = 24.799448
//   // lng: Number = 120.979021
//   // origin = { lat: 24.799448, lng: 120.979021 }
//   // destination = { lat: 24.799524, lng: 120.975017 }
//   isEdit = false;
//   markerOptions = {
//     origin: {
//       draggable: false,
//     },
//     destination: {
//       draggable: false,
//     },
//   }
//   renderOptions = {
//     suppressMarkers: true,
//   }

  
//   lat: Number = 40.211657003508144
//   lng: Number = -8.44309341946412

//   origin = { lat: 40.211657003508144, lng: -8.44309341946412 }
//   destination = { lat: 40.166210298703, lng: -8.87219589987565 }
//   waypoints = [
//     //  {location: { lat: 39.0921167, lng: -94.8559005 }},
//     //  {location: { lat: 41.8339037, lng: -87.8720468 }}
//   ]

//   enableEdit() {
//     this.isEdit = true;
//     this.markerOptions = {
//       ...this.markerOptions,
//       origin: {
//         draggable: true,
//       },
//       destination: {
//         draggable: true,
//       }
//     };
//   }

//   onChange(event: any) {
//     console.log(event);
//     // You can do anything.
//   }

//   onOriginDrag(event: any) {
//     console.log('origin', event);
//   }

//   onDestinationDrag(event: any) {
//     console.log('destination', event);
//   }




//   initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 14,
//         center: {lat: 33.7464866, lng: 73.1908271} // Set initial center point
//     });

//     var directionsService = new google.maps.DirectionsService();
//     var directionsRenderer = new google.maps.DirectionsRenderer({
//         map: map
//     });

//     var request = {
//         origin: {lat: 33.7454491, lng: 73.1884479},
//         destination: {lat: 33.7445636, lng: 73.1867713},
//         travelMode: google.maps.TravelMode.DRIVING
//     };

//     directionsService.route(request, function(result, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             directionsRenderer.setDirections(result);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }
// onMapReady(map: any) {
//   console.log(map);
//   // this.map = map;
//   // this.calcRoute();
//   this.initMap();
//   // this.initEvents();
// }



  // startLat = 33.7464866;
  // startLng = 73.1908271;
  // zoom = 14;
  // startCoords = { lat: 33.7454491, lng: 73.1884479 };
  // endCoords = { lat: 33.7445636, lng: 73.1867713 };

  // constructor() {}

  // ngOnInit() {}

  startLat = 33.7454491;
  startLng = 73.1884479;
  zoom = 14;
  startCoords = { lat: 33.7454491, lng: 73.1884479 };
  endCoords = { lat: 33.7445636, lng: 73.1867713 };
  // coordinates = [
  //   { lat: 33.7454491, lng: 73.1884479 },
  //   { lat: 33.7453093, lng: 73.1885091 },
  //   { lat: 33.7452281, lng: 73.1885235 },
  //   { lat: 33.7464866, lng: 73.1908271 },
  //   { lat: 33.7465381, lng: 73.1911958 },
  // ];
  coordinates =  this.locationData2.map(coords => {
    return {
      lat: coords.latitude,
      lng: coords.longitude
    };
  });
 
  waypoints = this.coordinates.slice(1, -1).map((coord) => {
    return { location: coord, stopover: true };
  });
  

  constructor() {}

  ngOnInit() {
    // this.convertedLocationData = this.locationData.map(coords => {
    //   return {
    //     latitude: coords[0],
    //     longitude: coords[1]
    //   };
    // });
    // this.convertedLocationData = this.locationData2.map(coords => {
    //   return {
    //     latitude: coords.latitude,
    //     longitude: coords.longitude
    //   };
    // });
    console.log("this.coordinates: ", this.coordinates);

  }
}
