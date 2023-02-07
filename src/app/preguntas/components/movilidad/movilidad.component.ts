import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'movilidad',
  templateUrl: './movilidad.component.html',
  styleUrls: ['./movilidad.component.scss'],
})
export class MovilidadComponent implements OnInit {
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
