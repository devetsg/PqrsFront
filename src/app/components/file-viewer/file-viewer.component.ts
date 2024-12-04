import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPdfFile } from 'pdfjs-dist';
import { PqrsService } from '../../services/pqrs.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.scss'
})
export class FileViewerComponent implements OnInit{
  @Input() fileUrl: string | undefined;
  sanitizedUrl: SafeResourceUrl | undefined;
  pdfSrc: any;

  constructor(private sanitizer: DomSanitizer,private _serviceP:PqrsService) { }

  ngOnInit(): void {
    this.pdfSrc = this.fileUrl
  }

  //private getViewerUrl(url: string): string {
  //  console.log("si entra")

  //  const extension = url.split('.').pop()?.toLowerCase();
  //  let viewerUrl = '';

  //  if (extension === 'pdf') {
  //    this.isPdf = true;

  //  } else if (extension === 'doc' || extension === 'docx') {
  //    this.isDoc = true;

  //  } else if (extension === 'xls' || extension === 'xlsx') {
  //    this.isXls = true;

  //  }

  //  return url;
  //}
  
}
