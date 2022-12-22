import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonContent, IonSelect } from '@ionic/angular';

import { firstValueFrom, of } from 'rxjs';
import { Pendientes } from 'src/entities/Pendientes';
import { PesosModelos } from 'src/entities/PesosModelos';
import { AppService } from '../services/app.service';
import { CalculosService } from '../services/calculos.service';
import { UiService } from '../services/ui.service';
import * as variables from '../shared/model/modelData';


@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.page.html',
  styleUrls: ['./entradas.page.scss'],
})
export class EntradasPage implements OnInit {
  tipoModeloSelected: string;
  modeloSelected: string;
  especieSelected: string;
  pendienteSelected: string;
  exposicionSelected: string;
  densidadPiesSelected: string;
  humedadFinoMuertoSelected: string;
  velocidadVientoLlamaSuperficieSelected: string;
  velocidadViento10metrosSelected: string;
  fraccionCopaCubiertaSelected: string;
  longitudCopaSelected: string;
  diametroTroncoSelected: string;
  aberturaLaderasSelected: string;
  pendienteCauceSelected: string;
  probabilidadFuegoCopasSelected: string;
  probabilidadFuegoEruptivoSelected: string;

  pendientes: Pendientes[] = [];
  modelos = [];

  idex: number = 0;

  @ViewChild("modelo1", { static: false })
  modelo1Select: IonSelect

  @ViewChild("content", { static: false })
  content: IonContent;

  pesos: PesosModelos;
  entradas: variables.Input;

  constructor(private cd: ChangeDetectorRef, private appService: AppService, private calculosService: CalculosService, private uiService: UiService, private render2: Renderer2) {

  }

