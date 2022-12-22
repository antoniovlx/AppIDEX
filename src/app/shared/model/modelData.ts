
export const pendientes = ['0', '15', '30', '45', '60', '90'];
export const exposiciones =
    [{ valor: 'N', peso: 10 },
    { valor: 'NE', peso: 8 },
    { valor: 'NW', peso: 7 },
    { valor: 'E', peso: 6 },
    { valor: 'W', peso: 5 },
    { valor: 'SE', peso: 4 },
    { valor: 'SW', peso: 3 },
    { valor: 'S', peso: 2 },
    ];

export const especies = ['Quercus spp y otras frondosas', 'Eucalyptus spp.', 'Pinus spp.', 'Pinus pinea'];
export const humedadFinoMuerto = ['3', '6', '9', '12'];
export const modelosUco40 = ['HPM1', 'HPM2', 'HPM3', 'HPM4', 'HPM5', 'HR1', 'HR2', 'HR3', 'HR4', 'HR5', 'HR6', 'HR7', 'HR8', 'HR9', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'PM1', 'PM2', 'PM3', 'PM4', 'R1', 'R2', 'R3', 'R4'];
export const modelosBehave = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
export const velocidadVientoLlama = ['0', '4', '8', '12', '16', '20', '24'];
export const velocidadViento = [
    { value: '0', disabled: false },
    { value: '5', disabled: false },
    { value: '10', disabled: false },
    { value: '15', disabled: false },
    { value: '20', disabled: false },
    { value: '25', disabled: false },
    { value: '>30', disabled: false },
]

export const densidadCopa = ['0.1', '0.2', '0.3', '0.4'];
export const fraccionCopa = ['35', '45', '55', '65', '75', '85', '95'];

export class Indice {
    accesibilidad: number = 0;
    movilidad: number = 0;
    apertura: number = 0;
    penetrabilidad: number = 0;
    mediosAereos: number = 0;
    oportunidadExtincion: number = 0;
    iceSuperficial: number = 0;
    iceCopas: number = 0;
    iceEruptivo: number = 0;

    get comportamientoEnergetico() {
        const valor = this.iceSuperficial + this.iceCopas + this.iceEruptivo;
        return valor !== 0 ? valor.toFixed(2) : 0;
    }

    clearIces() {
        this.iceSuperficial = 0;
        this.iceCopas = 0;
        this.iceEruptivo = 0;
    }

    get idex() {
        if ((this.iceSuperficial !== 0 || this.iceCopas !== 0 || this.iceEruptivo !== 0) && this.oportunidadExtincion !== 0) {
            return parseFloat(((this.iceSuperficial + this.iceCopas + this.iceEruptivo) / this.oportunidadExtincion).toFixed(2));
        } else {
            return 0;
        }
    }
}

export const pesosLongitudLlamaSuperficial = [
    { 'min': 0, 'max': 0.51, 'peso': 1 },
    { 'min': 0.51, 'max': 1.10, 'peso': 2 },
    { 'min': 1.10, 'max': 1.51, 'peso': 3 },
    { 'min': 1.51, 'max': 2.10, 'peso': 4 },
    { 'min': 2.10, 'max': 2.51, 'peso': 5 },
    { 'min': 2.51, 'max': 3.10, 'peso': 6 },
    { 'min': 3.10, 'max': 3.51, 'peso': 7 },
    { 'min': 3.51, 'max': 4.10, 'peso': 8 },
    { 'min': 4.10, 'max': 4.50, 'peso': 9 },
    { 'min': 4.50, 'max': 9999999, 'peso': 10 }
]

export const pesosLongitudLlamaCopas = [
    { 'min': 0, 'max': 10, 'peso': 1 },
    { 'min': 10, 'max': 15, 'peso': 2 },
    { 'min': 15, 'max': 20, 'peso': 3 },
    { 'min': 20, 'max': 25, 'peso': 4 },
    { 'min': 25, 'max': 30, 'peso': 5 },
    { 'min': 30, 'max': 35, 'peso': 6 },
    { 'min': 35, 'max': 40, 'peso': 7 },
    { 'min': 40, 'max': 45, 'peso': 8 },
    { 'min': 45, 'max': 50, 'peso': 9 },
    { 'min': 50, 'max': 9999999, 'peso': 10 }
]

