import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import MsgReader from 'msgreader';
import { Console } from 'console';
import { DatePipe } from '@angular/common';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-create-update-pqr',
  templateUrl: './create-update-pqr.component.html',
  styleUrl: './create-update-pqr.component.scss',
  providers: [DatePipe,
    provideNativeDateAdapter(),
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
  ]
})




export class CreateUpdatePqrComponent implements OnInit, AfterViewInit{
  ID: any;
  
  displayedColumnsUser: string[] = ['id', 'document'];

  dataSourceUser = new MatTableDataSource();
  formPQR!: FormGroup;
  formRegional!: FormGroup;
  
  means: any;
  typespqr: any;
  typesdoc: any;
  regionals: any;


  types: any;

  users: any;
  usersFiltered: any;
  empty = false;
  selectedRow: any;

  stepTwo = false;
  stepThree = false;

  file!: File | undefined;
  Files: File[] = [];
  namesFiles: string[] = [];
  isFile = false;

  containFile: boolean = false;
  fileUrl: string | null = null;
  fileName: string = '';

  
  filteredRegionals!: Observable<{ name: string }[]>;

  usersControl = new FormControl();
  finalUsers!: Observable<any>;

  isMinerOp:boolean = false;
  isMinerTs:boolean = false;
  isMinerFac:boolean = false;

  documentNumber:any;
  clientName:any;


  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('table') tableElement!: ElementRef;

  @ViewChild('fileInput') fileInput!: ElementRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginatorUser!: MatPaginator;
  @ViewChild(MatSort) sortUser!: MatSort;

  @ViewChild('autoUser') matAutocomplete!: MatAutocomplete;

  constructor(private _fb: FormBuilder, private _serviceP: PqrsService, private _redirect: Router,
              private _route: ActivatedRoute, private ngZone: NgZone,
             private datePipe: DatePipe,private cdr: ChangeDetectorRef) {

    this.ID = _route.snapshot.paramMap.get("id");
    
    this.formPQR = _fb.group({
      id: [''],
      means: ['', Validators.required],
      regional: [''],
      pqrType: ['', Validators.required],
      dateReception: ['', Validators.required],
      hour: ['', Validators.required],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [''],
      userId: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      criticity: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      phone1: [{ value: '', disabled: true }],
      phone2: [{ value: '', disabled: true }],
      whatsapp: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      isAudio: [{value: false, disabled: true}],
      isEmail: [true],
      isMinerOp: [false],
      isMinerTs: [false],
      isMinerFac: [false],
      isFormat:[{value: false, disabled: true}],
      observationOp: [''],
      observationTs: [''],
      observationFac: [''],
      interval: [''],

    })

    this.formRegional = _fb.group({
      regionalControl : new FormControl('', Validators.required)
    })
    
    
    
  }


  ngAfterViewInit() {
    
    this.dataSourceUser.paginator = this.paginatorUser;
    this.dataSourceUser.sort = this.sortUser;
    // if (this.fileInput && this.fileInput.nativeElement) {
    //   this.fileInput.nativeElement.disabled = false;
    // }

  }

