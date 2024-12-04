import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HistoryComponent } from '../history/history.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PqrItem } from '../../interfaces/PqrItem';
import { SelectAprovedComponent } from '../select-aproved/select-aproved.component';
import saveAs from 'file-saver';
import { IconService } from '../../services/icon.service';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-response-pqr',
  templateUrl: './response-pqr.component.html',
  styleUrl: './response-pqr.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class ResponsePqrComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput') fileInput2!: ElementRef;


  private islocalAvailable = this.checkLocalStorage();
  dataSource = new MatTableDataSource();
  sound!: Howl;
  formResponse!: FormGroup;
  formAudio!: FormGroup;
  formFormat!: FormGroup;
  ID: any;
  messages: any;

  isEmail:boolean = false;
  isAudio:boolean = false;
  isFormat: boolean = false;
  audioUrl!: string;

  isDirector: boolean = false;

  displayedColumns: string[] = [];  // Nombres de las columnas a mostrar
  columns: string[] = [];
  filteredAttachments: string[] = [];
  minedAttachments: string[] = [];
  dataExcel: any;

  histories: any;

  pdfSrc!: SafeResourceUrl;
  excelSrc:string|boolean = "";

  urlFile: any;

  pqrHeaders!: PqrItem;
  isPlaying = false;

  history: any;

  namesFiles: string[] = [];
  Files: File[] = [];
  isFile = false;

  namesFiles2: string[] = [];
  Files2: File[] = [];
  isFile2 = false;

  withAttachResponse2 = false;

  withAttachResponse = false;

  isOpen:boolean = false;
  role = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _serviceP: PqrsService, private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute, public dialog: MatDialog, private sanitizer: DomSanitizer, private iconService: IconService,
    private _role:RoleService) {
    this.ID = _route.snapshot.paramMap.get('id');
    this.formResponse = _fb.group({
      pqrText: [{ value: '', disabled: true }],
      pqrSubject: [{ value: '', disabled: true }],
      response: ['', Validators.required],
      comments: [''],
    })


    this.formAudio = _fb.group({
      response: ['', Validators.required],
      comments: [''],
    })

    this.formFormat = _fb.group({
      response: ['', Validators.required],
      comments: [''],
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.role = this._role.getRole();
    this.getHistory();
    this.getSignatureValid();
    console.log(this.history)


    if (this.islocalAvailable) {
      //const redirected = localStorage.getItem('redirected');
      //console.log(redirected)
      //if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      //  // Si ya se ha redirigido, no hacer nada
      //  if (redirected == null) {
      //    localStorage.setItem('redirected', 'true');

      //  } else {
      //    // Configura el estado de redirección
      //    // Redirige a otra página
      //    localStorage.removeItem('redirected');
      //    this._redirect.navigate(['/indexPqrs']);
      //    //this.getPqr();

      //  }
      //}


      if (this.ID) {
        this.getPqr();
        this.getChat();
      }
    }


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
    return this.iconService.getIcon(name);
  }

  ngOnDestroy() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  
  getAttach(name: string) {
    const fileExtension = name.split('.').pop();

    if (fileExtension === 'pdf') {
      let url = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelSrc = false
      this.isOpen = true
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      this.pdfSrc = false;
      this.excelSrc = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.isOpen = true
    } else {
      console.log(`Extensión desconocida: ${fileExtension}`);
    }

  }

  getFirstLetter(text: string): string {
    const match = text.match(/[a-zA-Z]/);
    return match ? match[0] : '';
  }

  getPqr() {
    this._serviceP.getPqr(this.ID).subscribe({
      next: (data: PqrItem) => {
        console.log(data)
        if (data.response != null ) {
          if (data.response.length > 0) {
            this.isDirector = true;
          }
        }
        console.log(data.from)

        if (data.attachsResponse != null && data.attachsResponse.length > 0) {
          this.withAttachResponse = true;
        }

        if (data.attachsResponse2 != null && data.attachsResponse2.length > 0) {
          this.withAttachResponse2 = true;
        }

        if (data.typeAttachment == 'CORREO') {
          this.isEmail = true;
          this.formResponse.patchValue({
            pqrText: data.body,
            //pqrSubject: data.subject
          })
          this.pqrHeaders = data;
          if (this.pqrHeaders?.attachmentUrls) {
            this.filteredAttachments = this.pqrHeaders.attachmentUrls.split(',').filter(n => n);
          }
          if (this.pqrHeaders?.minerUrls) {
            this.minedAttachments = this.pqrHeaders.minerUrls.split(',').filter(n => n);
          }
          if (this.role != "ANALISTA") {
            this.formResponse.patchValue({
              response: data.response
            })
            this.formResponse.get('response')?.disable()
          }
          this.formResponse.patchValue({
            response: data.response
          })

        } else if (data.typeAttachment == 'AUDIO') {
          this.isAudio = true;
          this._serviceP.GetAudio(data.id).subscribe({
            next: (response:Blob) => {
             

              this.audioUrl = URL.createObjectURL(response);
              console.log(response)
              this.sound = new Howl({
                src: [this.audioUrl],
                format: [this.getFormatFromType(response.type)], // Ajusta el formato según el tipo de archivo
                html5: false // Usa HTML5 Audio para mayor compatibilidad
              });
            }
          })
          if (data.response != null && data.response.length > 0) {
            this.formAudio.patchValue({
              response: data.response
            })
            this.formAudio.get('response')?.disable()

          }
        } else if (data.typeAttachment == 'EXCEL') {
          this.isFormat = true;
          let url = "http://10.128.50.17:4040/files/" + data.filePath.replace("Resources/Attach/", "").replace(",", "");
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          console.log(this.pdfSrc)
          if (data.response != null && data.response.length > 0) {
            this.formFormat.patchValue({
              response: data.response
            })
            this.formFormat.get('response')?.disable()

          }
        }
        
      }
    })
  }

  getHistory() {
    this._serviceP.GetHistory(this.ID).subscribe({
      next: (data: any) => {
        console.log(data)
        this.history = data
      }
    })
  }

  closeDoc(){
    this.isOpen = false
  }

  aprovatedPqr() {
    
  }

  get shouldApplyFlexStyle(): boolean {
    return this.filteredAttachments.length > 2;
  }

  openSelect() {
    const dialogRef = this.dialog.open(SelectAprovedComponent, {
      width: '70%',
      height: '70%',
      data: {
        id: this.ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog(id:number) {

    const dialogRef = this.dialog.open(HistoryComponent, {
      width: '70%',
      height: '70%',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getFile(event: any) {
    this.Files.push(event.target.files[0]);
    this.namesFiles.push(event.target.files[0].name);
    this.isFile = true
  }

  getFile2(event: any) {
    this.Files2.push(event.target.files[0]);
    this.namesFiles2.push(event.target.files[0].name);
    this.isFile2 = true
  }

  deleteFile(file: string) {
    if (this.namesFiles.length < 1) {
      this.isFile = false;
    }
    const fileIndex = this.Files.findIndex(x => x.name == file);
    this.namesFiles = this.namesFiles.filter(name => name !== file);

    if (fileIndex > -1) {
      this.Files.splice(fileIndex, 1);
    }


    this.fileInput.nativeElement.value = '';

  }

  getFormatFromType(type: string): string {
    const formats: { [key: string]: string } = {
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
      'audio/aac': 'aac'
      // Agrega otros tipos MIME según sea necesario
    };
    console.log(formats[type])
    return formats[type] || 'mp3'; // Valor por defecto
  }


  play() {
    this.isPlaying = true;
    if (this.sound) {
      this.sound.play();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.sound) {
      this.sound.stop();
    }
  }



  getChat() {
    this._serviceP.getChat(this.ID).subscribe({
      next: (data: any) => {
        console.log(data)
        this.messages = data;
      }
    })
  }

  downloadFile() {
    this._serviceP.downloadZip(this.ID).subscribe({
      next: (data: Blob) => {
        // Usar saveAs para descargar el archivo
        const blob = new Blob([data], { type: 'application/zip' });
        saveAs(blob, 'archivos-respuesta.zip'); // 'archivos.zip' es el nombre del archivo a descargar
      },
      error: (err) => {
        console.error('Error descargando el archivo:', err);
      }
    });
  }

  downloadFile2() {
    this._serviceP.downloadZip2(this.ID).subscribe({
      next: (data: Blob) => {
        // Usar saveAs para descargar el archivo
        const blob = new Blob([data], { type: 'application/zip' });
        saveAs(blob, 'archivos-director.zip'); // 'archivos.zip' es el nombre del archivo a descargar
      },
      error: (err) => {
        console.error('Error descargando el archivo:', err);
      }
    });
  }

  submit(){
    
  }

  sendRevision() {

    if(this.formResponse.invalid){
      Swal.fire({
        title:'Por favor complete los campos obligatorios',
        icon : 'error'
      })
    }else{
      const data = new FormData();

      if (this.isEmail) {
        data.append("pqrId", this.ID);
        data.append("response", this.formResponse.get('response')!.value);
        data.append("comments", this.formResponse.get('comments')!.value);
      } else if (this.isAudio) {
        data.append("pqrId", this.ID);
        data.append("response", this.formAudio.get('response')!.value);
        data.append("comments", this.formAudio.get('comments')!.value);
      } else if (this.isFormat) {
        data.append("pqrId", this.ID);
        data.append("response", this.formFormat.get('response')!.value);
        data.append("comments", this.formFormat.get('comments')!.value);
      }

      this.Files.forEach((file, index) => {
        data.append(`File${index + 1}`, file);
      });

      this.Files2.forEach((file, index) => {
        data.append(`Response${index + 1}`, file);
      });



      this._serviceP.responseToDir(data).subscribe({
        next: (data: any) => {
          this._redirect.navigateByUrl("indexPqrs")
          Swal.fire({
            icon: 'success',
            title: data.message
          })
        }
      })
    }
  }

  getSignatureValid(){
    this._serviceP.getSignature().subscribe({
      next: (data: any) => {
        if (data.message == "FALSE" && this.role == "ANALISTA") {
          Swal.fire({
            icon: 'info',
            title: 'Firma Necesaria',
            text: 'Su usuario no cuenta con una firma asignada, por favor comunicarse con el coordinador para subir su firma digital',
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            showCloseButton: true,
            confirmButtonColor: '#ff0000',
            // cancelButtonColor: '#a9a9a9'
          })
        }
      }
    })
  }

  sendFollow(status:string) {
    const data = new FormData();

    

    if (this.isEmail) {
      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formResponse.get('response')!.value);
      data.append("comments", this.formResponse.get('comments')!.value);
    } else if (this.isAudio) {
      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formAudio.get('response')!.value);
      data.append("comments", this.formAudio.get('comments')!.value);
    } else if (this.isFormat) {
      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formFormat.get('response')!.value);
      data.append("comments", this.formFormat.get('comments')!.value);
    }




    this._serviceP.sendFollow(data).subscribe({
      next: (data: any) => {
        if(this.role == "DIRGENERAL"){
          this._redirect.navigate(["indexDir"])
          }
          else if(this.role == "COORDINADOR"){
            this._redirect.navigate(["indexCoord"])
          }
          else if(this.role == "MINERO"){
            this._redirect.navigate(["indexMiner"])
          }
          else{
            this._redirect.navigate(["indexPqrs"])
          }

        
        Swal.fire({
          icon: 'success',
          title: data.message
        })
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }
}