export const pesosCalorAreaCopas = [
    { 'min': 0, 'max': 8499, 'peso': 1 },
    { 'min': 8499, 'max': 9061, 'peso': 2 },
    { 'min': 9061, 'max': 9621, 'peso': 3 },
    { 'min': 9621, 'max': 10181, 'peso': 4 },
    { 'min': 10181, 'max': 10741, 'peso': 5 },
    { 'min': 10741, 'max': 11301, 'peso': 6 },
    { 'min': 11301, 'max': 11861, 'peso': 7 },
    { 'min': 11861, 'max': 12421, 'peso': 8 },
    { 'min': 12421, 'max': 12981, 'peso': 9 },
    { 'min': 12981, 'max': 9999999, 'peso': 10 }
]

class InputCopas {
    especie: string;
    densidadPies: number;
    fraccionCopaCubierta: number;
    longitudCopa: number;

    constructor() {
        this.especie = undefined;
        this.densidadPies = undefined;
        this.fraccionCopaCubierta = undefined;
        this.longitudCopa = undefined;
    }

    clearInputDisabledCopas() {
        this.longitudCopa = undefined;
        this.fraccionCopaCubierta = undefined;
        this.especie = undefined
        this.densidadPies = undefined;
    }
}

class InputEruptivo {
    aberturaLaderas: number;
    pendienteCauce: number;

    constructor() {
        this.aberturaLaderas = undefined;
        this.pendienteCauce = undefined;
    }

    clearInputDisabledEruptivo() {
        this.aberturaLaderas = undefined;
        this.pendienteCauce = undefined;
    }
}

export class Input {
    tipoModelo: string;
    modelo: string;
    pendiente: number;
    exposicion: string;
    humedadFinoMuerto: number;
    velocidadVientoLlama: number;
    velocidadViento10metros: number;
    diametroTronco: number;
    isProbabilidadFuegoCopas: boolean;
    isProbabilidadFuegoEruptivo: boolean;

    eruptivo: InputEruptivo;
    copas: InputCopas;


    constructor() {
        this.tipoModelo = undefined;
        this.pendiente = undefined;
        this.exposicion = undefined;
        this.humedadFinoMuerto = undefined;
        this.velocidadVientoLlama = undefined;
        this.velocidadViento10metros = undefined;
        this.diametroTronco = undefined;
        this.isProbabilidadFuegoCopas = undefined;
        this.isProbabilidadFuegoEruptivo = undefined;

        this.copas = new InputCopas();
        this.eruptivo = new InputEruptivo();
    }
    
    static getTestInputWithCopasSelected(): Input {
        const entradas = new Input();

        entradas.diametroTronco = 30;

        entradas.exposicion = 'NW';

        entradas.humedadFinoMuerto = 9;
        entradas.isProbabilidadFuegoCopas = true;
        entradas.pendiente = 15;
        entradas.modelo = 'HPM4';
        entradas.tipoModelo = 'UCO40';

        entradas.velocidadViento10metros = 12;
        entradas.velocidadVientoLlama = 4;


        return entradas;
    }

    static getTestInputWithOutCopasSelected(): Input {
        const entradas = new Input();
        entradas.diametroTronco = 30;
        entradas.exposicion = 'NW';
        entradas.humedadFinoMuerto = 9;
        entradas.isProbabilidadFuegoCopas = false;
        entradas.pendiente = 15;
        entradas.modelo = 'HPM4';
        entradas.tipoModelo = 'behave';
        entradas.velocidadViento10metros = 12;
        entradas.velocidadVientoLlama = 4;

        return entradas;
    }
}


