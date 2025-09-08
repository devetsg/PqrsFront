import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
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
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { FlowPqrs, PqrsTypes } from '../../interfaces/FlowPqrs';
import { ShowMinerComponent } from '../show-miner/show-miner.component';
import { HistoryResponseComponent } from '../history-response/history-response.component';
import { isPlatformBrowser } from '@angular/common';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-response-pqr',
  templateUrl: './response-pqr.component.html',
  styleUrl: './response-pqr.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
@Injectable()
export class ResponsePqrComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput') fileInput2!: ElementRef;
  public Editor: any = null;
  public editorConfig = {
     licenseKey: 'GPL',
    height: 400
  };
  quillConfig: any = {};

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
  editorContent: string = ''; // Propiedad para almacenar el contenido del editor
  isDirector: boolean = false;

  displayedColumns: string[] = [];  // Nombres de las columnas a mostrar
  columns: string[] = [];
  filteredAttachments: string[] = [];
  minedAttachments: string[] = [];
  dataExcel: any;

  histories: any;
  bodyPdfUrl!:SafeResourceUrl | null;
  documentNumber:any;

  pdfSrc!: SafeResourceUrl;
  excelSrc:string|boolean = "";

  urlFile: any;

  pqrHeaders!: PqrItem;
  isPlaying = false;

  history: any;
  pqr:any;
  clientName:any;
  namesFiles: string[] = [];
  Files: File[] = [];
  isFile = false;

  namesFiles2: string[] = [];
  Files2: File[] = [];
  isFile2 = false;
  withMining = false;
  withAttachResponse2 = false;

  withAttachResponse = false;
  isBrowser: boolean;
  isOpen:boolean = false;
  role = "";
  flow?:string;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  _flow:FlowPqrs = new FlowPqrs();
  _types:PqrsTypes = new PqrsTypes();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;
  drawerOpen = false;
  iconClass = 'sideMenu bi bi-caret-right-fill';
  quillEditor: any = null;
  bodyControl: FormControl;
  private inactivityTimer: any;
  // private readonly INACTIVITY_TIMEOUT = 10 * 1000 ;
  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000;

  tinyMceConfig = {
    height: 500,
    menubar: false,
    base_url:'/tinymce',
    suffix: '.min',
    plugins: 'lists advlist link ',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignjustify  alignright | numlist bullist outdent indent ',
    content_style: 'body, p, ol, ul, li, table, th, td { font-family: "Century Gothic", sans-serif; font-size: 14px; }',
    readonly: false,
   
  };

  constructor(private _serviceP: PqrsService, private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute, public dialog: MatDialog, private sanitizer: DomSanitizer, private iconService: IconService,
    private _role:RoleService,private cdr: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object) {
    this.ID = _route.snapshot.paramMap.get('id');
    setTimeout(()=>{
      this.getHistory();
      this.getChat();
    })
    

    
    this.bodyControl = new FormControl('', Validators.required); 
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.formResponse = _fb.group({
      pqrText: [{ value: '', disabled: true }],
      pqrSubject: [{ value: '', disabled: true }],
      response: ['', Validators.required],
      body:this.bodyControl,
      comments: [''],
    })
    if (isPlatformBrowser(this.platformId)) {
      import('@ckeditor/ckeditor5-build-classic').then((module) => {
        this.Editor = module.default;
      });
    }
   


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
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  subscribeChangeRoute(){
    const navSub = this._redirect.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Restaurar estados justo antes de navegar a otro componente
      this._serviceP.changeStatusEdit(this.ID, 0).subscribe();
      this._serviceP.changeStatusView(this.ID, 0).subscribe();
    }
  });

  this.subscriptions.push(navSub);
  }

  handleTextChange(delta:any, oldDelta:any, source:any) {
    const quill = this.bodyControl.value;

    const list = quill.getList();  // Obtén la lista de la zona de texto actual
    if (list && list.length > 0) {
      let currentNumber = 0;

      // Encuentra el número más alto de la lista y ajusta el siguiente elemento
      list.forEach((item:any) => {
        let itemNumber = item.dataset.number || 0;
        if (itemNumber > currentNumber) {
          currentNumber = itemNumber;
        }
      });

      // Ajusta el siguiente número dinámicamente
      quill.setSelection(currentNumber + 1);
    }
  }

  ngOnInit(): void {    
    this.onButtonClick();
    this.role = this._role.getRole();
    this.getSignatureValid();

    
    if (this.islocalAvailable) {

      if (this.ID) {
        this.getPqr();
        this.getChat();
      }
    }
    const routeSub = this._route.params.subscribe(params => {      
      if (this.ID) {
        // Actualizar estados a true al entrar al componente
        this._serviceP.changeStatusEdit(this.ID,1).subscribe();
        this._serviceP.changeStatusView(this.ID,1).subscribe();
      }
    });
   
    this.subscriptions.push(routeSub);
    this.subscribeChangeRoute();

    // Iniciar el temporizador de inactividad
    this.resetInactivityTimer();
    
    // Configurar eventos para detectar actividad del usuario
    this.setupActivityListeners();
  }

  redirect(){
    if(this.role == "DIRGENERAL"){
      this._redirect.navigate(["indexDir"])
      }
      else if(this.role == "COORDINADOR"){
        this._redirect.navigate(["indexCoord"])
      }
      else if(this.role == "MINERO"){
        this._redirect.navigate(["indexMiner"])
      }
      else if(this.role == "DIRGESTION"){
        this._redirect.navigate(["indexDirGestion"])
      }
      else if(this.role == "DIRCONTRALOR"){
        this._redirect.navigate(["indexContralor"])
      }
      else{
        this._redirect.navigate(["indexPqrs"])
      }
  }
  
  

  

   // Configurar los eventos para detectar actividad del usuario
  private setupActivityListeners(): void {
    ['mousedown', 'keypress', 'mousemove', 'click', 'scroll', 'touchstart'].forEach(eventName => {
      window.addEventListener(eventName, this.handleUserActivity);
    });
  }

  // Remover los eventos de actividad
  private removeActivityListeners(): void {
    ['mousedown', 'keypress', 'mousemove', 'click', 'scroll', 'touchstart'].forEach(eventName => {
      window.removeEventListener(eventName, this.handleUserActivity);
    });
  }

  // Función para manejar la actividad del usuario
  private handleUserActivity = (): void => {
    this.resetInactivityTimer();
  }

  // Resetear el temporizador de inactividad
  private resetInactivityTimer(): void {
    // Limpiar el temporizador existente si hay uno
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    
    // Crear un nuevo temporizador
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.INACTIVITY_TIMEOUT);
  }

  // Manejar la inactividad
  private handleInactivity(): void {
    console.log(`Inactividad detectada durante ${this.INACTIVITY_TIMEOUT/60000} minutos, cerrando sesión...`);
    
    // Restaurar estados
    this._serviceP.changeStatusEdit(this.ID,0).subscribe({
      next: () => console.log('Estado de edición restaurado por inactividad'),
      error: (err) => console.error('Error al restaurar estado de edición', err)
    });
    
    this._serviceP.changeStatusView(this.ID,0).subscribe({
      next: () => console.log('Estado de vista restaurado por inactividad'),
      error: (err) => console.error('Error al restaurar estado de vista', err)
    });
    
    
    Swal.fire({
      icon:'info',
      title:'Pqr cerrada por inactividad'
    })
    // Redirigir
    this.redirect();
  }

  // Capturar cuando el usuario navega a otra ruta dentro de la aplicación
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event): void {
    // Restaurar estados
    this._serviceP.changeStatusEdit(this.ID,0).subscribe();
    this._serviceP.changeStatusView(this.ID,0).subscribe();
    this.redirect();
  }
 
   ngOnDestroy() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    
    // Limpiar el temporizador de inactividad
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    
    // Eliminar los listeners de actividad
    this.removeActivityListeners();
    
    // Desuscribirse de todas las subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
   

  saveContent() {
    // Obtener el contenido en HTML del editor (quill)
    const editorContent = this.bodyControl.value;

    // Imprimir el contenido HTML en consola
    console.log('Contenido HTML:', editorContent); // Este es el contenido del editor
  }

  onButtonClick() {
   
    this.toggleIcon();
  }

  toggleIcon() {
    this.drawerOpen = !this.drawerOpen; // Alterna el estado del drawer
    this.iconClass = this.drawerOpen ? 'sideMenu bi bi-caret-left-fill' : 'sideMenu bi bi-caret-right-fill';
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

  updateFormControl(content: string) {
    this.formResponse.controls['body'].setValue(content);
  }

  getFirstLetter(text: string): string {
    const match = text.match(/[a-zA-Z]/);
    return match ? match[0] : '';
  }

  showPdf(){
    // let url = `https://localhost:44369/files/${this.documentNumber}.pdf`;
    let url = `https://www.pqr.etsg.com.co/files/${this.documentNumber}.pdf`;
    
    this.bodyPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // this.bodyPdfUrl = `https://backpqr.etsg.com.co/files/${this.documentNumber}.pdf`;
  }

  closePdf(){
    this.bodyPdfUrl = null;
  }

  getPqr() {
    this._serviceP.getPqr(this.ID).subscribe({
      next: (data: PqrItem) => {
        this.pqr = data;
        if(data.isEditing){
          this.redirect();
        }
        console.log(this.pqr)
        if((this.pqr.observationFromMinerFac != null && this.pqr.observationFromMinerFac.lenght > 0 )
          || (this.pqr.observationFromMinerOp != null && this.pqr.observationFromMinerOp!.length > 0 )
          || (this.pqr.observationFromMinerTs != null && this.pqr.observationFromMinerTs!.length > 0 )
        ){
          this.withMining = true;
        }

        this.flow = data.pqrType.flow
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
            body: data.bodyPdf
          })
          this.pqrHeaders = data;
          if (this.pqrHeaders?.attachmentUrls) {
            this.filteredAttachments = this.pqrHeaders.attachmentUrls.split(',').filter(n => n);
          }
          if (this.pqrHeaders?.minerUrls) {
            this.minedAttachments = this.pqrHeaders.minerUrls.split(',').filter(n => n);
          }
          if (this.role != "ANALISTA" && this.role != "COORDINADOR") {
            this.formResponse.patchValue({
              response: data.response,
              body: data.bodyPdf
            })
            this.formResponse.get('response')?.disable()
          }

          if(this.role != "ANALISTA"){
            this.documentNumber = data.documentNumber;
            
            
          }

          this.formResponse.patchValue({
            response: data.response,
            body: data.bodyPdf
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

  openDialogHistory(){
      const dialogRef = this.dialog.open(HistoryResponseComponent, {
        width: '90%',
        height: 'auto' ,
        data: {
          id: this.pqr.id,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        
      });
    }


  openDialogMiner(id: number,area:string) {
      console.log(id)
      const dialogRef = this.dialog.open(ShowMinerComponent, {
        width: '85%',
        height: 'auto',
        data: {
          id: id,
          area: area
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

  getHistory() {
    this._serviceP.GetHistory(this.ID).subscribe({
      next: (data: any) => {
        console.log(data)
        this.history = data
        this.cdr.detectChanges();
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
        id: this.ID,
        response:this.formResponse.get('response')!.value,
        body:this.formResponse.get('body')!.value
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
        this.cdr.detectChanges();
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
      this.isLoading = true;
      const data = new FormData();

      if (this.isEmail) {
        data.append("pqrId", this.ID);
        data.append("response", this.formResponse.get('response')!.value);
        data.append("body", this.bodyControl.value);
        data.append("comments", this.formResponse.get('comments')!.value);
      } else if (this.isAudio) {
        data.append("pqrId", this.ID);
        data.append("response", this.formAudio.get('response')!.value);
        data.append("body", this.bodyControl.value);
        data.append("comments", this.formAudio.get('comments')!.value);
      } else if (this.isFormat) {
        data.append("pqrId", this.ID);
        data.append("response", this.formFormat.get('response')!.value);
        data.append("body", this.bodyControl.value);
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
          this.isLoading = false;
          this._serviceP.changeStatusEdit(this.ID,0).subscribe();
          this._serviceP.changeStatusView(this.ID,0).subscribe();
        }
      })
    }
  }

  getSignatureValid(){
    // this._serviceP.getSignature().subscribe({
    //   next: (data: any) => {
    //     if (data.message == "FALSE" && this.role == "ANALISTA") {
    //       Swal.fire({
    //         icon: 'info',
    //         title: 'Firma Necesaria',
    //         text: 'Su usuario no cuenta con una firma asignada, por favor comunicarse con el coordinador para subir su firma digital',
    //         showConfirmButton: false,
    //         showCancelButton: false,
    //         allowOutsideClick: false,
    //         showCloseButton: true,
    //         confirmButtonColor: '#ff0000',
    //         // cancelButtonColor: '#a9a9a9'
    //       })
    //     }
    //   }
    // })
  }

  sendFollow(status:string) {
    const data = new FormData();
    let document = this.pqr.documentNumber;
    this._serviceP.GetClient(document).subscribe({
      next: (data:any) => {
        this.clientName = data;
      }
    })
    switch(this.flow){
      case this._flow.DirectivoContralor:
        if(this.role == "COORDINADOR"){
          status = this._types.DirGestion;
        }

        break;
    }
    
    this.isLoading = true;

    if (this.isEmail) {
      

      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formResponse.get('response')!.value);
      data.append("body",this.bodyControl.value );
      data.append("comments", this.formResponse.get('comments')!.value);
      data.append("client",this.clientName);
    } else if (this.isAudio) {
      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formAudio.get('response')!.value);
      data.append("body", this.bodyControl.value);
      data.append("comments", this.formAudio.get('comments')!.value);
      data.append("client",this.clientName);
    } else if (this.isFormat) {
      data.append("pqrId", this.ID);
      data.append("newStatus", status);
      data.append("response", this.formFormat.get('response')!.value);
      data.append("body", this.bodyControl.value);
      data.append("comments", this.formFormat.get('comments')!.value);
      data.append("client",this.clientName);
    }




    this._serviceP.sendFollow(data).subscribe({
      next: (data: any) => {
        this.isLoading = false;

        if(this.role == "DIRGENERAL"){
          this._redirect.navigate(["indexDir"])
          }
          else if(this.role == "COORDINADOR"){
            this._redirect.navigate(["indexCoord"])
          }
          else if(this.role == "MINERO"){
            this._redirect.navigate(["indexMiner"])
          }
          else if(this.role == "DIRGESTION"){
            this._redirect.navigate(["indexDirGestion"])
          }
          else if(this.role == "DIRCONTRALOR"){
            this._redirect.navigate(["indexContralor"])
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

    this._serviceP.changeStatusEdit(this.ID,0).subscribe();
    this._serviceP.changeStatusView(this.ID,0).subscribe();
  }

  
  formatStatus(status:string):string{
    switch(status){
      case "CREATED":
        return "Creada"
      case "PENDING":
        return "En Aprobacion"
      case "COORD":
        return "En Revision"
      case "MINING":
        return "En Trazabilidad"
      case "DIRGESTION":
        return "En RRHH"
      case "DIRCONTRALOR":
        return "En Control"
      case "SEND":
        return "Enviada"
      default:
        return "Sin Estado"
    }
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
