import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'titulo-apartado',
  templateUrl: './titulo-apartado.component.html',
  styleUrls: ['./titulo-apartado.component.scss'],
})
export class TituloApartadoComponent implements OnInit {
  @Input()
  imagePath: string;

  @Input()
  titulo: string;


  constructor() { }

  ngOnInit() {
    
  }

}
