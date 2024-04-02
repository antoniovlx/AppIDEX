import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'accesibilidad',
  templateUrl: './accesibilidad.component.html',
  styleUrls: ['./accesibilidad.component.scss'],
})
export class AccesibilidadComponent implements OnInit {

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();

  @ViewChild('distancia')
  distanciaSelector: IonSelect;

  pesoPresencia: string;
  pesoDistancia: string;

  accesibilidad: number;

  constructor() { }

  ngOnInit() { }

  updatePresencia(val: string) {
    this.pesoPresencia = val;

    if(this.pesoPresencia === '-1'){
      this.pesoDistancia = '3';
      this.distanciaSelector.disabled = true;
    }else{
      this.distanciaSelector.disabled = false;
    }

    this.calcularAccesibilidad();
  }

  updateDistancia(val: string) {
    this.pesoDistancia = val;
    this.calcularAccesibilidad();
  }

  next() {
    this.onClickNext.emit(0);
  }

  calcularAccesibilidad(){
    if(this.pesoDistancia !== undefined && this.pesoPresencia !== undefined){

      if(this.pesoPresencia === '-1'){
        this.accesibilidad = 1;
      }else{
        this.accesibilidad = parseInt(this.pesoDistancia) * parseFloat(this.pesoPresencia);
      }

      this.onInputChange.emit(this.accesibilidad);
    }
  }
}
