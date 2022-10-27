import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  @Input()
  tituloResultado: string

  @Input()
  resultado: number

  @Input()
  textWarningData: string

  constructor() { }

  ngOnInit() {

  }
}
