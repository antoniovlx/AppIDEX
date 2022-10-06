import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { parse } from 'path';
import { firstValueFrom } from 'rxjs';
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
  velocidadVientoLlamaSelected: string;
  velocidadViento10metrosSelected: string;
  fraccionCopaCubiertaSelected: string;
  longitudCopaSelected: string;
  diametroTroncoSelected: string;
  aberturaLaderasSelected: string;
  pendienteCauceSelected: string;

  pendientes: Pendientes[] = [];
  modelos = [];

  idex: number = 0;

  @ViewChild("modelo1", { static: false })
  modelo1Select: IonSelect

  pesos: PesosModelos;
  entradas: variables.UserInput;

  constructor(private appService: AppService, private calculosService: CalculosService, private uiService: UiService, private render2: Renderer2) {

  }

  ngOnInit() {
    this.appService.getPendientes().subscribe(pendientes => {
      this.pendientes = pendientes;
    });

    this.entradas = this.appService.getEntradas();
  }

  ngAfterViewInit() {

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
    this.entradas.especie = this.especieSelected;
    this.calcularIces();
  }

  updateExposicion(value: string) {
    this.exposicionSelected = value;
    this.entradas.exposicion = this.exposicionSelected;
    this.appService.exposicionChange(parseInt(value));
    this.calcularIces();
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

  updateVelocidadVientoLlama(val: string) {
    this.velocidadVientoLlamaSelected = val;
    this.entradas.velocidadVientoLlama = parseInt(this.velocidadVientoLlamaSelected);
    this.calcularIces();
  }

  updateVelocidadViento10metros(val: string) {
    this.velocidadViento10metrosSelected = val;
    this.entradas.velocidadViento10metros = parseInt(this.velocidadViento10metrosSelected);
    this.calcularIces();
  }


  updateDensidadCopa(val: string) {
    this.densidadPiesSelected = val;
    this.entradas.densidadPies = parseFloat(this.densidadPiesSelected);
    this.calcularIces();
  }

  updateFraccionCopa(val: string) {
    this.fraccionCopaCubiertaSelected = val;
    this.entradas.fraccionCopaCubierta = parseFloat(this.fraccionCopaCubiertaSelected);
    this.calcularIces();
  }

  updateLongitudCopa(val) {
    this.longitudCopaSelected = val;
    this.entradas.longitudCopa = parseFloat(this.longitudCopaSelected);
    this.calcularIces();
  }

  updateDiametroTronco(val) {
    this.diametroTroncoSelected = val;
    this.entradas.diametroTronco = parseFloat(this.diametroTroncoSelected);
    this.calcularIces();
  }

  updateAberturaLaderas(val){
    this.aberturaLaderasSelected = val;
    this.entradas.aberturaLaderas = parseFloat(this.aberturaLaderasSelected);
    this.calcularIces();
  }

  updatePendienteCauce(val){
    this.pendienteCauceSelected = val;
    this.entradas.pendienteCauce = parseFloat(this.pendienteCauceSelected);
    this.calcularIces();
  }

  calcularIces() {
    if (this.checkEntradas()=== true){
      this.calculosService.calculateIceSuperficial(this.pesos.superficial);
      this.calculosService.calculateIceCopas();
      this.calculosService.calculateIceEruptivo();
    }
  }

  private checkEntradas() {
    for (const key in this.entradas) {
      if (this.entradas[key] === undefined)
        return false;
    }
    return true;
  }
}
