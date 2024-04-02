import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PesosModelos } from 'src/entities/PesosModelos';
import { TcrRepository } from '../repositories/TcrRepository';
import { CalculableCarga, CargaTotalEspecie, Especie, Eucalyptus, Pinus, PinusPinea, Quercus } from '../shared/model/Especie';
import { Indice, pesosCalorAreaCopas, pesosLongitudLlamaCopas, pesosLongitudLlamaSuperficial, Input } from '../shared/model/modelData';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  entradas: Input;
  indices: Indice;
  private cargaTotal: number;
  private calorAreaSuperficie: number;

  constructor(private appService: AppService, private tcrRepository: TcrRepository) {
    this.indices = this.appService.getIndices();
    this.entradas = this.appService.getEntradas();
  }


  async calculateIceSuperficial(pesosModelo: PesosModelos) {
    const longitudLlama = (await this.getVelocidadPropagacionAndLongitudLlama()).longitudLlama;

    this.calorAreaSuperficie = pesosModelo.calorSuperficial;

    const PC = pesosModelo.superficial;
    const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaSuperficial);

    const indiceIceSuperficial = ((2 * PL * PC) / (PL + PC));
    this.indices.iceSuperficial = parseFloat(indiceIceSuperficial.toFixed(2));
  }

  async calculateIceCopas() {
    if (this.entradas.isProbabilidadFuegoCopas === false) {
      this.indices.iceCopas = 0;
    } else {
      const velocidadPropagacion = await this.calcularVelocidadPropagacionCopas();
      const intensidadCarga = await this.calcularIntensidadCarga(velocidadPropagacion);
      const longitudLlama = this.calcularLongitudLlama(intensidadCarga);

      const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaCopas);
      const calorArea = this.calcularCalorArea();
      const PC = this.getPesoPorValor(calorArea, pesosCalorAreaCopas);

      const indiceIceCopas = (2 * PL * PC) / (PL + PC);
      this.indices.iceCopas = parseFloat(indiceIceCopas.toFixed(2));
    }
  }

  async calculateIceEruptivo() {
    if (this.entradas.isProbabilidadFuegoEruptivo === false) {
      this.indices.iceEruptivo = 0;
    } else {
      const velocidadPropagacion = this.calcularVelocidadPropagacionEruptivo();
      const intensidadCarga = await this.calcularIntensidadCarga(velocidadPropagacion);
      const longitudLlama = this.calcularLongitudLlama(intensidadCarga);

      const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaCopas);
      const calorArea = this.calcularCalorArea();
      const PC = this.getPesoPorValor(calorArea, pesosCalorAreaCopas);

      const indiceIceEruptivo = ((2 * PL * PC) / (PL + PC));
      this.indices.iceEruptivo = parseFloat(indiceIceEruptivo.toFixed(2));
    }
  }

  async getVelocidadPropagacionAndLongitudLlama() {
    return await firstValueFrom(this.tcrRepository.getVelocidadPropagacionAndLongitudLlama(this.entradas.modelo,
      this.entradas.pendiente, this.entradas.humedadFinoMuerto, this.entradas.velocidadVientoLlama));
  }

  public getVelocidadVientoLlamaCopas(velocidad: number): number {
    if (velocidad >= 0 && velocidad < 4) {
      return 0;
    } else if (velocidad >= 4 && velocidad < 8) {
      return velocidad - 4 > velocidad - 8 ? 4 : 8;
    }
    else if (velocidad >= 8 && velocidad < 12) {
      return velocidad - 8 > velocidad - 12 ? 8 : 12;
    }
    else if (velocidad >= 12 && velocidad < 16) {
      return velocidad - 12 > velocidad - 16 ? 12 : 16;
    }
    else if (velocidad >= 16 && velocidad < 20) {
      return velocidad - 16 > velocidad - 20 ? 16 : 20;
    }
    else if (velocidad >= 20 && velocidad < 24) {
      return velocidad - 20 > velocidad - 24 ? 20 : 24;
    }
    else if (velocidad >= 24) {
      return 24;
    }

    return 0;
  }

  clearIces() {
    this.indices.clearIces();
  }

  private calcularVelocidadPropagacionEruptivo() {
    return 20729.16 * Math.pow(this.entradas.velocidadViento10metros, 0.215)
      * Math.pow(this.entradas.eruptivo.aberturaLaderas, -1.19)
      * Math.exp(0.018 * this.entradas.eruptivo.pendienteCauce - 0.106 * this.entradas.humedadFinoMuerto);
  }

  private calcularCalorArea() {
    let calorArea = this.calorAreaSuperficie;

    if (this.entradas.isProbabilidadFuegoCopas === true) {
      calorArea += this.calcularCargaTotalCopas() * 4500;
    }

    return calorArea;
  }

  private calcularDensidadAparenteCopas(cargaEspecie) {
    return (cargaEspecie * this.entradas.copas.densidadPies) / (this.entradas.copas.longitudCopa * 10000);
  }

  private async calcularIntensidadCarga(velocidadPropagacion: number) {
    this.calcularCargaTotal();
    const intensidadCarga = (18500 / 60) * this.cargaTotal * velocidadPropagacion;
    return intensidadCarga;
  }

  private calcularCargaTotal(){
    this.cargaTotal = this.entradas.isProbabilidadFuegoCopas ? this.calcularCargaTotalCopas() : this.calorAreaSuperficie / 4500;
  }

  private calcularCargaTotalCopas(){
    return (this.calcularCargaEspecie() * this.entradas.copas.densidadPies) / 10000;
  }

  private calcularCargaEspecie() {
    let especie: CalculableCarga;

    if (this.entradas.copas.especie === 'Quercus spp y otras frondosas') {
      especie = new Quercus();
    } else if (this.entradas.copas.especie === 'Eucalyptus spp.') {
      especie = new Eucalyptus();
    } else if (this.entradas.copas.especie === 'Pinus spp.') {
      especie = new Pinus();
    } else if (this.entradas.copas.especie === 'Pinus pinea') {
      especie = new PinusPinea();
    }

    return especie.cargaTotal(this.entradas.diametroTronco);
  }

  private async calcularVelocidadPropagacionCopas() {
    //this.entradas.velocidadVientoLlama = this.getVelocidadVientoLlamaCopas(this.entradas.velocidadViento10metros * 0.4);
    this.entradas.modelo = 'HPM5';

    const vrf = await this.calcularVrf();
    const vc = this.calcularVc();

    const velocidadPropagacionCopas = ((16.6 * vrf * vc)
      / (Math.pow(vrf + 0.85 * vc, 2) * Math.pow(this.entradas.velocidadViento10metros, 0.298)))
      + 0.855 * (0.65 * vrf + 0.35 * vc) * Math.pow(this.entradas.copas.fraccionCopaCubierta, 0.35);

    return velocidadPropagacionCopas;
  }

  private calcularVc() {
    const densidadCopas = this.calcularDensidadAparenteCopas(this.calcularCargaEspecie());
    return 11.76 * Math.pow(this.entradas.velocidadViento10metros, 0.86) * Math.pow(densidadCopas, 0.18)
      * Math.pow(Math.E, (-0.17 * this.entradas.humedadFinoMuerto));
  }

  private async calcularVrf() {
    const velocidadPropagacion = (await this.getVelocidadPropagacionAndLongitudLlama()).velocidadPropagacion;
    return velocidadPropagacion * 1.7 * 3.34;
  }



  private getPesoPorValor(valor: number, intervaloPesos: any[]) {
    for (const intervalo of intervaloPesos) {
      if (valor >= intervalo.min && valor < intervalo.max) {
        return intervalo.peso;
      }
    }
  }

  private calcularLongitudLlama(intensidadCarga: number) {
    return 0.0266 * Math.pow(intensidadCarga, 0.667);
  }
}

