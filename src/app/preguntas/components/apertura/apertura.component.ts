import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.scss'],
})
export class AperturaComponent implements OnInit {

  isLimitante: string;

  mecanizado: number;
  manual: number;

  cm: number;
  ce: number;

  apertura: number = 0;

  @Output()
  onClickNext: EventEmitter<number> = new EventEmitter();

  @Output()
  onClickPrev: EventEmitter<number> = new EventEmitter();

  @Output()
  onInputChange: EventEmitter<number> = new EventEmitter();
  textWarningData: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.isPendienteChanged().subscribe(pendiente => {
      this.cm = pendiente.cm;
      this.ce = pendiente.ce;
      this.calcularApertura();
    })


    this.appService.isModeloChanged().subscribe(pesos => {
      this.mecanizado = pesos.mecanizado;
      this.manual = pesos.manual;
      this.calcularApertura();
    })
  }

  updateIsLimitante(val) {
    this.isLimitante = val;
    this.calcularApertura();
  }

  prev() {
    this.onClickPrev.emit(2);
  }

  next() {
    this.onClickNext.emit(2);
  }

  calcularApertura() {
    if (this.mecanizado !== undefined && this.manual !== undefined
      && this.isLimitante !== undefined) {

      if (this.cm !== undefined && this.ce !== undefined) {
        if (this.isLimitante === 'si') {
          this.apertura = this.cm * this.manual;
        } else {
          this.apertura = this.cm * this.manual + this.ce * this.mecanizado
        }
        this.onInputChange.emit(this.apertura);
      }
    }
    else {
      this.textWarningData = "Pendiente del terreno y modelo de combustible";
    }
  }
}
