import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { IconService } from '../../services/icon.service';
import { DateTime } from 'luxon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-history-response',
  templateUrl: './history-response.component.html',
  styleUrl: './history-response.component.scss',
  providers:[DatePipe]
})
export class HistoryResponseComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
    formSend!: FormGroup;
    histories:any;
    isLoading = false;
    filteredAttachments:string[] = [];
    emailId: any;
    expandedCardIndex: number | null = null; // Controla qué tarjeta está expandida
  
    constructor(private _serviceT: PqrsService, private _fb: FormBuilder, public dialogRef: MatDialogRef<HistoryResponseComponent>
      , @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router, 
      private _roleService: RoleService,private datePipe: DatePipe
    ,private iconService: IconService,private sanitizer: DomSanitizer) {
      
  
    }
  
    
  
    ngOnInit(): void {
      this.getTask();
    }
  
    // getTask() {
    //   this._serviceT.getHistoryResponse(this.data.id).subscribe({
    //     next: (result:any) => {
    //       this.histories = result
    //       console.log(result)
          
    //     }
    //   })
    // }

    getTask() {
      this._serviceT.getHistoryResponse(this.data.id).subscribe({
        next: (result: any) => {
          // Sanitizar solo una vez y almacenar el HTML ya sanitizado
          this.histories = result.map((hist: any) => {
            return {
              ...hist,
              response: this.sanitizer.bypassSecurityTrustHtml(hist.response)
            };
          });
          console.log(this.histories);
        },
        error: (err) => {
          console.error('Error fetching history response:', err);
        }
      });
    }
  

    toggleCard(index: number) {
      // Si la tarjeta ya está expandida, la contraemos
      if (this.expandedCardIndex === index) {
        this.expandedCardIndex = null;
      } else {
        this.expandedCardIndex = index;
      }
    }

    formatDate(dateString: string): string | null {
      // Parse the date string to a Date object
      const date = new Date(dateString);
      // Format the date using Angular's DatePipe
      return this.datePipe.transform(date, "dd/MMM/yyyy 'a las' HH:mm",'es-CO');
    }
  
    truncateFilename(name: string, limit: number): string {
      if (name.length <= limit) {
        return name;
      }
    
      const start = name.substring(0, limit / 2);
      const end = name.substring(name.length - (limit / 2), name.length);
      return `${start}...${end}`;
    }
  
    getAttach(routes:string) {
      let data = new FormData();
      data.append("path",routes)
      this._serviceT.getFile(data).subscribe({
        next: (file: any) => {
          
          const binaryData = file.data.fileContents;
          const blob = new Blob([binaryData], { type: file.data.contentType });
  
          let fileUrl = window.URL.createObjectURL(blob);
          saveAs(fileUrl, routes.replace("Resources/Attach/",""));
          
        },
        error: (err) => {
          console.error('Error downloading file', err);
        }
      })
    }
  
    getIcon(name: string): string {
      return this.iconService.getIcon(name);
    }
  
    getSanitizedHtml(html: string) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  
    submit() {
      
      
    }
  
    cerrar(): void {
      // this.dialogRef.close();
    }
  
}
