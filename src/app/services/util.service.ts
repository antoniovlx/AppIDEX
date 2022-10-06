import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import * as XLSX from "xlsx";
import { TranslateService } from '@ngx-translate/core';
import { UiService } from './ui.service';
import { AppService } from './app.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import * as FileSaver from 'file-saver';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  isMobile: boolean = false;

  constructor(private appService: AppService,
    private translateService: TranslateService,
    private uiService: UiService, private fileOpener: FileOpener) {

  }

  isObjectEmpty(object) {
    for (const property in object) {
      return false;
    }
    return true;
  }


  htmlToImage(doc, div, options) {
    return html2canvas(div, options).then((canvas) => {
      document.body.removeChild(div);
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    });
  }

  generatePdf(content, doc: jsPDF, options) {

    var div = document.createElement('DIV');

    if (content instanceof HTMLElement) {
      div = content;
    } else {
      div.innerHTML = content;
    }
    document.body.appendChild(div);
    return this.htmlToImage(doc, div, options);
  }


  addNumPages(doc: jsPDF) {
    this.translateService.get(['Página', 'De']).subscribe(res => {
      const numPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= numPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(res['Página'] + ' ' + i + ' ' + res['De'] + ' ' + numPages, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 30);
      }
    });

  }

  getHeaderHtml() {
    let htmlContent = "<!DOCTYPE html>\n";
    htmlContent += "<html>\n";
    htmlContent += "<head>\n";
    htmlContent += "<title>Simulaci&oacute;n AppIDEX</title>\n";
    htmlContent += "<style>\n";
    htmlContent += ".contentData { border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); overflow-x: scroll;}\n";
    htmlContent += " .invoice-box { margin: auto; padding: 30px; font-size: 16px; line-height: 24px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; color: #555;}\n";
    htmlContent += " .invoice-box table { width: 100%; line-height: inherit; text-align: left;}\n";
    htmlContent += " .invoice-box table td { padding: 5px; vertical-align: top;}\n";
    htmlContent += " .invoice-box table tr td:nth-child(2), td:nth-child(3) { text-align: right; }\n";
    htmlContent += " .invoice-box table tr.top table td { padding-bottom: 20px; }\n";
    htmlContent += " .invoice-box table tr.top table td.title { font-size: 25px; line-height: 25px; color: #333;}\n";
    htmlContent += " .invoice-box table tr.information table td {padding-bottom: 40px;}\n";
    htmlContent += " .invoice-box table tr.heading td {background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;}\n";
    htmlContent += " .invoice-box table tr.details td {padding-bottom: 10px;}\n";
    htmlContent += " .invoice-box table tr.heading.centrar td {text-align: center;}\n";
    htmlContent += " .invoice-box table tr.details.centrar td {text-align: center;}\n";
    htmlContent += " .invoice-box table tr.item td {border-bottom: 1px solid #eee;}\n";
    htmlContent += " .invoice-box table tr.item.last td {border-bottom: none;}\n";
    htmlContent += " .invoice-box table tr.top-width td {border-top: 2px solid #eee;}\n";
    htmlContent += " .invoice-box table td.bold {font-weight: bold; text-align: right;}\n";
    htmlContent += " @media only screen and (max-width: 600px) {.invoice-box table tr.top table td { width: 100%; display: block; text-align: center; }\n";
    htmlContent += "   .invoice-box table tr.information table td {width: 100%;display: block;text-align: center;}}\n";
    htmlContent += "  .blue{color: blue;}\n";
    htmlContent += "  .red{color: red;}\n";
    htmlContent += "  .none{display: none;}\n";
    htmlContent += "  .principal{font-size: 18px;}\n";
    htmlContent += "  .titulo{font-size: 20px;}\n";
    htmlContent += "  .subtitulo{font-size: 18px;}\n";
    htmlContent += "  .espacio{height:20px;}\n";
    htmlContent += "  .border-top{border-top: 1px solid grey !important; }\n";
    htmlContent += "  .  .border-bottom{border-bottom: 1px solid grey !important;}\n";


    htmlContent += "</style>\n";
    htmlContent += "</head>\n";
    htmlContent += "<body>\n";

    return htmlContent;
  }

  writeXLSX(workbook, wopts) {
    return XLSX.write(workbook, wopts);
  }

  exportTableToExcel(ws: XLSX.WorkSheet, tableId: string, name?: string): XLSX.WorkSheet {
    let targetTableElm = document.getElementById(tableId);

    // adaptar decimales
    let innerHtml = targetTableElm.innerHTML.replace(",", "");
    innerHtml = innerHtml.replace(".", ",");
    targetTableElm.innerHTML = innerHtml;


    /*let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: "data:" + name,
    });*/
    /*let ws = XLSX.utils.table_to_sheet(targetTableElm, { 
      cellDates: true, raw: true});*/
    ws = XLSX.utils.sheet_add_dom(ws, targetTableElm, {
      cellDates: true, raw: true
    });

    return ws;
  }

  init_sheet(data: any[], skipHeader: boolean): XLSX.WorkSheet {
    return XLSX.utils.json_to_sheet(data, { skipHeader: skipHeader });
  }

  add_content_to_sheet(ws: XLSX.WorkSheet, row: number, data: any[], skipHeader?: boolean): XLSX.WorkSheet {
    return XLSX.utils.sheet_add_json(ws, data, { skipHeader: skipHeader, origin: 'A' + row });
  }

  create_book() {
    return XLSX.utils.book_new();
  }

  append_worksheet_to_book(workbook: XLSX.WorkBook, worksheet: XLSX.WorkSheet, name?: string) {
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  }

  saveFile(data: Blob, fileName: string) {
    let now = new Date(Date.now())
    var formattedDateTime = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " " + now.getHours() + now.getMinutes() + now.getSeconds();

    if (this.appService.isMobile()) {
      this.writeAndOpenFile(data, `${formattedDateTime}_${fileName}`);
    } else {
      FileSaver.saveAs(data, `${formattedDateTime}_${fileName}`);
      this.uiService.presentToast("Datos exportados correctamente");
    }
    this.uiService.dismissLoading();
  }

  async writeAndOpenFile(data: Blob, fileName: string) {
    var reader = new FileReader();
    reader.readAsDataURL(data);
    const that = this;
    reader.onloadend = async function () {
      var base64data = reader.result;
      try {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: <string>base64data,
          directory: Directory.Data,
          recursive: true
        });
        that.uiService.presentToast("Datos exportados correctamente");

        let type = 'application/pdf';
        if(data.type === 'application/octet-stream'){
          type = 'application/vnd.ms-excel';
        }else if(data.type === 'text/html;charset=utf-8'){
          type = 'text/html';
        }

        that.fileOpener.showOpenWithDialog(result.uri, type)
          .then(() => {
            console.log('File is opened');
          })
          .catch(e => {
            console.log('Error opening file', e);
            that.uiService.presentAlertToast("Error opening file");
          });

        console.log('Wrote file', result.uri);
      } catch (e) {
        console.error('Unable to write file', e);
      }
    }
  }


  getBase64Logo() {
    return "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"
      + "/wf07alnreVHFgAAAABJRU5ErkJggg==";
  }

  Acres_Has(x) {
    return 0.404687 * x;
  }

  Has_Acres(x) {
    return x / 0.404687;
  }

  Pies_Metros(x) {
    return 0.304801 * x;
  }

  Metros_Pies(x) {
    return x / 0.304801;
  }

  Pies_Centrimetros(x) {
    return 30.4801 * x;
  }

  Centimetros_Pies(x) {
    return x / 30.4801;
  }

  Pies2_Metros2(x) {
    return 0.304801 * 0.304801 * x;
  }

  Metros2_Pies2(x) {
    return x / (0.304801 * 0.304801);
  }

  Pies2_Hectareas(x) {
    return 0.00304801 * 0.00304801 * x;
  }

  Hectareas_Pies2(x) {
    return x / (0.00304801 * 0.00304801);
  }

  Libras_Kilos(x) {
    return 0.453592 * x;
  }

  Kilos_Libras(x) {
    return x / 0.453592;
  }

  Libras_Toneladas(x) {
    return 0.000453592 * x;
  }

  Toneladas_Libras(x) {
    return x / 0.000453592;
  }

  Libras_Gramos(x) {
    return 453.592 * x;
  }

  Gramos_Libras(x) {
    return x / 453.592;
  }

  Millas_Kilometros(x) {
    return 1.609347 * x
  }
  Kilometros_Millas(x) {
    return x / 1.609347
  }

  MillasHora_PiesMinuto(x) {
    return 88.0 * x
  }
  PiesMinuto_MillasHora(x) {
    return x / 88.0
  }

  BTUs_Julios(x) {
    return 1054.9 * x
  }
  Julios_BTUs(x) {
    return x / 1054.9
  }

  Kws_BTUSegs(x) {
    return 0.948 * x
  }
  BTUSegs_Kws(x) {
    return x / 0.948
  }

  Grados_Radianes(x) {
    return Math.PI * x / 180.
  }

  Radianes_Grados(x) {
    return 180. * x / Math.PI;
  }

  Chains_Metros(x) {
    return 20.1168 * x
  }
  Metros_Chains(x) {
    return x / 20.1168
  }

  Chains_Pies(x) {
    return 66.0 * x
  }

  Pies_Chains(x) {
    return x / 66.0
  }

  ChainsHora_PiesMinuto(x) {
    return 1.1 * x
  }

  PiesMinuto_ChainsHora(x) {
    return x / 1.1
  }

  PiesMinuto_MetrosSegundo(x) {
    return 0.304801 * x / 60.0
  }

  MetrosSegundo_PiesMinuto(x) {
    return 60.0 * x / 0.304801
  }

  ChainsHora_MetrosMinuto(x) {
    return 1.1 * 0.304801 * x
  }

  MetrosMinuto_ChainsHora(x) {
    return x / (1.1 * 0.304801)
  }

  Fahrenheit_Centigrados(x) {
    return (x - 32.0) * 5.0 / 9.0
  }

  Centigrados_Fahrenheit(x) {
    return 32.0 + 9.0 / 5.0 * x
  }

  Pulgadas_Milimetros(x) {
    return 25.4 * x
  }

  Milimetros_Pulgadas(x) {
    return x / 25.4
  }

  Pulgadas_Centimetros(x) {
    return 2.54 * x
  }
  Centimetros_Pulgadas(x) {
    return x / 2.54
  }
}
