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
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

/*let missingTranslations = {};

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    missingTranslations[`${params.key}`] = params.key;
   // console.log(JSON.stringify(missingTranslations));
  }
}

/*export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
    { prefix: "./assets/i18n/home/", suffix: ".translation.json" }
  ]);
}*/

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot({ animated: false }), AppRoutingModule, HttpClientModule, TranslateModule.forRoot({
    //missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
    useDefaultLang: false,
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
