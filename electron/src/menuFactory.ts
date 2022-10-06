import { Menu, shell } from 'electron';

export class MenuFactoryService {

    menu: Menu;

    darwinTemplate(app: any, mainWindow: any, i18n): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] {
        return [
            {
              label: i18n.t('View')   ,
              submenu: [
                { role: 'reload', label: i18n.t('Reload'), icon: 'assets/icons/reload.png'},
                { role: 'resetZoom', label: i18n.t('Actual size'), icon: 'assets/icons/reset.png'},
                { role: 'zoomIn', label: i18n.t('Zoom in'), icon: 'assets/icons/zoom-in.png'  },
                { role: 'zoomOut', label: i18n.t('Zoom out'), icon: 'assets/icons/zoom-out.png'  },
                { type: 'separator' },
                { role: 'togglefullscreen', label: i18n.t('Toggle fullscreen'), icon: 'assets/icons/full-screen.png' },
                { role: 'toggleDevTools', visible: false },
              ]
            },
            {
              label: i18n.t('Help'),
              submenu: [{
                label: 'Web', icon: 'assets/icons/web.png',
                click() {
                  shell.openExternal('http://franciscorodriguezysilva.com/laboratorio/');
                }},{               
                  label: i18n.t('Creditos'), icon: 'assets/icons/info.png',
                click(){
                    openModal(mainWindow, 'assets/about/about_' + i18n.language + '.html');
                }},
                { label: i18n.t('Tutorial'), icon: 'assets/icons/question.png',
                click() {
                  openModal(mainWindow, 'help/index.html');
                }
              }],
              
            }, /*{
              label: i18n.t('Setting'),
              submenu: [{
                label: i18n.t('Lang'),
                submenu: [
                  {
                    label: i18n.t('es'), type: 'radio',
                    checked: i18n.language === 'es',
                    click: () => {
                      i18n.changeLanguage('es');
                    }
                  },
                  {
                    label: i18n.t('en'), type: 'radio',
                    checked: i18n.language === 'en',
                    click: () => {
                      i18n.changeLanguage('en');
                    }
                  },
                ]
              }]
            }*/
          ]
    }
}


function openModal(mainWindow, file: string) {
  const { BrowserWindow } = require('electron');let modal = new BrowserWindow({ parent: mainWindow, modal: false, show: false, icon: './build/icon.ico', title: "AppIDEX"})
  modal.removeMenu();

  //modal.loadURL('https://www.sitepoint.com')
  modal.loadURL('file://' + __dirname + '/' + file)
  modal.once('ready-to-show', () => {
    modal.show()
  })
}