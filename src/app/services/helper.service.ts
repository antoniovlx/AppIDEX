import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private utilService: UtilService) { }

  perimetroDescubrimiento(superficie: number /* Hectareas */) {
    return Math.sqrt(3.93 * this.utilService.Has_Acres(superficie)) * 2.0 * Math.PI;
  }

  areaByMinVel(minuto: number, velocidadProp: number, superficieDet: number) // Hectareas
  {
    let factor = 0.0001 * Math.PI / 8.0;
    return factor * Math.pow(minuto, 2) * Math.pow(velocidadProp, 2) + superficieDet;
    //  return Acres_Has(0.0393 * pow(minuto, 2) * pow(velocidadProp / 60, 2)) + ZAMIF.SuperficieDet;
  }

  areaByPerimetro(perimetro: number) // Hectareas
  {
    const factor = 0.0001 / (5 * Math.PI);
    return factor * Math.pow(perimetro, 2);
  }

  perimetro(minuto: number, velocidadProp: number, intensidad: number) {
    const factor = Math.PI * Math.sqrt(5.0 / 8.0);
    return factor * velocidadProp * minuto;
  }

  lineaDescarga(rendimiento: number /* Metros */) {
    return rendimiento;
  }

  round(number: number){
    return parseFloat(number.toFixed(3));
  }
}
