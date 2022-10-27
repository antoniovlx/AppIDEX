import { TestBed } from '@angular/core/testing';
import { PesosModelos } from 'src/entities/PesosModelos';
import { Input } from '../shared/model/modelData';

import { CalculosService } from './calculos.service';

describe('CalculosService', () => {
  let service: CalculosService;
  let pesosModelos: PesosModelos; 

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculosService);

    pesosModelos = {
      calorSuperficial: 746.1,
      dificultad: 10,
      id: 1,
      manual: 10,
      mecanizado: 10,
      modelo: '1',
      superficial: 2
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('if copas selected: #calculateIceSuperficial shoud return correct value', () => {
    service.entradas = Input.getTestInputWithCopasSelected();

    service.calculateIceSuperficial(pesosModelos);
    expect(service.indices.iceSuperficial).toEqual(7.47);
  });

  it('if copas selected: #calculateIceCopas shoud return correct value', () => {
    service.entradas = Input.getTestInputWithCopasSelected();

    service.calculateIceCopas();
    expect(service.indices.iceSuperficial).toEqual(1);
  });

  it('if copas selected: #calculateIceEruptivo shoud return correct value', () => {
    service.entradas = Input.getTestInputWithCopasSelected();

    service.calculateIceEruptivo();
    expect(service.indices.iceSuperficial).toEqual(1);
  });
});
