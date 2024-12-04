import { AfterViewInit, Component, OnInit, Pipe, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrl: './add-services.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})




export class AddServicesComponent implements OnInit, AfterViewInit{
  readonly panelOpenState = signal(false);
  displayedColumns: string[] = ['id', 'date', 'actions'];
  formPQR2!: FormGroup;
  formPQR3!: FormGroup;
  dataSource = new MatTableDataSource();
  services: any[] = [];
  principals: any;
  secundaries: any;
  ID: any;

  motivos: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _fb: FormBuilder, private _serviceP: PqrsService, private _route: ActivatedRoute,
              private _redirect: Router, private sanitizer: DomSanitizer) {
    this.ID = _route.snapshot.paramMap.get("id");

    this.formPQR2 = _fb.group({
      documentNumber: [{ value: '', disabled: true }],
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    })


    this.formPQR3 = _fb.group({

    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log(this.ID);
      if (this.ID) {
        this.formPQR3.addControl(`pqrId`, this._fb.control(this.ID, Validators.required));
        this._serviceP.getPqr(this.ID).subscribe({
          next: (data: any) => {
            this.formPQR2.patchValue({
              documentNumber: data.documentNumber,
            })
          }
        })

        this.getServicesPqr();
      }
  }

  changeSec(checked: boolean, id:number,index:number) {
    if (checked) {
      this.motivos += id + ",";
      console.log(index)
      let data = this.formPQR3.get(`motivo${index}`)!.value + id + ","
      this.formPQR3.get(`motivo${index}`)!.setValue(data);




    } else {
      let data: string = this.formPQR3.get(`motivo${index}`)!.value
      let newData = data.replace(`${id},`, "")
      this.formPQR3.get(`motivo${index}`)!.setValue(newData);
      
    }
    console.log(this.formPQR3.get(`motivo${index}`)!.value)
  }

  getServicesPqr() {
    if (this.ID) {
      this._serviceP.getServicesPqr(this.ID).subscribe({
        next: (data: any) => {
          console.log(data)
          this.services = data
          this.services.forEach((ser, i) => {
            this.formPQR3.addControl(`id${i}`, this._fb.control({ value: '', disabled: true }, Validators.required));
            

            this.formPQR3.addControl(`motivo${i}`, this._fb.control('', Validators.required));
            this.formPQR3.get(`motivo${i}`)!.setValue(ser.secundaryId);
            this.formPQR3.get(`motivo${i}`)!.disable();


            this.formPQR3.addControl(`problema${i}`, this._fb.control('', Validators.required));
            this.formPQR3.get(`problema${i}`)!.setValue(ser.principalId);
            this.formPQR3.get(`problema${i}`)!.disable();



            this.formPQR3.get(`id${i}`)!.setValue(ser.id);

            //const secundaries: string[] = ser.secundaryId.split(",")
            //  .map((sec:any) => sec.trim())
            //  .filter((sec: any) => sec !== '');

            this.getPricipals();
            this.getSecundaries();

            //secundaries.forEach(x => {
            //  const checkbox = document.getElementById(x) as HTMLInputElement;
            //  return checkbox.checked;

            //})

          });
        }
      })
    }
  }

  replaceBr(sec: string): SafeHtml {
    let data = sec.replace(/\r?\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }



  onCheckboxChange(event: MatCheckboxChange, serviceId: number) {
    if (event.checked) {
      this._serviceP.GetDetails(serviceId).subscribe({
        next: (data: any) => {
          console.log(data)
          this.services.push(data);
          this.services.forEach((ser, i) => {
            if (this.formPQR3.contains(`id${i}`)) {
              return;
            }
            this.formPQR3.addControl(`id${i}`, this._fb.control({ value: '', disabled: true }, Validators.required));
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
        //this.formPQR3.removeControl(`motivo${index}`);
        this.formPQR3.removeControl(`problema${index}`);
      }
    }
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


  deleteRelation(id: number) {
    Swal.fire({
      icon: 'warning',
      title: '¿ Esta seguro de eliminar el servicio ?',
      text: '¡ Esta accion es irreversible !',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#a9a9a9'
    }).then(result => {
      if (result.isConfirmed) {
        this._serviceP.deleteRelation(id).subscribe({
          next: (data: any) => {
            this.services = this.services.filter(x => x.id != id)
            Swal.fire({
              icon: 'success',
              title: data.message
            })
          }
        })
      }
    })

    
  }

  splitDate(date: string): string {
    // Divide la fecha en fecha y hora
    const parts = date.split('T');

    // Obtén la parte de la fecha
    const datePart = parts[0].split('-');

    // Obtén la parte de la hora (si existe)
    let timePart = '';
    if (parts.length > 1) {
      timePart = ' ' + parts[1].split('.')[0]; // Elimina los milisegundos si los hay
    }

    // Formatea la fecha y hora en formato deseado (DD-MM-YYYY HH:mm:ss)
    let formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}${timePart}`;

    return formattedDate.replace("Z","");
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

    this.services.forEach((ser, i) => {
      data.append(`id${i}`, this.formPQR3.get(`id${i}`)!.value);
      data.append(`motivo${i}`, this.formPQR3.get(`motivo${i}`)!.value.toString().replace("  \r\n",","));
      data.append(`problema${i}`, this.formPQR3.get(`problema${i}`)!.value);
    });

    data.append("pqrId", this.formPQR3.get("pqrId")!.value)
    /*data.append("motivos", this.motivos)*/

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
        this._redirect.navigate(["/indexPqrs"])
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

}
