import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import { Config } from "src/assets/config";
import { environment } from "src/environments/environment";

@Component({
  selector: "section-four-view",
  templateUrl: "./section-four-view.component.html",
  styleUrls: ["./section-four-view.component.scss"],
})
export class SectionFourViewComponent implements OnInit {
  pinsColor = ['green', '#90EE90','yellow'];
  @Input("data") data;
  map: any;
  locationData: any;
  centerPoint: any = [];
  mapSrc: SafeResourceUrl;
  url: any;
  projectType: any;

  constructor(public sanitizer: DomSanitizer) {
    console.log(" sec 4 localStorage.getItem(mapBoxToken): ", localStorage.getItem("mapBoxToken"));
    mapboxgl.accessToken = localStorage.getItem("mapBoxToken") || Config.MAPBOX_TOKEN;
    console.log(" sec 4 mapboxgl.accessToken: ", mapboxgl.accessToken);
  }

  ngOnInit() {
    // this.data = changes.data.currentValue;
    // console.log("this.data.mslTable: ", this.data.mslTable);

    // this.url =
    //   "https://maps.google.com/maps?q=" +
    //   this.lat +
    //   "%2C" +
    //   this.long +
    //   "&t=&z=13&ie=UTF8&iwloc=&output=embed";
    // this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    console.log(" sec 4 this.data: ", this.data);
    this.locationData = this.data.mslTable;
    this.getRadiusMap();

    // this.getMap();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.data = changes.data.currentValue;
  //   this.lat = this.data.mslTable[0].latitude;
  //   this.long = this.data.mslTable[0].longitude;
  //   console.log("this.data.mslTable: ", this.data.mslTable);
  //   this.url =
  //     "https://maps.google.com/maps?q=" +
  //     this.lat +
  //     "%2C" +
  //     this.long +
  //     "&t=&z=13&ie=UTF8&iwloc=&output=embed";
  //   this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  //   this.getMap();
  // }

  // not used
  getMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.locationData[0]?.longitude, this.locationData[0]?.latitude],
      zoom: 16,
    });

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>Merchandiser</strong><br/>
    <strong>Status: Current Visit Location</strong><br/>`
    );
    const popup2 = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>Current Shop Actual Location</strong><br/>`
    );
    const marker1 = new mapboxgl.Marker()
      .setLngLat([
        this.locationData[0]?.longitude,
        this.locationData[0]?.latitude,
      ])
      .setPopup(popup)
      .addTo(this.map);

    const marker2 = new mapboxgl.Marker({ color: "#b40219" })
      .setLngLat([
        this.locationData[0]?.shop_longitude || 0,
        this.locationData[0]?.shop_latitude || 0,
      ])
      .setPopup(popup2)
      .addTo(this.map);
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  getRadiusMap() {
    const that = this;
    const i = this.locationData?.findIndex((e) => e.type == "Visit");
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        this.locationData[i]?.longitude || this.locationData[i]?.shop_longitude || 74.41602929999999,
        this.locationData[i]?.latitude || this.locationData[i]?.shop_latitude || 31.4787269,
      ],
      zoom: 16,
    });

    this.map.on("style.load", function () {
      if (that.locationData[i]?.longitude && that.locationData[i]?.latitude)
        that.loadMapContent(i);
    });

    // for (const data of this.tableData) {
    //   const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    //     `<p><strong>Name: </strong>${data.fullName}<br/>
    //     <strong>Start Time: </strong>${data.startTime}<br/>
    //     <strong>Remarks: </strong>${data.remarks}</p>`
    //   );
    //   const marker1 = new mapboxgl.Marker()
    //     .setLngLat([data.longitude, data.latitude])
    //     .setPopup(popup)
    //     .addTo(this.map);
    // }
  }

  loadMapContent(visitIndex) {
    for (let i = 0; i < this.locationData?.length; i++) {
      if (i == visitIndex) {
        this.setRadius(visitIndex);
        this.setVisitPopUps(visitIndex);
      } else {
        this.setNonVisitPopUps(i);
      }
    }

    this.map.addControl(new mapboxgl.NavigationControl());
  }

  setRadius(visitIndex) {
    debugger;
    let _center = turf.point([
      this.locationData[visitIndex]?.longitude,
      this.locationData[visitIndex]?.latitude,
    ]);
    // let _radius = 0.05; // in km
    let _radius = this.locationData[visitIndex]?.allowed_radius/1000; // in km
    console.log("let _radius in km from current visit/ms location - from blue pin: ",_radius);
    let _options = {
      steps: 80,
      units: "kilometers" as const,
      properties: { foo: "bar" }, // or "mile"
    };

    let _circle = turf.circle(_center, _radius, _options);

    this.map.addSource("circleData", {
      type: "geojson",
      data: _circle,
    });

    this.map.addLayer({
      id: "circle-fill",
      type: "fill",
      source: "circleData",
      paint: {
        "fill-color": "yellow",
        "fill-opacity": 0.3,
      },
    });
  }

  setVisitPopUps(visitIndex) {
    debugger;
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>Shop Code:${this.locationData[visitIndex]?.shop_code}</strong><br/>
    <strong>Shop Title:${this.locationData[visitIndex]?.shop_title}</strong><br/>
    <strong>Visit Date:${this.locationData[visitIndex]?.visit_datetime}</strong><br/>
    <strong>Status: Current Visit Location</strong><br/>`
    );
    const popup2 = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>Current Shop Actual Location</strong><br/>`
    );

    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = 'url(./assets/images/icons8-shop-location-30.png)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = '100%';


    // Current Visit pin in blue color
    const marker1 = new mapboxgl.Marker()
      .setLngLat([
        this.locationData[visitIndex]?.longitude,
        this.locationData[visitIndex]?.latitude,
      ])
      .setPopup(popup)
      .addTo(this.map);

      // Current Shop pin in red color // also new shop icon
    const marker2 = new mapboxgl.Marker(el)
      .setLngLat([
        this.locationData[visitIndex]?.shop_longitude,
        this.locationData[visitIndex]?.shop_latitude,
      ])
      .setPopup(popup2)
      .addTo(this.map);
  }

  setNonVisitPopUps(nonVisitIndex) {
    debugger;
    // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    //   `<strong>Shop Code: ${this.locationData[nonVisitIndex].shop_code}</strong><br/>
    // <strong>Shop Title: ${this.locationData[nonVisitIndex].shop_title}</strong><br/>
    // <strong>Visit Date: ${this.locationData[nonVisitIndex].visit_datetime}</strong><br/>
    // <strong>Status: Shop Nearest to visit Location</strong><br/>
    // <button  backgroundcolor="#2196F3">
    //                     Go To Details
    //                   </button>`
    // );
    const that = this;
    const popupContent = document.createElement("div");
    popupContent.innerHTML = `<strong>Shop Code: ${this.locationData[nonVisitIndex]?.shop_code}</strong><br/>
    <strong>Shop Title: ${this.locationData[nonVisitIndex]?.shop_title}</strong><br/>
    <strong>Visit Date: ${this.locationData[nonVisitIndex]?.visit_datetime}</strong><br/>`;
    const atag = document.createElement("div");
    atag.innerHTML = `<button id="btn1" backgroundcolor="#2196F3"> Go To Details </button>`;
    popupContent.appendChild(atag);
    atag.addEventListener("click", (e) => {
      this.gotoNewPage(that.locationData[nonVisitIndex]);
    });
    let popup = new mapboxgl.Popup({}).setDOMContent(popupContent);

    // last visit pin in green color
    const marker1 = new mapboxgl.Marker({ color: this.pinsColor[nonVisitIndex] })
      .setLngLat([
        this.locationData[nonVisitIndex]?.longitude,
        this.locationData[nonVisitIndex]?.latitude,
      ])
      .setPopup(popup)
      .addTo(this.map);
  }

  gotoNewPage(item) {
    window.open(
      `${environment.hash}dashboard/evaluation/list/details/${item.surveyId}?shopId=${item.shop_id}&surveyorId=${item.surveyor_id}&visitDate=${item.visit_datetime}`,
      "_blank"
    );
  }
}
