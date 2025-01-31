// icon.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconsList: { [key: string]: string } = {
    'folder': '../../assets/images/ms-carpeta.svg',
    'pdf': '../../assets/images/ms-pdf.svg',
    'docx': '../../assets/images/ms-word.svg',
    'xlsx': '../../assets/images/ms-excel.svg',
    'pptx': '../../assets/images/ms-power.svg',
    'zip': '../../assets/images/ms-winrar.svg',
    'rar': '../../assets/images/ms-winrar.svg',
    'txt': '../../assets/images/ms-txt.svg',
    'mp3': '../../assets/images/ms-audio.svg',
    'wav': '../../assets/images/ms-audio.svg',
    'flac': '../../assets/images/ms-audio.svg',
    'ogg': '../../assets/images/ms-audio.svg',
    'aac': '../../assets/images/ms-audio.svg',
    'm4a': '../../assets/images/ms-audio.svg',
    'default': '../../assets/images/ms-document.svg'
  };

  private typeDocs: string[] = ['pdf', 'docx', 'xlsx', 'pptx', 'zip', 'rar', 'txt', 'mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a'];

  constructor() {}

  getFileExtension(filename: string): string {
    if (filename.includes('.')) {
      const parts = filename.split('.');
      if (parts.length > 1) {
        const extension = parts.pop()!;
        if (/^[a-zA-Z]+$/.test(extension)) {
          return extension;
        }
      }
    }
    return '';
  }

  getIcon(filename: string): string {
    const extension = this.getFileExtension(filename);
    if (this.typeDocs.includes(extension)) {
      return this.iconsList[extension];
    } else {
      return extension.length > 0 ? this.iconsList['default'] : this.iconsList['folder'];
    }
  }
}
