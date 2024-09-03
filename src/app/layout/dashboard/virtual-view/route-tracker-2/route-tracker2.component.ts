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
  selector: "app-route-tracker2",
  templateUrl: "./route-tracker2.component.html",
  styleUrls: ["./route-tracker2.component.scss"],
})
export class RouteTracker2Component implements OnInit {
  convertedLocationData2 = [
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

  dataNew =  [
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:13:01 AM",
      "latitude": "24.8336383",
      "longitude": "67.0410542",
      "time": "09:13:01",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:15:02 AM",
      "latitude": "24.8337044",
      "longitude": "67.0409093",
      "time": "09:15:02",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:22:15 AM",
      "latitude": "24.8336809",
      "longitude": "67.0410434",
      "time": "09:22:15",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:22:15 AM",
      "latitude": "24.8336809",
      "longitude": "67.0410434",
      "time": "09:22:15",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:23:33 AM",
      "latitude": "24.8336718",
      "longitude": "67.0410523",
      "time": "09:23:33",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:23:33 AM",
      "latitude": "24.8336718",
      "longitude": "67.0410523",
      "time": "09:23:33",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:40:30 AM",
      "latitude": "24.8336824",
      "longitude": "67.0409781",
      "time": "09:40:30",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 9:43:31 AM",
      "latitude": "24.833705",
      "longitude": "67.0409917",
      "time": "09:43:31",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 10:34:28 AM",
      "latitude": "24.880445",
      "longitude": "67.0699",
      "time": "10:34:28",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387729,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "SAILKOT STORE \u0026 MILK SHOP",
      "channel": "Small General (SZ)",
      "visit_datetime": "Apr 19, 2024 10:35:01 AM",
      "latitude": "24.8805031",
      "longitude": "67.0698681",
      "time": "10:35:01",
      "end_time": "10:43:32",
      "address": "3 Alamgir Rd, Bahadurabad Bahadur Yar Jang CHS, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 805220,
      "visit_date": "2024-04-19",
      "timespent": "00:08:31"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 10:40:03 AM",
      "latitude": "24.8806585",
      "longitude": "67.0702515",
      "time": "10:40:03",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 10:43:42 AM",
      "latitude": "24.8807177",
      "longitude": "67.0702354",
      "time": "10:43:42",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387730,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "SIALKOT BAKERY",
      "channel": "Small General (SZ)",
      "visit_datetime": "Apr 19, 2024 10:43:58 AM",
      "latitude": "24.8807508",
      "longitude": "67.0705599",
      "time": "10:43:58",
      "end_time": "10:49:54",
      "address": "90 Street No 6, Darul Aman Society PECHS, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 759309,
      "visit_date": "2024-04-19",
      "timespent": "00:05:56"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 10:48:57 AM",
      "latitude": "24.8806637",
      "longitude": "67.0702379",
      "time": "10:48:57",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387731,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "Sailkot Store\u0026 Milk shop",
      "channel": "Bakery Fragmented",
      "visit_datetime": "Apr 19, 2024 10:50:19 AM",
      "latitude": "24.8806508",
      "longitude": "67.0702984",
      "time": "10:50:19",
      "end_time": "10:56:56",
      "address": "Society",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 806064,
      "visit_date": "2024-04-19",
      "timespent": "00:06:37"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 10:55:20 AM",
      "latitude": "24.8806522",
      "longitude": "67.0702364",
      "time": "10:55:20",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:00:59 AM",
      "latitude": "24.8806317",
      "longitude": "67.0698983",
      "time": "11:00:59",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:03:22 AM",
      "latitude": "24.8812806",
      "longitude": "67.066007",
      "time": "11:03:22",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:03:22 AM",
      "latitude": "24.8812806",
      "longitude": "67.066007",
      "time": "11:03:22",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387732,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "CRESENT NIMCO",
      "channel": "Bakery Fragmented",
      "visit_datetime": "Apr 19, 2024 11:03:45 AM",
      "latitude": "24.8819374",
      "longitude": "67.0672714",
      "time": "11:03:45",
      "end_time": "11:09:19",
      "address": "Society",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 806063,
      "visit_date": "2024-04-19",
      "timespent": "00:05:34"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:09:42 AM",
      "latitude": "24.8822477",
      "longitude": "67.0663906",
      "time": "11:09:42",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:09:42 AM",
      "latitude": "24.8822477",
      "longitude": "67.0663906",
      "time": "11:09:42",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:54:26 AM",
      "latitude": "24.8813792",
      "longitude": "67.0622836",
      "time": "11:54:26",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 11:55:15 AM",
      "latitude": "24.8816801",
      "longitude": "67.0611181",
      "time": "11:55:15",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387733,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "Orah Pharmacy",
      "channel": "Super Drug Store",
      "visit_datetime": "Apr 19, 2024 11:55:26 AM",
      "latitude": "24.8818119",
      "longitude": "67.0613036",
      "time": "11:55:26",
      "end_time": "12:25:17",
      "address": "Main shaheed-e-milat road Fatima jinnah colony near chugtai lab",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 858751,
      "visit_date": "2024-04-19",
      "timespent": "00:29:51"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:00:24 PM",
      "latitude": "24.8817158",
      "longitude": "67.0611292",
      "time": "12:00:24",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:05:22 PM",
      "latitude": "24.8819815",
      "longitude": "67.0613299",
      "time": "12:05:22",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:11:13 PM",
      "latitude": "24.8818763",
      "longitude": "67.0615002",
      "time": "12:11:13",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:16:44 PM",
      "latitude": "24.882115",
      "longitude": "67.0612312",
      "time": "12:16:44",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:20:45 PM",
      "latitude": "24.8819933",
      "longitude": "67.061295",
      "time": "12:20:45",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:24:45 PM",
      "latitude": "24.8816495",
      "longitude": "67.0611065",
      "time": "12:24:45",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:27:55 PM",
      "latitude": "24.88166",
      "longitude": "67.0611217",
      "time": "12:27:55",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:30:12 PM",
      "latitude": "24.88166",
      "longitude": "67.0611217",
      "time": "12:30:12",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:30:39 PM",
      "latitude": "24.8839817",
      "longitude": "67.0590833",
      "time": "12:30:39",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387734,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "DVAGO Pharmacy",
      "channel": "Perfect Drug Store",
      "visit_datetime": "Apr 19, 2024 12:30:54 PM",
      "latitude": "24.8837782",
      "longitude": "67.0579876",
      "time": "12:30:54",
      "end_time": "12:31:09",
      "address": "Soljer Bazar no 1 Near Bismillah super Mart Sadar karachi",
      "surveyor_id": 179,
      "remarks_id": 138,
      "shop_id": 810892,
      "visit_date": "2024-04-19",
      "timespent": "00:00:15"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:38:01 PM",
      "latitude": "24.8718667",
      "longitude": "67.05913",
      "time": "12:38:01",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:43:32 PM",
      "latitude": "24.8718578",
      "longitude": "67.0591837",
      "time": "12:43:32",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 12:48:33 PM",
      "latitude": "24.8718542",
      "longitude": "67.0591802",
      "time": "12:48:33",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:29:50 PM",
      "latitude": "24.8845467",
      "longitude": "67.064115",
      "time": "13:29:50",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387735,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "FAREED BAKERY",
      "channel": "Bakery Fragmented",
      "visit_datetime": "Apr 19, 2024 1:30:12 PM",
      "latitude": "24.8843955",
      "longitude": "67.0644107",
      "time": "13:30:12",
      "end_time": "13:30:18",
      "address": "9 Hadi Rd, CP \u0026 Berar Society BMCHS Sharafabad, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 3,
      "shop_id": 759273,
      "visit_date": "2024-04-19",
      "timespent": "00:00:06"
    },
    {
      "survey_id": 15387736,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "SA RAZZAQ",
      "channel": "Pharmacy Fragmented",
      "visit_datetime": "Apr 19, 2024 1:32:01 PM",
      "latitude": "24.8872325",
      "longitude": "67.0668978",
      "time": "13:32:01",
      "end_time": "13:32:14",
      "address": "16/5, Bihar Muslim Society BMCHS Sharafabad, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 73,
      "shop_id": 805279,
      "visit_date": "2024-04-19",
      "timespent": "00:00:13"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:35:31 PM",
      "latitude": "24.8906389",
      "longitude": "67.0626078",
      "time": "13:35:31",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387737,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "Mini Ration store",
      "channel": "Small General (SZ KS)",
      "visit_datetime": "Apr 19, 2024 1:35:56 PM",
      "latitude": "24.8905182",
      "longitude": "67.0626584",
      "time": "13:35:56",
      "end_time": "13:41:28",
      "address": "V3R7+85P, Chandni Chowk Chandni Chowk (New Town), Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 873320,
      "visit_date": "2024-04-19",
      "timespent": "00:05:32"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:40:57 PM",
      "latitude": "24.890629",
      "longitude": "67.0625793",
      "time": "13:40:57",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:44:45 PM",
      "latitude": "24.89036",
      "longitude": "67.0625833",
      "time": "13:44:45",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387738,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "HAMZA G ST",
      "channel": "Small General (SZ)",
      "visit_datetime": "Apr 19, 2024 1:45:06 PM",
      "latitude": "24.8864419",
      "longitude": "67.0612203",
      "time": "13:45:06",
      "end_time": "13:52:37",
      "address": "BCL Nestle Society Pwd - LASBELA",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 653784,
      "visit_date": "2024-04-19",
      "timespent": "00:07:31"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:49:40 PM",
      "latitude": "24.8864188",
      "longitude": "67.061219",
      "time": "13:49:40",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:53:49 PM",
      "latitude": "24.8863091",
      "longitude": "67.0614759",
      "time": "13:53:49",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:56:18 PM",
      "latitude": "24.8798767",
      "longitude": "67.0652567",
      "time": "13:56:18",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:59:45 PM",
      "latitude": "24.8798767",
      "longitude": "67.0652567",
      "time": "13:59:45",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 1:59:56 PM",
      "latitude": "24.873185",
      "longitude": "67.0616317",
      "time": "13:59:56",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387739,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "Pari Gernal Store",
      "channel": "Small General (SZ)",
      "visit_datetime": "Apr 19, 2024 2:00:11 PM",
      "latitude": "24.8733105",
      "longitude": "67.0616985",
      "time": "14:00:11",
      "end_time": "14:09:35",
      "address": "Plot 206 A, P.E.C.H.S Block 2 Block 2 PECHS, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 1,
      "shop_id": 873321,
      "visit_date": "2024-04-19",
      "timespent": "00:09:24"
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 2:06:05 PM",
      "latitude": "24.8730868",
      "longitude": "67.0619507",
      "time": "14:06:05",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 2:11:07 PM",
      "latitude": "24.8732873",
      "longitude": "67.0620865",
      "time": "14:11:07",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": -1,
      "Type": "Location",
      "shop_code": "",
      "shop_title": "",
      "channel": "",
      "visit_datetime": "Apr 19, 2024 2:15:39 PM",
      "latitude": "24.8729617",
      "longitude": "67.06179",
      "time": "14:15:39",
      "end_time": "",
      "address": "",
      "surveyor_id": -1,
      "remarks_id": -1,
      "shop_id": -1,
      "visit_date": "2024-04-19",
      "timespent": ""
    },
    {
      "survey_id": 15387740,
      "Type": "Visit",
      "shop_code": "N/A",
      "shop_title": "Bashir Brother Store",
      "channel": "Small General (SZ KS)",
      "visit_datetime": "Apr 19, 2024 2:15:55 PM",
      "latitude": "24.8710769",
      "longitude": "67.0610345",
      "time": "14:15:55",
      "end_time": "14:16:02",
      "address": "Plot 875 C, P.E.C.H.S Block 2 Block 2 PECHS, Karachi, Karachi City, Sindh, Pakistan",
      "surveyor_id": 179,
      "remarks_id": 2,
      "shop_id": 873322,
      "visit_date": "2024-04-19",
      "timespent": "00:00:07"
    }
  ];
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

