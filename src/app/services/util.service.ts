import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from './ui.service';
import { AppService } from './app.service';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { firstValueFrom, Observable } from 'rxjs';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  isMobile = false;

  constructor(private appService: AppService,
    private translateService: TranslateService) {

  }

  isObjectEmpty(object) {
    for (const property in object) {
      return false;
    }
    return true;
  }

  async getTranslate(key: string) {
    return await firstValueFrom(this.translateService.get(key));
  }

  async parseDataToBlob() {
    const data = Papa.unparse({
      'fields': ['Variable', 'Value'],
      'data': await this.prepareResultData()
    });

    return new Blob([data], { type: 'text/csv' });;
  }

  async prepareResultData() {
    let resultDataArray = [];

    const entradas = await this.getArrayOfDataTranslated(this.appService.getEntradas());
    const indices = await this.getArrayOfDataTranslated(this.appService.getIndices());

    resultDataArray = resultDataArray.concat(entradas).concat(indices).concat([['IDEX', this.appService.getIndices().idex]]);

    return resultDataArray;
  }

  async getArrayOfDataTranslated(object) {
    const data = [];
    for (const key in object) {
      if (typeof object[key] === 'object') {
        for (const keyObject in object[key]) {
          data.push([await this.getTranslate(keyObject), object[key][keyObject]]);
        }
      } else {
        data.push([await this.getTranslate(key), object[key]]);
      }
    }
    return data;
  }

  async generarInformeExcel() {

    const data = await this.prepareResultData();

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const workbook: XLSX.WorkBook = { Sheets: { 'idex': worksheet }, SheetNames: ['idex'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return new Blob([excelBuffer], { type: 'application/octet-stream' });
  }

  writeXLSX(workbook, wopts) {
    return XLSX.write(workbook, wopts);
  }

  exportTableToExcel(ws: XLSX.WorkSheet, data): XLSX.WorkSheet {
    ws = XLSX.utils.sheet_add_dom(ws, data, {
      cellDates: true, raw: true
    });

    return ws;
  }

  initSheet(data: any[], skipHeader: boolean): XLSX.WorkSheet {
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

