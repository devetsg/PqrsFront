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
@Component({
  selector: 'app-history-miner',
  templateUrl: './history-miner.component.html',
  styleUrl: './history-miner.component.scss',
  providers:[
    DatePipe
  ]
})
export class HistoryMinerComponent {
 @ViewChild('fileInput') fileInput!: ElementRef;

  formSend!: FormGroup;
  histories:any;
  isLoading = false;
  filteredAttachments:string[] = [];
  emailId: any;

  constructor(private _serviceT: PqrsService, private _fb: FormBuilder, public dialogRef: MatDialogRef<HistoryMinerComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router, 
    private _roleService: RoleService,private datePipe: DatePipe
  ,private iconService: IconService) {
    

  }

  

  ngOnInit(): void {
    this.getTask();
  }

  getTask() {
    this._serviceT.getHistoryMiner(this.data.id).subscribe({
      next: (result:any) => {
        this.histories = result
        console.log(result)
        this.filteredAttachments = result[0].dataUrl.split(',').filter((n:any) => n);
      }
    })
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

  

  submit() {
    
    
  }

  cerrar(): void {
    // this.dialogRef.close();
  }

  
  
  
}
