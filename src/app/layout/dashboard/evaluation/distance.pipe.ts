import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'distancePipe', pure: true })
export class DistancePipe implements PipeTransform {
  transform(index, lat1, lon1, lat2, lon2): any {
    var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return Number(index > 0 ? d.toFixed(2) : 0);
    }
  
    deg2rad(deg) {
      return deg * (Math.PI / 180)
    }

//   matchValue(data, value) {
//     return Object.keys(data).map((key) => {
//        return new RegExp(value, 'gi').test(data[key]);
//     }).some(result => result);
//   }
 }