    this.latitude = 30.644579;
    this.longitude = 73.0948515;
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
  // mockDirections() {
  //   const locationArray = this.waypoints.map(
  //     (l) => new google.maps.LatLng(l.location.lat, l.location.lng)
  //   );
  //   const lineSymbol = {
  //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //   };
  //   this.line = new google.maps.Polyline({
  //     // strokeOpacity: 0.5,
  //     path: [],
  //     map: this.map,
  //     strokeColor: "#5FA5EB",
  //     strokeWeight: 6,
  //     icons: [
  //       {
  //         icon: lineSymbol,
  //         offset: "100%",
  //         repeat: "100px",
  //       },
  //     ],
  //   });
  //   locationArray.forEach((l) => this.line.getPath().push(l));

  //   // const start = new google.maps.LatLng(51.513237, -0.099102);
  //   // const end = new google.maps.LatLng(51.514786, -0.080799);

  //   // const startMarker = new google.maps.Marker({position: start, map: this.map, label: 'A'});
  //   // const endMarker = new google.maps.Marker({position: end, map: this.map, label: 'B'});
  //   this.initRoute();
  // }
  // initRoute() {
  //   const route = this.line.getPath().getArray();

  //   // options
  //   const options: TravelMarkerOptions = {
  //     map: this.map, // map object
  //     speed: 50, // default 10 , animation speed
  //     interval: 10, // default 10, marker refresh time
  //     cameraOnMarker: true, // default false, move camera with marker
  //     speedMultiplier: this.speedMultiplier,
  //     markerType: "overlay",
  //     markerOptions: {
  //       title: "Travel Marker",
  //       animation: google.maps.Animation.DROP,
  //       icon: {
  //         url: "./assets/images/bicycle.gif",
  //         // This marker is 20 pixels wide by 32 pixels high.
  //         animation: google.maps.Animation.DROP,
  //         // size: new google.maps.Size(256, 256),
  //         scaledSize: new google.maps.Size(128, 128),
  //         // The origin for this image is (0, 0).
  //         origin: new google.maps.Point(0, 0),
  //         // The anchor for this image is the base of the flagpole at (0, 32).
  //         anchor: new google.maps.Point(53, 110),
  //       },
  //     },
  //   };
  //   // define marker
  //   this.marker = new TravelMarker(options);

