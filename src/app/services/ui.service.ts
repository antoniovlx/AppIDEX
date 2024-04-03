import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject } from 'rxjs';
import { UtilService } from './util.service';
import { AppService } from './app.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import * as FileSaver from 'file-saver';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private loader: HTMLIonLoadingElement;
  private loaderLoading = false;
  private isTopScrolled$ = new Subject<boolean>();
  private selectTab$ = new Subject<string>();

  constructor(private loadingController: LoadingController,
     private appService: AppService,
     public toastController: ToastController,
     private translate: TranslateService,
     private alertController: AlertController,
     private fileOpener: FileOpener,
     private utilService: UtilService, private router: Router) {
      console.log('UiService constructor');

     }

   async saveFile(data: Blob, fileName: string) {
      const now = new Date(Date.now());
      const formattedDateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}`;
      if (this.appService.isMobile()) {
        this.writeAndOpenFile(data, `${fileName}_${formattedDateTime}.xlsx`);
      } else {
        FileSaver.saveAs(data, `${fileName}_${formattedDateTime}.xlsx`);
        this.presentToast('Datos exportados correctamente');
      }
      this.dismissLoading();
    }

    async writeAndOpenFile(data: Blob, fileName: string) {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      const that = this;
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64data as string,
            directory: Directory.Data,
            recursive: true
          });

          that.presentToast('Datos exportados correctamente');

          let type = data.type;
          if(data.type === 'application/octet-stream'){
            type = 'application/vnd.ms-excel';
          }

          that.fileOpener.showOpenWithDialog(result.uri, type)
            .then(() => {
              console.log('File is opened');
            })
            .catch(e => {
              console.log('Error opening file', e);
              that.presentAlertToast('Error opening file');
            });



          console.log('Wrote file', result.uri);
        } catch (e) {
          console.error('Unable to write file', e);
        }
      };
    }


  public async presentLoading(message: string) {
    message = await firstValueFrom(this.translate.get(message));
    this.loaderLoading = true;
    this.loader = await this.loadingController.create({
      message: message,
      showBackdrop: true
    });

    this.loader.present().then(() => { this.loaderLoading = false; });
  }

  public dismissLoading() {
    const interval = setInterval(() => {
      if (this.loader || !this.loaderLoading) {
        this.loader.dismiss().then(() => { this.loader = null; clearInterval(interval) });
      } else if (!this.loader && !this.loaderLoading) {
        clearInterval(interval);
      }
    }, 500);
  }

  public loaderDismissed(loader) {
    return loader.onDidDismiss();
  }


  selectTab(title: string) {
    this.selectTab$.next(title);
  }

  getSelectTab(){
    return this.selectTab$.asObservable();
  }


  public presentToast(message: string) {
    this.translate.get(message).subscribe(async (res: string) => {
      const toast = await this.toastController.create({
        message: res,
        color: 'primary',
        icon: 'information-circle',
        position: 'top',
        cssClass: 'toast-message',
        buttons: [
          {
            text: 'OK'
          }
        ]
      });
      toast.present();
    });

  }

  async presentAlertToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'danger',
      duration: 4000,
      position: 'top',
      icon: 'alert-circle-outline',
      cssClass: 'toast-message',
      /*buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {

          }
        }
      ]*/

    });
    toast.present();
  }

  async confirmationAlert(titulo: string, message: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });

    let translations = [];
    translations = await firstValueFrom(this.translate.get([titulo, message, 'Si']));

    const alert = await this.alertController.create({
      header: translations['Confirmación'],
      message: translations['¿Desea CONTINUAR y eliminar los elementos seleccionados?'],
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => resolveFunction(false)
        },
        {
          text: translations['Si'],
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

  async avisoAlert(titulo: string, message: string, path?: string): Promise<boolean> {
    titulo = await firstValueFrom(this.translate.get(titulo));
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });

    message = await this.utilService.getTranslate(message);

    const alert = await this.alertController.create({
      header: titulo,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => path !== undefined ? this.router.navigate([path]) : this.router.navigate([location.pathname])
        }
      ]
    });
    await alert.present();
    return promise;
  }

  scrollTop$(isTopScrolled: boolean) {
    this.isTopScrolled$.next(isTopScrolled);
  }

  getTopScrolled$() {
    return this.isTopScrolled$.asObservable();
  }

  async createMessageAviso(datos: string[]) {
    let mensaje = await firstValueFrom(this.translate.get('Antes de continuar debe introducir:'));
    mensaje += '<ul>'
    for (let index = 0; index < datos.length; index++) {
      let dato = datos[index];
      mensaje += '<li>'
      dato = await firstValueFrom(this.translate.get(dato));
      mensaje += dato;
      mensaje += '</li>'
    }
    mensaje += '</ul>'
    return mensaje;
  }
}
