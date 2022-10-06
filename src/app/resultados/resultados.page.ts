import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { Indice } from '../shared/model/modelData';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnInit {
  indice: Indice;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.indice = this.appService.getIndices();
  }

}
