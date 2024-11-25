import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'movilidad',
  templateUrl: './movilidad.component.html',
  styleUrls: ['./movilidad.component.scss'],
})
export class MovilidadComponent implements OnInit {
  @ViewChild('distancia')
  distanciaSelector: IonSelect;

  pesoCortafuego: string;
  pesoDistancia: string;

  movilidad: number;

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onClickPrev: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  updateCortafuego(val) {
    this.pesoCortafuego = val;

    if(this.pesoCortafuego === '-1'){
      this.pesoDistancia = '3';
      this.distanciaSelector.disabled = true;
    }else{
      this.distanciaSelector.disabled = false;
    }
    this.calcularMovilidad();
  }

  updateDistancia(val) {
    this.pesoDistancia = val;
    this.calcularMovilidad();
  }

  prev() {
    this.onClickPrev.emit(1);
  }


  next() {
    this.onClickNext.emit(1);
  }

  calcularMovilidad() {
    if (this.pesoDistancia !== undefined && this.pesoCortafuego !== undefined) {
      if(this.pesoCortafuego === '-1'){
        this.movilidad = 1;
      }else{
        this.movilidad = parseInt(this.pesoDistancia) * parseFloat(this.pesoCortafuego)
      }

      this.onInputChange.emit(this.movilidad);
    }
  }
}
