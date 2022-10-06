import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'medios',
  templateUrl: './medios.component.html',
  styleUrls: ['./medios.component.scss'],
})
export class MediosComponent implements OnInit {

  distanciaHelicopteros: string;
  distanciaAvionesAnfibios: string;
  distanciaAvionesCarga: string;

  medios: number = 0;

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onClickPrev: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();

  constructor(private uiService: UiService) { }

  ngOnInit() { }

  updateDistanciaAvionesAnfibios(val: string) {
    this.distanciaAvionesAnfibios = val;
    this.calcularMedios();
  }

  updateDistanciaAvionesCarga(val: string) {
    this.distanciaAvionesCarga = val;
    this.calcularMedios();
  }

  updateDistanciaHelicopteros(val: string) {
    this.distanciaHelicopteros = val;
    this.calcularMedios();
  }

  prev() {
    this.onClickPrev.emit(4);
  }

  next() {
    this.onClickNext.emit(4);
    this.uiService.selectTab("resultados");
  }

  calcularMedios() {
    if (this.distanciaAvionesAnfibios !== undefined && this.distanciaAvionesCarga !== undefined
      && this.distanciaHelicopteros !== undefined) {

      this.medios = (parseInt(this.distanciaAvionesAnfibios) + parseInt(this.distanciaAvionesCarga) +
        parseInt(this.distanciaHelicopteros)) / 3;

      this.onInputChange.emit(parseFloat(this.medios.toFixed(2)));
    }
  }

}
