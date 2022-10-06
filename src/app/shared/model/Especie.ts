export interface CalculableCarga {
    cargaTotal(value: number): number;
}

export class CargaTotalEspecie implements CalculableCarga {
    private especie: Especie;

    setEspecie(especie: Especie) {
        this.especie = especie;
    }

    cargaTotal(diametro: number): number {
        return this.especie.cargaTotal(diametro);
    }
}

export abstract class Especie implements CalculableCarga {
    abstract cargaTotal(value: number): number;
}

export class Quercus extends Especie {
    cargaTotal(diametroParticula: number): number {
        return 0.0289 * Math.pow(diametroParticula, 2) + 0.3489 * diametroParticula - 0.8108;
    }
}

export class Eucalyptus extends Especie {
    cargaTotal(diametroParticula: number): number {
        return 0.02 * Math.pow(diametroParticula, 2) + 2.516 * diametroParticula - 15.401;
    }
}

export class Pinus extends Especie {
    cargaTotal(diametroParticula: number): number {
        return 0.0473 * Math.pow(diametroParticula, 2) + 1.3942 * diametroParticula - 11.242;
    }
}

export class PinusPinea extends Especie {
    cargaTotal(diametroParticula: number): number {
        return 0.0519 * Math.pow(diametroParticula, 2) + 0.0519 * diametroParticula - 3.7148;
    }
}