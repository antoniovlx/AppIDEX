import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLiteService } from './services/sqlite.service';
import { DetailService } from './services/detail.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
    { prefix: "./assets/i18n/home/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/shared/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/configuracion/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/ejecucion/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/informes/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/medios-combate/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/recursos-naturales/", suffix: ".translation.json" },
    { prefix: "./assets/i18n/zonas-analisis/", suffix: ".translation.json" },
  ]);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot({animated: false}), AppRoutingModule, HttpClientModule, TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLiteService, DetailService, FileOpener],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