  ngOnInit() {
    this.entradas = this.appService.getEntradas();
    this.appService.getPendientes().subscribe(pendientes => {
      this.pendientes = pendientes;
      console.log(this.pendientes);
    });

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  get variables() {
    return variables;
  }

  isDisabled() {

  }

  updatePendientes(pendiente: string) {
    const pendientePesos = this.pendientes.find(value => value.pendiente === pendiente);
    this.pendienteSelected = pendientePesos.pendiente;
    this.entradas.pendiente = parseInt(this.pendienteSelected);
    this.appService.pendienteChange(pendientePesos);
    this.calcularIces();
  }

  updateEspecie(especie: string) {
    this.especieSelected = especie;
    this.entradas.copas.especie = this.especieSelected;
    this.calcularIces();
  }

  updateExposicion(value: string) {
    this.exposicionSelected = value;
    this.entradas.exposicion = this.exposicionSelected;
    this.appService.exposicionChange(parseInt(value));
    this.calcularIces();
  }

  updateProbabilidadFuegoCopas(value: string) {
    this.probabilidadFuegoCopasSelected = value;
    this.entradas.isProbabilidadFuegoCopas = value === 'si' ? true : false;
    this.clearInputDisabledCopas();
    this.calcularIces();
  }

  updateProbabilidadFuegoEruptivo(value: string) {
    this.probabilidadFuegoEruptivoSelected = value;
    this.entradas.isProbabilidadFuegoEruptivo = value === 'si' ? true : false;
    this.clearInputDisabledEruptivo();
    this.calcularIces();
  }

  clearInputDisabledCopas() {
    this.longitudCopaSelected = undefined;
    this.fraccionCopaCubiertaSelected = undefined
    this.especieSelected = undefined;
    this.densidadPiesSelected = undefined;
    this.entradas.copas.clearInputDisabledCopas();
  }

  clearInputDisabledEruptivo() {
    this.aberturaLaderasSelected = undefined;
    this.pendienteCauceSelected = undefined
    this.entradas.eruptivo.clearInputDisabledEruptivo();
  }

  updateTipoModelo(tipo: string) {
    this.tipoModeloSelected = tipo;
    this.entradas.tipoModelo = this.tipoModeloSelected;
    if (this.entradas.tipoModelo === 'uco40') {
      this.modelos = variables.modelosUco40;
    } else {
      this.modelos = variables.modelosBehave;
    }

    this.updateModelo(this.modelos[0]);
  }

  async updateModelo(val: string) {
    this.modeloSelected = val;
    this.entradas.modelo = val;
    this.pesos = await firstValueFrom(this.appService.getPesosByModelo(val));
    this.appService.modeloChange(this.pesos);
    this.calcularIces();
  }

  updateHumedadFinoMuerto(val: string) {
    this.humedadFinoMuertoSelected = val;
    this.entradas.humedadFinoMuerto = parseInt(this.humedadFinoMuertoSelected);
    this.calcularIces();
  }

  updateVelocidadVientoLlamaSuperficie(val: string) {
    this.velocidadVientoLlamaSuperficieSelected = val;
    this.entradas.velocidadVientoLlama = parseInt(this.velocidadVientoLlamaSuperficieSelected);
    this.calcularIces();
  }

  updateVelocidadViento10metros(val) {
    this.velocidadViento10metrosSelected = val;
    if (this.velocidadViento10metrosSelected !== '') {
      this.entradas.velocidadViento10metros = parseFloat(this.velocidadViento10metrosSelected);
      this.calcularIces();
    } else {
      this.calculosService.clearIces();
    }
  }

  checkValue(){
    if(this.entradas.velocidadViento10metros <= this.entradas.velocidadVientoLlama){
      this.uiService.avisoAlert("Aviso", "Velocidad viento a 10m debe ser mayor que la velocidad viento media llama");
      this.entradas.velocidadViento10metros = 0;
      this.velocidadViento10metrosSelected = "";
    }
  }


  updateDensidadPies(val) {
    this.densidadPiesSelected = val;
    if (this.densidadPiesSelected !== '') {
      this.entradas.copas.densidadPies = parseFloat(this.densidadPiesSelected);
      this.calcularIces();
    } else {
      this.calculosService.clearIces();
    }
  }

  updateFraccionCopa(val: string) {
    this.fraccionCopaCubiertaSelected = val;
    if(val !== undefined){
      this.entradas.copas.fraccionCopaCubierta = parseFloat(this.fraccionCopaCubiertaSelected) / 100;
    }else{
      this.entradas.copas.fraccionCopaCubierta = undefined
    }

    this.calcularIces();
  }

  updateLongitudCopa(val) {
    this.longitudCopaSelected = val;
    this.entradas.copas.longitudCopa = parseFloat(this.longitudCopaSelected);
    this.calcularIces();
  }

  updateDiametroTronco(val) {
    this.diametroTroncoSelected = val;
    if (this.diametroTroncoSelected !== '') {
      this.entradas.diametroTronco = parseFloat(this.diametroTroncoSelected);
      this.calcularIces();
    } else {
      this.calculosService.clearIces();
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  hayCopas() {
    return !this.entradas.isProbabilidadFuegoCopas;
  }

  hayEruptivo() {
    return !this.entradas.isProbabilidadFuegoEruptivo;
  }

  updateAberturaLaderas(val) {
    this.aberturaLaderasSelected = val;
    this.entradas.eruptivo.aberturaLaderas = parseFloat(this.aberturaLaderasSelected);
    this.calcularIces();
  }

  updatePendienteCauce(val) {
    this.pendienteCauceSelected = val;
    this.entradas.eruptivo.pendienteCauce = parseFloat(this.pendienteCauceSelected);
    this.calcularIces();
  }

  async calcularIces() {
    this.calculosService.clearIces();

    if (this.checkEntradas(this.entradas) === true) {
      await this.calculosService.calculateIceSuperficial(this.pesos);


      if (this.entradas.isProbabilidadFuegoCopas === true) {
        if (this.checkEntradas(this.entradas.copas) === true) {
          await this.calculosService.calculateIceCopas();
        }
      }

      if (this.entradas.isProbabilidadFuegoEruptivo === true) {
        if (this.checkEntradas(this.entradas.eruptivo) === true) {
          await this.calculosService.calculateIceEruptivo();
        }
      }
    }
  }

  private checkEntradas(entradas) {
    for (const key in entradas) {
      if (entradas[key] === undefined)
        return false;

      if (typeof entradas[key] === 'number' && isNaN(entradas[key]))
        return false;
    }
    return true;
  }
}
