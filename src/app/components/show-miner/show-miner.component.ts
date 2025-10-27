import { Component, Inject, OnInit } from '@angular/core';
import { PqrsService } from '../../services/pqrs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-show-miner',
  templateUrl: './show-miner.component.html',
  styleUrl: './show-miner.component.scss'
})
export class ShowMinerComponent implements OnInit {
  pqr:any;
  ID:any;
  pdfSrc!: SafeResourceUrl;
  excelSrc:string|boolean = "";
  isOpen:boolean = false;
  minedAttachmentsOp: string[] = [];
  minedAttachmentsTs: string[] = [];
  minedAttachmentsFac: string[] = [];
  sound!: Howl;
  audioUrl!: string;
  isAudio:boolean = false;
  isPlaying = false;
  area:any;
  role:any;
  showInput = false;
  progress: number = 0; // Porcentaje de progreso (0-100)
  progressInterval: any; // Referencia al intervalo

  isMinerOp:boolean = false;
  isMinerTs:boolean = false;
  isMinerFac:boolean = false;
  formMinner!:FormGroup;
  fullRoute = "";

  audioName = "";
  constructor(private _serviceP:PqrsService,private sanitizer: DomSanitizer,
    private _iconService:IconService,public dialogRef: MatDialogRef<ShowMinerComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any,private _fb:FormBuilder,
    private _roleService:RoleService
  ){
    this.formMinner = _fb.group({
      isMinerOp: [false],
      isMinerTs: [false],
      isMinerFac: [false],
      observationOp: [''],
      observationTs: [''],
      observationFac: [''],

    })
    this.role = this._roleService.getRole();
    
  }

  ngAfterViewInit():void{
    this.area = this.data.area
  }

  ngOnInit(): void {
    console.log(this.data.id)
    
    
    this._serviceP.getPqr(this.data.id).subscribe({
      next:(data:any)=>{
        console.log(data)
        if(this.data.area == "FAC" && data.minerUrlsFac != null){
          this.isMinerFac = true
          this.formMinner.patchValue({
            isMinerOp:false,
            isMinerTs:false,
            isMinerFac:true
          })
          this.minedAttachmentsFac = data.minerUrlsFac.split(',').filter((n:any) => n);
          this.fullRoute = data.minerUrlsFac
        }else if(this.data.area == "OP" && data.minerUrlsOp != null){
          this.isMinerOp = true
          this.formMinner.patchValue({
            isMinerOp:true,
            isMinerTs:false,
            isMinerFac:false
          })
          this.minedAttachmentsOp = data.minerUrlsOp.split(',').filter((n:any) => n);
          this.fullRoute = data.minerUrlsOp

        }else if(this.data.area == "TS" && data.minerUrlsTs != null){
          this.isMinerTs = true
          this.formMinner.patchValue({
            isMinerOp:false,
            isMinerTs:true,
            isMinerFac:false
          })
          this.minedAttachmentsTs = data.minerUrlsTs.split(',').filter((n:any) => n);
          this.fullRoute = data.minerUrlsTs

        }
        this.pqr= data
        console.log(data)
      }
    })
  }

  showReject(){
    if(this.showInput){
      this.showInput = false;
    }else{
      this.showInput = true
    }
  }

  downloadFull(){
    let data = new FormData();
    data.append("path",this.fullRoute);

     this._serviceP.downloadFullHistory(data).subscribe({
          next: (data: Blob) => {
            // Usar saveAs para descargar el archivo
            const blob = new Blob([data], { type: 'application/zip' });
            saveAs(blob, 'archivos-historial.zip'); // 'archivos.zip' es el nombre del archivo a descargar
          },
          error: (err) => {
            console.error('Error descargando el archivo:', err);
          }
    });
  }

  truncateFilename(name: string, limit: number): string {
    if (name.length <= limit) {
      return name;
    }
  
    const start = name.substring(0, limit / 2);
    const end = name.substring(name.length - (limit / 2), name.length);
    return `${start}...${end}`;
  }

  getIcon(name: string): string {
    return this._iconService.getIcon(name);
  }