  //   // add locations from direction service

  //   const myArray: any = [];

  //   for (const wp of this.waypoints) {
  //     myArray.push(new google.maps.LatLng(wp.location.lat, wp.location.lng));
  //   }

  //   this.marker.addLocation(myArray);
  //   // this.marker.addLocation([new google.maps.LatLng(24.9625457,67.0461976), new google.maps.LatLng(24.9573833,67.0592702),
  //   //   new google.maps.LatLng(24.9603729, 67.0620511), new google.maps.LatLng(24.9488047, 67.0437489),
  //   //   new google.maps.LatLng(24.948709, 67.0438441)]);

  //   setTimeout(() => this.play(), 2000);
  // }
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







  // new map worlimg
  convertedLocationData: any;
  zoom: number = 15;
  // lat: number =33.7454491;
  // lng: number = 73.1884479;
  // for dataNew
  lat: number =24.8336383;
  lng: number = 67.0410542;
  infoWindowStates: boolean[] = [];
  onMapReady(map: any) {
    this.convertedLocationData = this.dataNew.map(coords => {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
    });
    console.log(map);
    this.map = map;
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
      strokeColor: '#FF0000',
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
      markerOptions: {
        title: 'Travel Marker',
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://i.imgur.com/eTYW75M.png',
          scaledSize: new google.maps.Size(128, 128),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(53, 110)
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
  
}
