import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import { Pendientes } from 'src/entities/Pendientes';
import { PendientesRepository } from '../repositories/PendientesRepository';
import { PesosModelosRepository } from '../repositories/PesosModelosRepository';
import { Indice, Input } from '../shared/model/modelData';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  private indice: Indice = new Indice();
  private entradas: Input = new Input();

  pendienteChanged = new ReplaySubject<Pendientes>();
  modeloChanged = new ReplaySubject<any>();
  exposicionChanged = new ReplaySubject<number>();

  constructor(private platform: Platform, private pesosModelosRepository: PesosModelosRepository, private pendientesRepository: PendientesRepository) { }

  public isMobile() {
    return this.platform.is('mobile');
  }

  public isElectron(){
    return this.platform.is('electron');
  }

  getPesosByModelo(modelo: string) {
    return this.pesosModelosRepository.getPesoByModelo(modelo);
  }

  getPendientes() {
    return this.pendientesRepository.getPendientes();
  }

  getIndices(): Indice {
    return this.indice;
  }

  getEntradas(): Input {
    return this.entradas;
  }

  pendienteChange(val: Pendientes) {
    this.pendienteChanged.next(val);
  }

  isPendienteChanged() {
    return this.pendienteChanged.asObservable();
  }

  exposicionChange(val: number) {
    this.exposicionChanged.next(val);
  }

  isExposicionChanged() {
    return this.exposicionChanged.asObservable();
  }

  modeloChange(val) {
    this.modeloChanged.next(val);
  }

  isModeloChanged() {
    return this.modeloChanged.asObservable();
  }
}
