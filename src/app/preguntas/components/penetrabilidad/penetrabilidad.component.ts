import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'penetrabilidad',
  templateUrl: './penetrabilidad.component.html',
  styleUrls: ['./penetrabilidad.component.scss'],
})
export class PenetrabilidadComponent implements OnInit {

  comportamiento: string;
  distanciaVial: string;
  areasTransitables: string;

  pesoModelo: number;
  pesoPendiente: number;
  pesoExposicion: number;

  penetrabilidad: number = 0;

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onClickPrev: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();
  textWarningData: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.isModeloChanged().subscribe(pesos => {
      this.pesoModelo = pesos.dificultad;
      this.calcularPenetrabilidad();
    });

    this.appService.isPendienteChanged().subscribe(peso => {
      this.pesoPendiente = peso.puntaje;
      this.calcularPenetrabilidad();
    });

    this.appService.isExposicionChanged().subscribe(peso => {
      this.pesoExposicion = peso;
      this.calcularPenetrabilidad();
    });
  }

  updateComportamiento(val) {
    this.comportamiento = val;
    this.calcularPenetrabilidad();
  }

  updateDistanciaVial(val) {
    this.distanciaVial = val;
    this.calcularPenetrabilidad();
  }

  updateAreasTransitables(val) {
    this.areasTransitables = val;
    this.calcularPenetrabilidad();
  }

  calcularPenetrabilidad() {
    if (this.comportamiento !== undefined && this.distanciaVial !== undefined
      && this.areasTransitables !== undefined) {

      if (this.pesoExposicion !== undefined
        && this.pesoModelo !== undefined) {
        let sendasPrecombates = parseFloat(this.areasTransitables) * parseFloat(this.distanciaVial);

        this.penetrabilidad = (this.pesoPendiente + this.pesoModelo +
          parseFloat(this.comportamiento) + this.pesoExposicion + (2 * sendasPrecombates)) / 6;

        this.onInputChange.emit(parseFloat(this.penetrabilidad.toFixed(2)));
      }
      else {
        this.textWarningData = "Pendiente del terreno, modelo de combustible y exposición";
      }
    }
  }

  prev() {
    this.onClickPrev.emit(3);
  }


  next() {
    this.onClickNext.emit(3);
  }
}
