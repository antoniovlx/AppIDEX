import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntradasPageRoutingModule } from './entradas-routing.module';

import { EntradasPage } from './entradas.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    EntradasPageRoutingModule
  ],
  declarations: [EntradasPage]
})
export class EntradasPageModule {}
