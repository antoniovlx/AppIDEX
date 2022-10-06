import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreguntasPageRoutingModule } from './preguntas-routing.module';

import { PreguntasPage } from './preguntas.page';
import { SharedModule } from '../shared/shared.module';
import { AccesibilidadComponent } from './components/accesibilidad/accesibilidad.component';
import { AperturaComponent } from './components/apertura/apertura.component';
import { MediosComponent } from './components/medios/medios.component';
import { MovilidadComponent } from './components/movilidad/movilidad.component';
import { PenetrabilidadComponent } from './components/penetrabilidad/penetrabilidad.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PreguntasPageRoutingModule
  ],
  declarations: [PreguntasPage, AccesibilidadComponent, AperturaComponent, MediosComponent, MovilidadComponent, PenetrabilidadComponent]
})
export class PreguntasPageModule { }
