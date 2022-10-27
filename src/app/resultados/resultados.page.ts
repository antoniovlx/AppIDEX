import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import FileSaver from 'file-saver';
import { AppService } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { UtilService } from '../services/util.service';
import { Indice, Input } from '../shared/model/modelData';
import * as Papa from 'papaparse';
import { TranslateService } from '@ngx-translate/core';
import { EntradasPage } from '../entradas/entradas.page';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnInit {
  indice: Indice;

  @ViewChild(IonContent, { static: false })
  content: IonContent;

  isMobile: boolean;
  loader: HTMLIonLoadingElement;
  loaderLoading: boolean;

  constructor(private appService: AppService, private uiService: UiService, private utilService: UtilService) { }

  ngOnInit() {
    this.indice = this.appService.getIndices();

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  async downloadCsv() {
    this.uiService.presentLoading("Exportando...");

    let blob = await this.utilService.parseDataToBlob();

    this.utilService.saveFile(blob, "AppIDEX");

    this.uiService.dismissLoading();
  }
}
