import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PesosModelos } from 'src/entities/PesosModelos';
import { TcrRepository } from '../repositories/TcrRepository';
import { CalculableCarga, CargaTotalEspecie, Especie, Eucalyptus, Pinus, PinusPinea, Quercus } from '../shared/model/Especie';
import { humedadFinoMuerto, Indice, pesosCalorAreaCopas, pesosLongitudLlamaCopas, pesosLongitudLlamaSuperficial, UserInput } from '../shared/model/modelData';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {
  private entradas: UserInput;
  private indices: Indice;
  private cargaTotalCopas: number;

  constructor(private appService: AppService, private tcrRepository: TcrRepository) {
    this.indices = this.appService.getIndices();
    this.entradas = this.appService.getEntradas();
  }

  async calculateIceSuperficial(pesoSuperficial: number) {
    const longitudLlama = (await this.getVelocidadPropagacionAndLongitudLlama()).longitudLlama;
    
    const PC = pesoSuperficial;
    const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaSuperficial);

    const indiceIceSuperficial = ((2 * PL * PC) / (PL + PC));
    this.indices.iceSuperficial = parseFloat(indiceIceSuperficial.toFixed(2));
  }

  async calculateIceCopas() {
    const velocidadPropagacion =  await this.calcularVelocidadPropagacionCopas();
    const intensidadCarga = await this.calcularIntensidadCarga(velocidadPropagacion);
    const longitudLlama = this.calcularLongitudLlamaCopas(intensidadCarga);
    
    const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaCopas);
    const calorArea =  this.calcularCalorArea();
    const PC = this.getPesoPorValor(calorArea * 4500, pesosCalorAreaCopas);

    const indiceIceCopas = ((2 * PL * PC) / (PL + PC));
    this.indices.iceCopas = parseFloat(indiceIceCopas.toFixed(2));
  }

  async calculateIceEruptivo() {
    const velocidadPropagacion =  this.calcularVelocidadPropagacionEruptivo();
    const intensidadCarga = await this.calcularIntensidadCarga(velocidadPropagacion);
    const longitudLlama = this.calcularLongitudLlamaCopas(intensidadCarga);
    
    const PL = this.getPesoPorValor(longitudLlama, pesosLongitudLlamaCopas);
    const calorArea =  this.calcularCalorArea();
    const PC = this.getPesoPorValor(calorArea * 4500, pesosCalorAreaCopas);

    const indiceIceCopas = ((2 * PL * PC) / (PL + PC));
    this.indices.iceCopas = parseFloat(indiceIceCopas.toFixed(2));
  }
  
  private calcularVelocidadPropagacionEruptivo() {
    return 20729.16 * Math.pow(this.entradas.velocidadViento10metros, 0.215) 
       * Math.pow(this.entradas.aberturaLaderas, 1.19) 
       * Math.exp(0.018 * this.entradas.pendienteCauce - 0.106* this.entradas.humedadFinoMuerto)
  }

  async getVelocidadPropagacionAndLongitudLlama(){
    return await firstValueFrom(this.tcrRepository.getVelocidadPropagacionAndLongitudLlama(this.entradas.modelo, this.entradas.pendiente, this.entradas.humedadFinoMuerto, this.entradas.velocidadVientoLlama));
  }

  private calcularCalorArea() {
    const densidadAparente = this.calcularDensidadAparenteCopas();

    return ((this.cargaTotalCopas * densidadAparente) / 10000);
  }

  private calcularDensidadAparenteCopas() {
    return (this.cargaTotalCopas * this.entradas.densidadPies) / (this.entradas.longitudCopa * 1000);
  }

  private async calcularIntensidadCarga(velocidadPropagacion: number) {
    this.cargaTotalCopas = this.calcularCargaTotalCopas();
    const intensidadCarga = (1 / 60) * this.cargaTotalCopas * velocidadPropagacion;
    return intensidadCarga;
  }

  private calcularCargaTotalCopas() {
    let especie: CalculableCarga;
    
    if (this.entradas.especie === 'Quercus spp y otras frondosas.') {
      especie = new Quercus();
    } else if (this.entradas.especie === 'Eucalyptus spp.') {
      especie = new Eucalyptus();
    } else if (this.entradas.especie === 'Pinus spp.') {
      especie = new Pinus();
    } else if (this.entradas.especie === 'Pinus pinea') {
      especie = new PinusPinea();
    }

    return especie.cargaTotal(this.entradas.diametroTronco * 0.1);
  }

  private async calcularVelocidadPropagacionCopas() {
    const vrf = await this.calcularVrf();
    const vc = this.calcularVc();

    const velocidadPropagacionCopas = ((16.6 * vrf * vc)
      / (Math.pow(vrf + 0.85 * vc, 2) * Math.pow(this.entradas.velocidadViento10metros, 0.298)))
      + 0.855 * (0.65 * vrf + 0.35 * vc) * Math.pow(this.entradas.fraccionCopaCubierta, 0.35);

    return velocidadPropagacionCopas;
  }

  private calcularVc() {
    return 11.76 * Math.pow(this.entradas.velocidadViento10metros, 0.86) * Math.pow(3, 0.18)
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

  private calcularLongitudLlamaCopas(intensidadCarga: number) {
    return 0.0266 * Math.pow(intensidadCarga, 0.667);
  }
}

