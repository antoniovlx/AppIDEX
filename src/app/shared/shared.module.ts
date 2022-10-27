import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule, MatLabel, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TituloApartadoComponent } from './components/titulo-apartado/titulo-apartado.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [BreadcrumbComponent, LoadingComponent, TituloApartadoComponent, ResultadosComponent],
  imports: [
    TranslateModule.forChild({
      //missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      useDefaultLang: false
    }),
    SwiperModule,
    IonicModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatTabsModule,
    MatIconModule, MatGridListModule, MatSidenavModule, MatRadioModule,
    MatListModule, MatCardModule, MatButtonModule, MatExpansionModule, MatProgressSpinnerModule
  ],
  exports: [
    TranslateModule,
    BreadcrumbComponent,
    TituloApartadoComponent,
    MatTableModule,
    SwiperModule,
    MatToolbarModule,
    MatCheckboxModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatProgressSpinnerModule,
    MatIconModule, MatGridListModule, MatSidenavModule, MatTableModule, MatRadioModule,
    MatListModule, MatCardModule, MatButtonModule, MatExpansionModule, MatInputModule, LoadingComponent, ResultadosComponent
  ]
})
export class SharedModule { }
