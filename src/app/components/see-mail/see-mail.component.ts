import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PqrItem } from '../../interfaces/PqrItem';
import { IconService } from '../../services/icon.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-see-mail',
  templateUrl: './see-mail.component.html',
  styleUrl: './see-mail.component.scss'
})
export class SeeMailComponent {
   isMinerOp:boolean = false;
    isMinerTs:boolean = false;
    isMinerFac:boolean = false;
    formMinner:FormGroup;
    pqrHeaders!: PqrItem;
    isPlaying = false;
    history: any;
    pqr:any;
    withAttachResponse2 = false;
    withAttachResponse = false;
    isEmail:boolean = false;
    isAudio:boolean = false;
    isFormat: boolean = false;
    filteredAttachments: string[] = [];
    ID: any;
    pdfSrc!: SafeResourceUrl;
    excelSrc:string|boolean = "";
    isOpen:boolean = false;
    textVariable:any;
    isReadonly: boolean = true; 

    constructor(private _fb:FormBuilder,private _serviceP:PqrsService,
      private iconService:IconService, private sanitizer: DomSanitizer,public dialogRef: MatDialogRef<SeeMailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.formMinner = _fb.group({
        isMinerOp: [false],
        isMinerTs: [false],
        isMinerFac: [false],
        observationOp: [''],
        observationTs: [''],
        observationFac: [''],
  
      })
    }
    // public dialogRef: MatDialogRef<SeeMailComponent>
    // , @Inject(MAT_DIALOG_DATA) public data: any

    ngOnInit(){
      this.getPqr();
    }

    closeDoc(){
      this.isOpen = false
    }
    onCheckboxChangeMiner(event: MatCheckboxChange,type:string) {
      if(event.checked){
        if (type == "minerOp") {
          this.isMinerOp = true;  
        } else if( type == "minerFac" ){
          this.isMinerFac = true;    
        } else if( type == "minerTs" ){
          this.isMinerTs = true;    
        }
      }else{
        if (type == "minerOp") {
          this.isMinerOp = false;  
          this.formMinner.patchValue({
            observationOp: '',
          })
        } else if( type == "minerFac" ){
          this.isMinerFac = false;    
          this.formMinner.patchValue({
            observationFac: '',         
          })
        } else if( type == "minerTs" ){
          this.isMinerTs = false;    
          this.formMinner.patchValue({
            observationTs: '',        
          })
        }
      }
    }

    getIcon(name: string): string {
      return this.iconService.getIcon(name);
    }

    truncateFilename(name: string, limit: number): string {
      if (name.length <= limit) {
        return name;
      }
    
      const start = name.substring(0, limit / 2);
      const end = name.substring(name.length - (limit / 2), name.length);
      return `${start}...${end}`;
    }

    getFirstLetter(text: string): string {
      const match = text.match(/[a-zA-Z]/);
      return match ? match[0] : '';
    }
    
    getAttach(name: string) {
      const fileExtension = name.split('.').pop();
  
      if (fileExtension === 'pdf') {
        let url = "https://www.pqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.excelSrc = false
        this.isOpen = true
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        this.pdfSrc = false;
        this.excelSrc = "https://www.pqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
        this.isOpen = true
      } else {
        console.log(`Extensión desconocida: ${fileExtension}`);
      }
  
    }

    getPqr() {
        this._serviceP.getPqr(this.data.id).subscribe({
          next: (data: PqrItem) => {
            this.pqr = data;
            this.textVariable = data.body;
            
    
           
           
           
    
            if (data.attachsResponse != null && data.attachsResponse.length > 0) {
              this.withAttachResponse = true;
            }
    
            if (data.attachsResponse2 != null && data.attachsResponse2.length > 0) {
              this.withAttachResponse2 = true;
            }
    
            if (data.typeAttachment == 'CORREO') {
              
              this.isEmail = true;
              
              this.pqrHeaders = data;
              if (this.pqrHeaders?.attachmentUrls) {
                this.filteredAttachments = this.pqrHeaders.attachmentUrls.split(',').filter(n => n);
              }                           
            } else if (data.typeAttachment == 'EXCEL') {
              
              
            }
            
          }
        })
      }
  
    submit(){
      let data = new FormData();
      data.append("isMinerOp", this.formMinner.get("isMinerOp")!.value);
      data.append("isMinerTs", this.formMinner.get("isMinerTs")!.value);
      data.append("isMinerFac", this.formMinner.get("isMinerFac")!.value);
  
      data.append("observationOp", this.formMinner.get("observationOp")!.value);
      data.append("observationTs", this.formMinner.get("observationTs")!.value);
      data.append("observationFac", this.formMinner.get("observationFac")!.value);
      // data.append("id", this.data.id);
  
      this._serviceP.sendToMiner(data).subscribe({
        next:(data:any)=>{
          Swal.fire({
            icon:'success',
            title: data.message,
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:true,
            allowOutsideClick:false
          }).then((result)=> {
            if(result.dismiss){
              // this.dialogRef.close()
            }
          })
  
          
        }
      })
    }
}
