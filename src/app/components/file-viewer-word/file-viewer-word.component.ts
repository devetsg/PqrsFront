import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as docx from 'docx';


@Component({
  selector: 'app-file-viewer-word',
  templateUrl: './file-viewer-word.component.html',
  styleUrl: './file-viewer-word.component.scss'
})
export class FileViewerWordComponent {
  @Input() fileUrl: string | undefined;
  sanitizedUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const fileUrl = this.fileUrl;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/gview?url=${fileUrl}&embedded=true`
    );
    console.log(this.sanitizedUrl)
  }

}
