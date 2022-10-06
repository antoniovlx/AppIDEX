import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'accesibilidad',
  templateUrl: './accesibilidad.component.html',
  styleUrls: ['./accesibilidad.component.scss'],
})
export class AccesibilidadComponent implements OnInit {

  pesoPresencia: string;
  pesoDistancia: string;

  accesibilidad: number = 0;

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();

  constructor(private uiService: UiService) { }

  ngOnInit() { }

  updatePresencia(val: string) {
    this.pesoPresencia = val;
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
      this.accesibilidad = parseInt(this.pesoDistancia) * parseFloat(this.pesoPresencia)
      this.onInputChange.emit(this.accesibilidad);
    }
  }
}