  updateProgress() {
    if (this.sound) {
      const currentTime = this.sound.seek(); // Tiempo actual (en segundos)
      const duration = this.sound.duration(); // Duración total del audio (en segundos)
      this.progress = (currentTime / duration) * 100; // Calcula el porcentaje
    }
  }

  play(type:string) {
    if(type == 'PLAY'){
      this.isPlaying = true;
      if (this.sound) {
        this.sound.play();
        // Actualizar la barra de progreso cada 500 ms
        this.progressInterval = setInterval(() => {
        this.updateProgress();
      }, 500);
      }
    }else{
      this.isPlaying = false;
      if (this.sound) {
        this.sound.pause();
      }
      clearInterval(this.progressInterval);
    }


   
  }

  pause() {
    this.isPlaying = false;
    if (this.sound) {
      this.sound.pause();
    }
    clearInterval(this.progressInterval); // Limpia el intervalo
  }

  stop() {
    this.isPlaying = false;
    if (this.sound) {
      this.sound.stop();
    }
    clearInterval(this.progressInterval);
  }

  seekTo(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Casting
    const newValue = Number(inputElement.value); // Convertir a número
    if (this.sound) {
      const duration = this.sound.duration();
      const newTime = (newValue / 100) * duration;
      this.sound.seek(newTime);
      this.updateProgress();
    }
  }

  getFormatFromType(type: string): string {
    const formats: { [key: string]: string } = {
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
      'audio/aac': 'aac',
      'audio/gsm': 'gsm'
      // Agrega otros tipos MIME según sea necesario
    };
    
    return formats[type] || 'mp3'; // Valor por defecto
  }

  getAttach(name: string) {
    this.stop();
    const fileExtension = name.split('.').pop();
    this.audioName = this.truncateFilename(name.replace('Resources/Attach/', ''),20);
    if (fileExtension === 'pdf') {
      let url = "http://10.128.50.16:4545/files/" + name.replace("Resources/Attach/", "");
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelSrc = false
      this.isAudio = false
      this.isOpen = true
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      this.pdfSrc = false;
      this.excelSrc = "http://10.128.50.16:4545/files/" + name.replace("Resources/Attach/", "");
      this.isOpen = true
    }else if(fileExtension == 'mp3' || fileExtension == 'ogg'
      || fileExtension == 'wav'|| fileExtension == 'acc'|| fileExtension == 'gsm'
    ){
      this.isAudio = true;
      this.excelSrc = false
      this.pdfSrc = false;
      console.log(name)
      // this.audioUrl ="https://localhost:44369/files/" + name.replace("Resources\\Attach\\", "");
      this.audioUrl ="http://10.128.50.16:4545/files/" + name.replace("Resources/Attach/", "");
      this.sound = new Howl({
        src: [this.audioUrl],
        format: [this.getFormatFromType(fileExtension!)], // Ajusta el formato según el tipo de archivo
        html5: false // Usa HTML5 Audio para mayor compatibilidad
      });
    }
     else {
      console.log(`Extensión desconocida: ${fileExtension}`);
    }

  }

  submit(){
    let data = new FormData();
    data.append("isMinerOp", this.formMinner.get("isMinerOp")!.value);
    data.append("isMinerTs", this.formMinner.get("isMinerTs")!.value);
    data.append("isMinerFac", this.formMinner.get("isMinerFac")!.value);

    data.append("observationOp", this.formMinner.get("observationOp")!.value);
    data.append("observationTs", this.formMinner.get("observationTs")!.value);
    data.append("observationFac", this.formMinner.get("observationFac")!.value);
    data.append("id", this.data.id);
  
    // ✅ CORRECTO - Valida según el área activa
    if((this.isMinerOp && this.formMinner.get("observationOp")!.value.length < 1) ||
       (this.isMinerTs && this.formMinner.get("observationTs")!.value.length < 1) ||
       (this.isMinerFac && this.formMinner.get("observationFac")!.value.length < 1)){          
       Swal.fire({
          icon: 'warning',
          title: 'Porfavor Complete los campos obligatorios'
      })
        return;
    }

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
            this.dialogRef.close()
          }
        })
      }
    })
}
}
