import { Injectable, Type } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import { Pendientes } from 'src/entities/Pendientes';
import { PesosModelos } from 'src/entities/PesosModelos';
import { PendientesRepository } from '../repositories/PendientesRepository';
import { PesosModelosRepository } from '../repositories/PesosModelosRepository';
import { Indice, UserInput } from '../shared/model/modelData';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  private indice: Indice = new Indice();
  private entradas: UserInput = new UserInput();

  pendienteChanged = new ReplaySubject<Pendientes>();
  modeloChanged = new ReplaySubject<any>();
  exposicionChanged = new ReplaySubject<number>();

  constructor(private platform: Platform, private pesosModelosRepository: PesosModelosRepository, private pendientesRepository: PendientesRepository) { }

  public isMobile() {
    return this.platform.is('mobile');
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

  getEntradas(): UserInput {
    return this.entradas;
  }

  getEntradasTest(){
    let entradasTest = new UserInput();
    entradasTest.tipoModelo = "UCO40";
    entradasTest.modelo = "P1"
    entradasTest.especie = "Eucalyptus spp."
    entradasTest.pendiente = 15
    entradasTest.exposicion = "NW"
    entradasTest.densidadPies = 0.3
    entradasTest.humedadFinoMuerto = 9
    entradasTest.velocidadVientoLlama = 12
    entradasTest.velocidadViento10metros = 12
    entradasTest.fraccionCopaCubierta = 65
    entradasTest.longitudCopa = 5
    entradasTest.diametroTronco = 400
    entradasTest.aberturaLaderas = 10;
    entradasTest.pendienteCauce = 15;
    return entradasTest;
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
