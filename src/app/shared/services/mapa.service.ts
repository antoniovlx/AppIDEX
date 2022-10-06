import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.utm';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor() { }

  addMarker(map: L.map, lat, lon): void {
    const marker = L.marker([lat, lon]);
    marker.addTo(map);
  }

  addUtmMarker(map: L.map, utmx, utmy, hustoUtm) {
    if ((utmx != "" && utmx != undefined) && (utmy != "" && utmy != undefined)) {
      var coord = this.convertToLatLng(utmx, utmy, hustoUtm);
      var marker = new L.Marker(coord);
      marker.addTo(map);
    }
  }

  setZoom(map: L.map, number: number) {
    map.setZoom(number);
  }

  setCenter(map: L.map, utmx, utmy, zone, zoom) {
    if ((utmx != "" && utmx != undefined) && (utmy != "" && utmy != undefined)) {
      var item = L.utm({ x: utmx, y: utmy, zone: zone, southHemi: false });
      var coord = item.latLng();
      map.panTo([coord.lat, coord.lng]);
      map.setZoom(zoom)
    }
  }

  setCenterLatLng(map: L.map, lat, lng, zoom) {
    if (lat != "" && lat != undefined && lng != "" && lng != undefined) {
      map.panTo([lat, lng])
      map.setZoom(zoom)
    }
  }

  convertToLatLng(utmx: string, utmy: string, husoUtm: number) {
    var item = L.utm({ x: utmx, y: utmy, zone: husoUtm, band: 'S' });
    return item.latLng();
  }

  convertToUtm(lat, lng): number[] {
    var marker = L.marker([lat, lng]);
    // convert to utm
    var utmx = marker.getLatLng().utm().x;
    var utmy = marker.getLatLng().utm().y;
    return [utmx, utmy];
  }

  clearMarkers(map: L.map) {
    /*this.markers.forEach(function (layer) {
      map.removeLayer(layer);
    });*/
    map.eachLayer(function (layer) {
      if (layer._latlng != undefined) {
        map.removeLayer(layer);
      }
    });
  }

  invalidateSize(map) {
    setTimeout(() => { map.invalidateSize() },
      100);
}
}
