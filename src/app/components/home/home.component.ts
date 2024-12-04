import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'date', 'actions'];
  displayedColumnsUser: string[] = ['id', 'document'];
  dataSource = new MatTableDataSource();
  dataSourceUser = new MatTableDataSource();
  formPQR!: FormGroup;
  formPQR2!: FormGroup;
  formPQR3!: FormGroup;
  means: any;
  typespqr: any;
  typesdoc: any;
  services: any[] = [];

  principals: any;
  secundaries: any;
  types: any;

  users: any;
  usersFiltered: any;
  empty = false;
  selectedRow: any;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginatorUser!: MatPaginator;
  @ViewChild(MatSort) sortUser!: MatSort;

  constructor(private _fb: FormBuilder, private _serviceP: PqrsService) {

    this.formPQR = _fb.group({
      id: [''],
      means: [''],
      pqrType: [''],
      dateReception: [''],
      documentType: [''],
      documentNumber: [''],
      userId: [{value:'',disabled : true}],
      state: [{ value: '', disabled: true }],
      criticity: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      phone1: [{ value: '', disabled: true }],
      phone2: [{ value: '', disabled: true }],
      whatsapp: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
    })

    this.formPQR2 = _fb.group({
      documentNumber: [{ value: '', disabled: true }],
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    })
    

    this.formPQR3 = _fb.group({
      
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSourceUser.paginator = this.paginatorUser;
    this.dataSourceUser.sort = this.sortUser;
    
  }

  ngOnInit() {
    
    this._serviceP.GetDocu().subscribe({
      next: (data: any) => {
        this.typesdoc = data
      }
    })

    this.getTypes();
    this.getUsers();
  }


  getPricipals() {
    this._serviceP.getPrincipals().subscribe({
      next: (data: any) => {
        this.principals = data
      }
    })
  }

  getSecundaries() {
    this._serviceP.getSecundaries().subscribe({
      next: (data: any) => {
        this.secundaries = data
      }
    })
  }

  getTypes() {
    this._serviceP.getTypes().subscribe({
      next: (data: any) => {
        this.types = data;
      }
    })
  }

  onCheckboxChange(event:MatCheckboxChange,serviceId:number) {
    if (event.checked) {
      this._serviceP.GetDetails(serviceId).subscribe({
        next: (data: any) => {
          console.log(data)
          this.services.push(data);
          this.services.forEach((ser, i) => {
            this.formPQR3.addControl(`id${i}`, this._fb.control({ value: '', disabled :true }, Validators.required));
            this.formPQR3.addControl(`motivo${i}`, this._fb.control('', Validators.required));
            this.formPQR3.addControl(`problema${i}`, this._fb.control('', Validators.required));
            
            this.formPQR3.get(`id${i}`)!.setValue(ser.id);
            this.getPricipals();
            this.getSecundaries();
          });
        }
      })
    } else {
      const index = this.services.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        this.services.splice(index, 1);
        this.formPQR3.removeControl(`id${index}`);
        this.formPQR3.removeControl(`motivo${index}`);
        this.formPQR3.removeControl(`problema${index}`);
      }
    }
  }

  onCheckboxChangeUser(cedula: string) {
    
    this.getInfoUser(cedula);
    this.formPQR.patchValue({
      documentNumber: cedula
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
          console.log(data);
          this.formPQR.patchValue({
            userId: data.id,
            criticity: data.categoriaPasajero.nombre,
            name: data.primerNombre + " " + data.primerApellido,
            phone1: data.telefonoCelular1,
            phone2: data.telefonoCelular2,
            whatsapp: data.whatsapp,
            observaciones: data.observaciones,
            state: data.estado.nombre
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

  getDetails(id: number) {
    this._serviceP.GetDetails(id).subscribe({
      next: (data: any) => {
        console.log(data)

        


        Swal.fire({
          icon: 'info',
          title: 'Informacion del Servico',
          html: `<div>
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Criticidad: </strong>${data.pasajero.categoriaPasajero.nombre}</h2>
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Cliente: </strong>${data.pasajero.cliente.nombreRazonSocial}</h2> 
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Usuario: </strong>${data.pasajero.primerNombre} ${data.pasajero.primerApellido}</h2> 
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Procedimiento: </strong>${data.tipoProcedimiento.nombre}</h2> 
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Origen: </strong>${data.origen.nombre}</h2> 
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Destino: </strong>${data.destino.nombre}</h2> 
                  <h2 style="font-size:15px;"><strong style="font-size:18px;">Estado: ${data.estadoServicio.nombre} (${data.estadoServicio.estado.nombre})</strong></h2>
                 </div>
                  `
        })
      }
    })
  }

  submit() {
    let data = new FormData();
    data.append("userId", this.formPQR.get("userId")!.value);
    data.append("means", this.formPQR.get("means")!.value);
    data.append("pqrType", this.formPQR.get("pqrType")!.value);
    data.append("dateReception", this.formPQR.get("dateReception")!.value);
    data.append("documentType", this.formPQR.get("documentType")!.value);
    data.append("documentNumber", this.formPQR.get("documentNumber")!.value);
    
   


    this._serviceP.createPqr(data).subscribe({
      next: (data: any) => {
        console.log(data)
        this.formPQR2.patchValue({
          documentNumber: data.documentNumber,
        })
        this.formPQR3.addControl(`pqrId`, this._fb.control(data.id, Validators.required));

        Swal.fire({
          icon: 'success',
          title: 'PQR Registrada',
          text: `El consecutivo de la PQR es: ${data.id}`
        })
      }
    })

  }


  submit2() {
    let data = new FormData();
    data.append("start", this.formPQR2.get("start")!.value);
    data.append("end", this.formPQR2.get("end")!.value);
    data.append("documentNumber", this.formPQR2.get("documentNumber")!.value);



    this._serviceP.PostPQR(data).subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data;
      }
    })

  }






  

  submitPQR() {
    let data = new FormData();
    data.append("pqrId", this.formPQR3.get(`pqrId`)!.value)
    this.services.forEach((ser, i) => {
      data.append(`id${i}`, this.formPQR3.get(`id${i}`)!.value);
      data.append(`motivo${i}`, this.formPQR3.get(`motivo${i}`)!.value);
      data.append(`problema${i}`, this.formPQR3.get(`problema${i}`)!.value);
    });

    data.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this._serviceP.FinishPqr(data).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message,
          text: `Consecutivo PQR: ${this.formPQR3.get(`pqrId`)!.value}`
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

  applyFilterUser(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.trim() == '') {
      this.empty = false;
      this.formPQR.patchValue({
        idUser: null,
        criticity: null,
        name: null,
        client: null,
      })
      this.selectedRow = null;
    } else {
      this.empty = true;
      this.dataSourceUser.data = this.users;
      this.dataSourceUser.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceUser.paginator) {
        this.dataSourceUser.paginator.firstPage();
      }
    } 
  }

  selectRow(row: any) {
    this.selectedRow = row;
  }



}
