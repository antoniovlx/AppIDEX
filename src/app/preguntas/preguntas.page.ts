import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { HelperService } from '../services/helper.service';
import { AppService } from '../services/app.service';
import { Indice } from '../shared/model/modelData';
import { IonContent } from '@ionic/angular';
import { UiService } from '../services/ui.service';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {
  segmentList: any;

  preguntas = ['accesibilidad', 'movilidad', 'apertura', 'penetrabilidad', 'medios'];
  isDisabledTab: boolean[] = [false, true, true, true, true]

  indexNumber: number = 0;

  @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  private slides: any;

  private indices: Indice;

  selectedSegment: string = '0'

  constructor(private appService: AppService, private uiService: UiService, private helper: HelperService) { }

  ngOnInit() {
    this.indices = this.appService.getIndices();

    this.uiService.getTopScrolled$().subscribe(()=>{
      this.content.scrollToTop();
    });
  }

  ngAfterViewInit() {

  }

  prev(position) {
    this.indexNumber = position - 1;
    this.selectedSegment = this.indexNumber.toString();
    this.slides.slideTo(this.indexNumber);
    this.updateScrollPreguntasMenu();
  }


  async next(position) {
    this.indexNumber = position + 1;

    if (this.indexNumber < 5) {
      this.selectedSegment = this.indexNumber.toString();
      this.isDisabledTab[this.indexNumber] = false;
      this.slides.slideTo(this.indexNumber);
      this.updateScrollPreguntasMenu();
    }
  }

  updateScrollPreguntasMenu() {
    document.getElementById("segment-" + this.indexNumber).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  updateAccesibilidad(val) {
    this.indices.accesibilidad = this.helper.round(val);
    this.calcularIndiceOportunidadExtincion();
  }

  updateMovilidad(val) {
    this.indices.movilidad = this.helper.round(val);
    this.calcularIndiceOportunidadExtincion();
  }

  updateApertura(val) {
    this.indices.apertura = this.helper.round(val);
    this.calcularIndiceOportunidadExtincion();
  }

  updatePenetrabilidad(val) {
    this.indices.penetrabilidad = this.helper.round(val);
    this.calcularIndiceOportunidadExtincion();
  }

  updateMedios(val) {
    this.indices.mediosAereos = this.helper.round(val);
    this.calcularIndiceOportunidadExtincion();
  }

  calcularIndiceOportunidadExtincion() {
    this.indices.oportunidadExtincion = this.indices.accesibilidad + this.indices.movilidad + this.indices.apertura + this.indices.penetrabilidad + this.indices.mediosAereos;
    this.indices.oportunidadExtincion = parseFloat(this.indices.oportunidadExtincion.toFixed(3)); 
  }

  segmentSelected(index: number) {
    this.slides.slideTo(index);
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }
}
