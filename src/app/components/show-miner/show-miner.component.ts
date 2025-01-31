import { Component, Inject, OnInit } from '@angular/core';
import { PqrsService } from '../../services/pqrs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  progress: number = 0; // Porcentaje de progreso (0-100)
  progressInterval: any; // Referencia al intervalo

  audioName = "";
  constructor(private _serviceP:PqrsService,private sanitizer: DomSanitizer,
    private _iconService:IconService,public dialogRef: MatDialogRef<ShowMinerComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngAfterViewInit():void{
    this.area = this.data.area
  }

  ngOnInit(): void {
    console.log(this.data.id)
    
    
    this._serviceP.getPqr(this.data.id).subscribe({
      next:(data:any)=>{
        console.log(data)
        if(this.data.area == "FAC" && data.minerUrlsFac != null){
          this.minedAttachmentsFac = data.minerUrlsFac.split(',').filter((n:any) => n);

        }else if(this.data.area == "OP" && data.minerUrlsOp != null){
          this.minedAttachmentsOp = data.minerUrlsOp.split(',').filter((n:any) => n);
        }else if(this.data.area == "TS" && data.minerUrlsTs != null){
          this.minedAttachmentsTs = data.minerUrlsTs.split(',').filter((n:any) => n);
        }
        this.pqr= data
        console.log(data)
      }
    })
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
      'audio/aac': 'aac'
      // Agrega otros tipos MIME según sea necesario
    };
    
    return formats[type] || 'mp3'; // Valor por defecto
  }

  getAttach(name: string) {
    this.stop();
    const fileExtension = name.split('.').pop();
    this.audioName = this.truncateFilename(name.replace('Resources/Attach/', ''),20);
    if (fileExtension === 'pdf') {
      let url = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelSrc = false
      this.isAudio = false
      this.isOpen = true
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      this.pdfSrc = false;
      this.excelSrc = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.isOpen = true
    }else if(fileExtension == 'mp3' || fileExtension == 'ogg'
      || fileExtension == 'wav'|| fileExtension == 'acc'
    ){
      this.isAudio = true;
      this.excelSrc = false
      this.pdfSrc = false;

      this.audioUrl ="https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
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
}