  ngOnInit() {

    this.getRegionals();
    this.getUsers();
    setTimeout(() => {
      // this.filteredRegionals = this.regionalControl.valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filter(value!))
      // );

      this.filteredRegionals = this.formRegional.get("regionalControl")!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value!))
      );
    }, 1000)


    this.finalUsers = this.usersControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value))
    );
    
    setTimeout(() => {
      

    }, )


    this._serviceP.GetDocu().subscribe({
      next: (data: any) => {
        this.typesdoc = data
      }
    })

    this.getTypes();
    this.getDataUpdate();
    this.getMeans();
    
  }

  getDataUpdate() {
    if (this.ID) {
      this._serviceP.getPqr(this.ID).subscribe({
        next: (data: any) => {
          
          let dateStr = data.dateReception;  // La fecha que obtuviste de tu servidor
          let date = new Date(dateStr);
          let localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

          this.formPQR.patchValue({
            means: data.meanRadicationId,
            pqrType: data.pqrTypeId,
            dateReception: localDate,
            hour: data.hour.slice(0, 5),
            documentType: data.documentType,
            /*documentNumber: data.documentNumber,*/
          })

          switch (data.typeAttachment) {
            case "CORREO":
              this.formPQR.patchValue({
                isEmail: true
              })
              break;
            case "AUDIO":
              this.formPQR.patchValue({
                isAudio: true
              })
              break;
            case "EXCEL":
              this.formPQR.patchValue({
                isFormat: true
              })
              break;
            default:
              break;
          }
            

          this.formPQR.patchValue({
            regionalControl: data.regional
          })
          // this.regionalControl.setValue(data.regional);
          this.usersControl.setValue(data.documentNumber)
          this.onCheckboxChangeUser(data.documentNumber);

          

          let pathData = new FormData();
          pathData.append("path", data.filePath)
          this._serviceP.getFile(pathData).subscribe({
            next: (file: any) => {
              
              const binaryData = file.data.fileContents;
              const blob = new Blob([binaryData], { type: file.data.contentType });

              this.fileUrl = window.URL.createObjectURL(blob);
              this.containFile = true;
              this.fileName = file.name;
              
            },
            error: (err) => {
              console.error('Error downloading file', err);
            }
          })

          /*this.applyFilterAfterDelay();*/
        }
      })
    }
  }

  getRegionals() {
    this._serviceP.getRegionals().subscribe({
      next: (data: any) => {
        this.regionals = data
        this.cdr.detectChanges();
      }
    })

  }

  


  private getFileNameFromResponse(file: Blob): string {
    const contentDisposition = file.type;
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return 'download';
  }

  downloadFile() {
    if (this.fileUrl) {
      saveAs(this.fileUrl, this.fileName);
    }
  }

  applyFilterAfterDelay() {
    this.empty = true;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          const event = new KeyboardEvent('keyup', {
            bubbles: true
          });
          this.inputElement.nativeElement.dispatchEvent(event);
          /*setTimeout(() => this.clickFirstRow(), 0);*/
        });
      }, 2000);
    });
  }



  clickFirstRow() {
    const tableRows = this.tableElement.nativeElement.querySelectorAll('mat-row');
    if (tableRows.length > 0) {
      const firstRowCells = tableRows[0].querySelectorAll('mat-cell');
      if (firstRowCells.length > 0) {
        
        firstRowCells[0].click();
      }
    }
  }

  onCheckboxChange(event: MatCheckboxChange,type:string) {
    if (event.checked) {
      if (type == "audio") {
        this.formPQR.get('isFormat')?.disable()
        this.formPQR.get('isEmail')?.disable()
      } else if (type == "email") {
        this.formPQR.get('isFormat')?.disable()
        this.formPQR.get('isAudio')?.disable()
      } else if (type == "format") {
        this.formPQR.get('isEmail')?.disable()
        this.formPQR.get('isAudio')?.disable()
      }
      this.fileInput.nativeElement.disabled = false;
      
    } else {
      this.formPQR.get('isEmail')?.enable()
      this.formPQR.get('isAudio')?.enable()
      this.formPQR.get('isFormat')?.enable()
      this.fileInput.nativeElement.disabled = true;

    }

    
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
        this.formPQR.patchValue({
          observationOp: '',
        })
      } else if( type == "minerFac" ){
        this.isMinerFac = false;    
        this.formPQR.patchValue({
          observationFac: '',         
        })
      } else if( type == "minerTs" ){
        this.isMinerTs = false;    
        this.formPQR.patchValue({
          observationTs: '',        
        })
      }
    }
  }


  getFile(event: any) {

    const file = event.target.files[0];
    if (!file) return;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'msg') {
      Swal.fire({
        icon: 'warning',
        title: 'Extensión no permitida',
        text: 'Solo se permiten archivos con extensión .msg',
        confirmButtonColor : '#14642c'
      });
      return; // Detiene la ejecución si la extensión no es válida
    }
    if(this.Files.length >= 1){
      // Swal.fire({
      //   icon:'warning',
      //   title: 'Ha excedido el maximo de archivos'
      // })
    }else{
      this.Files.push(event.target.files[0]);
      this.namesFiles.push(event.target.files[0].name);
      this.fileInput.nativeElement.disabled = true;
      this.isFile = true
      // Procesar el archivo .msg para extraer la fecha y la hora
      this.readMsgFile(file);
    }
    
  }

  readMsgFile(file: File) {
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      // Procesamos el archivo .msg con MsgReader
      const msg = new MsgReader(e.target.result);
      const emailData = msg.getFileData(); // Obtiene los datos del archivo .msg
  
      if (emailData && emailData.headers) {
        // Imprimir el contenido completo de las cabeceras
        console.log("Cabeceras del correo:", emailData.headers);
        
        // Obtener las cabeceras del correo y dividirlas por línea
        const headers = emailData.headers.split('\n');
  
        // Imprimir las cabeceras para ver qué tenemos
        console.log("Cabeceras separadas:", headers);
  
        // Buscar la cabecera que contiene '(-05)' para obtener la fecha
        const receivedHeader = headers.find((header: string) => header.includes('0500'));
        console.log("Cabecera '(-05)' encontrada:", receivedHeader);
  
        if (receivedHeader) {
          // Extraemos la fecha de la cabecera que contiene '(-05)'
          let dateStr = "";
          if(receivedHeader.includes(">;")){
            dateStr = receivedHeader.split(">;");
          }else{
            dateStr = receivedHeader;
          }
  
          if (dateStr) {
            console.log("Fecha extraída:", dateStr);
  
            // Crear un objeto Date a partir de la fecha extraída
            const emailDate = new Date(dateStr);
  
            // Restar 5 horas a la fecha para ajustar la zona horaria
            emailDate.setHours(emailDate.getHours() - 5);

            // Extraer la fecha y la hora ajustadas
            const timeReceived = emailDate.toISOString().split('T')[1].split('.')[0].substring(0, 5); // Hora (HH:mm)
          
            const dateReceived = emailDate.toISOString().split('T')[0]; // Fecha (YYYY-MM-DD)
  
            // Establecer los valores en los inputs
            this.setDateTimeInputs(dateReceived, timeReceived);
          } else {
            console.error('No se pudo extraer la fecha de la cabecera que contiene (-05)');
          }
        } else {
          console.error('No se encontró una cabecera que contenga (-05)');
        }
      }
    };
  
    reader.readAsArrayBuffer(file); // Lee el archivo como un ArrayBuffer
  }
  
  // Método para extraer la fecha de la cabecera que contiene '(-05)'
  extractDateFromReceivedHeader(receivedHeader: string): string | null {
    // Buscar la fecha que termina con '(-05)\r' (zona horaria y retorno de carro)
    const dateMatch = receivedHeader.match(/(\w{3},\s?\d{1,2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\s[\+\-]\d{4}\s\([A-Za-z]{3}\))\r/);
  
    if (dateMatch && dateMatch[0]) {
      return dateMatch[0]; // Devuelve la fecha en formato 'Fri, 23 Aug 2024 10:29:52 -0500 (-05)'
    }
  
    return null;
  }

  
  

  setDateTimeInputs(date: string, time: string) {
    // Asigna la fecha y hora a los inputs de fecha y hora
    console.log(date)
    console.log(time)
    const dateNew = new Date(date);
    // Format the date using Angular's DatePipe
    const newFormat = this.datePipe.transform(new Date(dateNew.setDate(dateNew.getDate() + 2)), 'yyyy-MM-dd');
    let localDate = new Date(dateNew.getUTCFullYear(), dateNew.getUTCMonth(), dateNew.getUTCDate() - 2);
    
    console.log(localDate)
    this.formPQR.controls['dateReception'].setValue(localDate);
    this.formPQR.controls['hour'].setValue(time);
  }

  deleteFile(file: string) {
    this.isFile = false;
    this.fileInput.nativeElement.disabled = false;
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

  onResetForm(){
    this.formPQR.reset();
    this.Files = [];
    this.namesFiles = [];
    this.isFile = false;
  }

  getTypes() {
    this._serviceP.getTypes().subscribe({
      next: (data: any) => {
        this.types = data;
      }
    })
  }

  getMeans() {
    this._serviceP.getMeans().subscribe({
      next: (data: any) => {
        this.means = data;
      }
    })
  }
  

  onCheckboxChangeUser(cedula: string) {
    this.documentNumber = cedula;
    this.getInfoUser(cedula);
    this.formPQR.patchValue({
      documentNumber: cedula
    })
    this._serviceP.GetClient(this.documentNumber).subscribe({
      next: (dataClient:any)=>{
        this.clientName = dataClient.result
    
      }
    })
    /*this.getInfoUser("0");*/

  }

  getInfoUser(cedula: string) {
    let data = new FormData();
    if (cedula == "0") {
      this.formPQR.patchValue({
        idUser: null,
        criticity: null,
        name: null,
        client: null,
      })
    } else {
      data.append("documentNumber", cedula)

      this._serviceP.GetInfoUser(data).subscribe({
        next: (data: any) => {
          console.log(data)
          this.formPQR.patchValue({
            userId: data.id,
            criticity: data.categoriaPasajero.nombre,
            name: data.primerNombre + " " + data.primerApellido,
            phone1: data.telefonoCelular1,
            phone2: data.telefonoCelular2,
            whatsapp: data.whatsapp,
            observaciones: data.observaciones,
            state: data.estado.nombre,
            documentType: data.tipoDocumento.nombre
          })
        }
      })
    }
  }

  getUsers() {
    this._serviceP.GetUsers().subscribe({
      next: (data: any) => {
        
        this.users = data;
      }
    })
  }

  

  submit() {

    if (this.formPQR.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Porfavor Complete los campos obligatorios'
      })
      return; // Detener la función submit si el formulario es inválido
    }

    if (this.formRegional.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Porfavor Complete los campos obligatorios'
      })
      
      return; // Detener la función submit si el formulario es inválido
    }
    console.log(this.formPQR.get("dateReception")!.value);
    let data = new FormData();
    
    data.append("userId", this.formPQR.get("userId")!.value);
    data.append("means", this.formPQR.get("means")!.value);
    data.append("pqrType", this.formPQR.get("pqrType")!.value);
    data.append("dateReception", this.formPQR.get("dateReception")!.value);
    data.append("hour", this.formPQR.get("hour")!.value);
    data.append("documentType", this.formPQR.get("documentType")!.value);
    data.append("documentNumber", this.formPQR.get("documentNumber")!.value);
    data.append("userName", this.formPQR.get("name")!.value);
    data.append("regional", this.formRegional.get("regionalControl")!.value);

    data.append("isAudio", this.formPQR.get("isAudio")!.value);
    data.append("isFormat", this.formPQR.get("isFormat")!.value);
    data.append("isEmail", this.formPQR.get("isEmail")!.value);
    data.append("isMinerOp", this.formPQR.get("isMinerOp")!.value);
    data.append("isMinerTs", this.formPQR.get("isMinerTs")!.value);
    data.append("isMinerFac", this.formPQR.get("isMinerFac")!.value);

    data.append("ObservationToMinerOp", this.formPQR.get("observationOp")!.value);
    data.append("ObservationToMinerTs", this.formPQR.get("observationTs")!.value);
    data.append("ObservationToMinerFac", this.formPQR.get("observationFac")!.value);

    data.append("interval", this.formPQR.get("interval")!.value);
    data.append("client",this.clientName);


    this.Files.forEach((file, index) => {
      data.append(`File${index + 1}`, file);
    });

    
    

    if (this.ID) {
      this._serviceP.updatePqr(data,this.ID).subscribe({
        next: (data: any) => {
          this._redirect.navigate([`/addServices/${data.id}`])
          Swal.fire({
            icon: 'success',
            title: 'PQR Actualizada',
            text: `El consecutivo de la PQR es: ${data.id}`
          })
        }
      })
    } else {
      this._serviceP.createPqr(data).subscribe({
        next: (data: any) => {
          this._redirect.navigate([`/addServices/${data.id}`])
          Swal.fire({
            icon: 'success',
            title: 'PQR Registrada',
            text: `El consecutivo de la PQR es: ${data.id}`
          })
        }
      })
    }

  }



  applyFilterUser(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    
    if (filterValue.trim() == '' ) {
      this.empty = false;
      this.formPQR.patchValue({
        idUser: null,
        criticity: null,
        name: null,
        client: null,
      })
      this.selectedRow = null;
    } else if (filterValue.length >= 5 ) {
      this.empty = true;
      
      this.dataSourceUser.data = this.users;
      this.dataSourceUser.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceUser.paginator) {
        this.dataSourceUser.paginator.firstPage();
      }
    }
  }

  private _filter(value: string): { name: string }[] {
    const filterValue = value.toLowerCase();
    return this.regionals.filter((reg:any) => reg.name.toLowerCase().includes(filterValue));
  }

  private _filterUsers(value: string): { data: string }[] {
    if (value.length < 5) {
      // Si la longitud es menor a 5, no se realiza el filtrado
      return [];
    }
    const filterValueUser = value.toLowerCase();
    return this.users.filter((usr: any) => usr.numeroDocumento.toLowerCase().includes(filterValueUser));
  }


  selectRow(row: any) {
    this.selectedRow = row;
  }
}
