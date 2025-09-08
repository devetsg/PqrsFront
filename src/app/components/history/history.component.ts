import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PqrItem } from '../../interfaces/PqrItem';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { IconService } from '../../services/icon.service';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class HistoryComponent {
  private islocalAvailable = this.checkLocalStorage();
  dataSource = new MatTableDataSource();
  sound!: Howl;
  formResponse!: FormGroup;
  formAudio!: FormGroup;
  formFormat!: FormGroup;
  ID: any;
  messages: any;

  isEmail: boolean = false;
  isAudio: boolean = false;
  isFormat: boolean = false;
  audioUrl!: string;

  isDirector: boolean = false;

  displayedColumns: string[] = [];  // Nombres de las columnas a mostrar
  columns: string[] = [];
  filteredAttachments: string[] = [];
  dataExcel: any;

  histories: any;

  pdfSrc!: SafeResourceUrl;
  excelSrc:string|boolean = "";

  urlFile: any;

  pqrHeaders!: PqrItem;
  isPlaying = false;

  history: any;

  withAttachResponse = false;

  withAttachResponse2 = false;
  bodyControl: FormControl;


  isOpen:boolean = false;
  pqr:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tinyMceConfig = {
    height: 500,
    menubar: false,
    base_url:'/tinymce',
    suffix: '.min',
    plugins: 'lists advlist link ',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignjustify  alignright | numlist bullist outdent indent ',
    content_style: 'body, p, ol, ul, li, table, th, td { font-family: "Century Gothic", sans-serif; font-size: 14px; }',
    readonly: true,
   
  };

  constructor(private _serviceP: PqrsService, private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute, public dialog: MatDialog, private sanitizer: DomSanitizer
    , public dialogRef: MatDialogRef<HistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private iconService: IconService) {

    this.ID = data.id;
    this.bodyControl = new FormControl(''); 

    this.formResponse = _fb.group({
      pqrText: [{ value: '', disabled: true }],
      pqrSubject: [{ value: '', disabled: true }],
      response: [''],
      body:this.bodyControl,
      comments: [''],
    })

    this.formAudio = _fb.group({
      response: [''],
      comments: [''],
    })

    this.formFormat = _fb.group({
      response: [''],
      comments: [''],
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getHistory();



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

  getFirstLetter(text: string): string {
    const match = text.match(/[a-zA-Z]/);
    return match ? match[0] : '';
  }

  getIcon(name: string): string {
    return this.iconService.getIcon(name);
  }

  ngOnDestroy() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  get shouldApplyFlexStyle(): boolean {
    return this.filteredAttachments.length > 2;
  }

  getAttach(name: string) {
    const fileExtension = name.split('.').pop();

    if (fileExtension === 'pdf') {
      let url = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelSrc = false
      this.isOpen = true
      console.log(this.pdfSrc)
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      this.pdfSrc = false;
      this.excelSrc = "https://www.backpqr.etsg.com.co/files/" + name.replace("Resources/Attach/", "");
      this.isOpen = true
    } else {
      console.log(`Extensión desconocida: ${fileExtension}`);
    }

  }

  closeDoc(){
    this.isOpen = false
  }

  getPqr() {
    this._serviceP.getPqr(this.ID).subscribe({
      next: (data: PqrItem) => {
        this.pqr = data;
        if (data.response != null) {
          if (data.response.length > 0) {
            this.isDirector = true;
          }
        }

        if (data.attachsResponse != null && data.attachsResponse.length > 0) {
          this.withAttachResponse = true;
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
          if ((data.response != null && data.response.length > 0) 
          && (data.bodyPdf != null && data.bodyPdf.length > 0)) {
            this.formResponse.patchValue({
              response: data.response,
              body: data.bodyPdf
            })
            this.formResponse.get('response')?.disable()
            this.formResponse.get('body')?.disable()
          }
          

        } else if (data.typeAttachment == 'AUDIO') {
          this.isAudio = true;
          this._serviceP.GetAudio(data.id).subscribe({
            next: (response: Blob) => {


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


  openDialog() {

    const dialogRef = this.dialog.open(HistoryComponent, {
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

  submit() {
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

  sendFollow() {
    const data = new FormData();

    if (this.isEmail) {
      data.append("pqrId", this.ID);
      data.append("newStatus", "Follow");
      data.append("response", this.formResponse.get('response')!.value);
      data.append("comments", this.formResponse.get('comments')!.value);
    } else if (this.isAudio) {
      data.append("pqrId", this.ID);
      data.append("newStatus", "Follow");
      data.append("response", this.formAudio.get('response')!.value);
      data.append("comments", this.formAudio.get('comments')!.value);
    } else if (this.isFormat) {
      data.append("pqrId", this.ID);
      data.append("newStatus", "Follow");
      data.append("response", this.formFormat.get('response')!.value);
      data.append("comments", this.formFormat.get('comments')!.value);
    }




    this._serviceP.sendFollow(data).subscribe({
      next: (data: any) => {
        this._redirect.navigateByUrl("indexPqrs")
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


//constructor(private _serviceP: PqrsService, public dialogRef: MatDialogRef<HistoryComponent>
//  , @Inject(MAT_DIALOG_DATA) public data: any) { }
