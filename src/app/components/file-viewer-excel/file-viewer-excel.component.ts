import { Component, Input, SimpleChanges } from '@angular/core';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-file-viewer-excel',
  templateUrl: './file-viewer-excel.component.html',
  styleUrl: './file-viewer-excel.component.scss'
})
export class FileViewerExcelComponent {
  @Input() fileUrl: string | null = null;
  private container!: HTMLDivElement;

  ngAfterViewInit(): void {
    this.container = document.getElementById('handsontable') as HTMLDivElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileUrl'] && this.fileUrl) {
      this.loadFile(this.fileUrl);
    }
  }

  private loadFile(url: string): void {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${ response.statusText }`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => this.handleArrayBufferInput(arrayBuffer))
      .catch(error => console.error('Error cargando el archivo:', error));
  }

  private handleArrayBufferInput(arrayBuffer: ArrayBuffer): void {
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    console.log('JSON Data:', jsonData);

    if (this.container) {
      new Handsontable(this.container, {
        data: jsonData,
        colHeaders: true,
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: true,
        licenseKey: 'non-commercial-and-evaluation'
      });
    }
  }
}
