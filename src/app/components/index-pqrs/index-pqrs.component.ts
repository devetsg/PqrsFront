import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShowMinerComponent } from '../show-miner/show-miner.component';
import { SelectMinnerComponent } from '../select-minner/select-minner.component';

@Component({
  selector: 'app-index-pqrs',
  templateUrl: './index-pqrs.component.html',
  styleUrl: './index-pqrs.component.scss',
  providers: [DatePipe,
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexPqrsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','statusMiner','opts'];
  dataSource = new MatTableDataSource();
  regionalControl = new FormControl();
  filteredRegionals!: Observable<{ name: string }[]>;
  types: any;
  regionals: any;
  formFilter!: FormGroup;
  signatureValid: string = "";
  allPqrs:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(private _serviceP: PqrsService, private datePipe: DatePipe, private _fb: FormBuilder, public dialog: MatDialog, private _redirect: Router) {
    this.formFilter = _fb.group({
      pqrType: ['']
    })

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit():void{
    this.getPqrs();
    this.getRegionals();
    this.getTypes();
    this.getSignatureValid();
    
    setTimeout(() => {
      this.filteredRegionals = this.regionalControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }, 1000)


    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    ///////////////////////  FILTER BY TYPE PQR  ////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    this.formFilter.get('pqrType')!.valueChanges.subscribe((value: any) => {
      const regional = this.regionalControl.value;
      if (value == "0" && (regional != null && regional != "Ninguna")) {
        console.log("from 1")
        this._serviceP.getFullPqrs().subscribe({
          next: (data: any) => {
            const filteredData = data.filter((item: any) => item.regional.includes(regional));
            this.dataSource.data = filteredData;
          }
        })
      } else if (value == "0") {
        console.log("from 2")

        this._serviceP.getFullPqrs().subscribe({
          next: (data: any) => {
            this.dataSource.data = data;
          }
        })
      } else if (value != "0" && (regional != null && regional != "Ninguna")) {
        console.log("from 3")

        this._serviceP.getFullPqrs().subscribe({
          next: (data: any) => {
            const filteredData = data.filter((item: any) => item.type.includes(value) && item.regional.includes(regional));
            this.dataSource.data = filteredData;
          }
        })
      }
      else {
        this._serviceP.getFullPqrs().subscribe({
          next: (data: any) => {
            const filteredData = data.filter((item: any) => item.type.includes(value));
            this.dataSource.data = filteredData;
          }
        })
      }
    })
  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ///////////////////////  FILTER BY REGIONAL  ////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  filterByRegional(event: any) {
    const type = this.formFilter.get('pqrType')?.value;
    console.log(type)
    if (event.option.value == "Ninguna" && (type != null && type != "0")) {
      this._serviceP.getFullPqrs().subscribe({
        next: (data: any) => {
          const filteredData = data.filter((item: any) => item.type.includes(type));
          this.dataSource.data = filteredData;
        }
      })
    } else if (event.option.value == "Ninguna") {
      this._serviceP.getFullPqrs().subscribe({
        next: (data: any) => {
          this.dataSource.data = data;
        }
      })
    } else if (event.option.value != "Ninguna" && (type != null && type != "0")) {
      this._serviceP.getFullPqrs().subscribe({
        next: (data: any) => {
          const filteredData = data.filter((item: any) => item.type.includes(type) && item.regional.includes(event.option.value));
          this.dataSource.data = filteredData;
        }
      })
    }
    else {
      this._serviceP.getFullPqrs().subscribe({
        next: (data: any) => {
          const filteredData = data.filter((item: any) => item.regional.includes(event.option.value));
          this.dataSource.data = filteredData;
        }
      })
    }

  }

  getRegionals() {
    this._serviceP.getRegionals().subscribe({
      next: (data: any) => {
        this.regionals = data
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

  getPqrs(minin?:boolean) {
    this._serviceP.getFullPqrs().subscribe({
      next: (data: any) => {
        console.log(data)
        this.allPqrs = data
        if(minin != null){
          this.dataSource.data = data.filter((x:any)=> x.status == "MINING");
        }else{
          this.dataSource.data = data.filter((x:any)=> x.status == "CREATED");
        }
      }
    })
  }

  exitMinerPqr(id:number){
    this._serviceP.exitMiner(id).subscribe(
      {
        next:(data:any)=>{
          Swal.fire({
            icon:'success',
            title: data.message,
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:true
          })
          setTimeout(()=>{
            this.getPqrs(true);

          },)
         
        }
      }
    )
  }

  minerPqr(id:number){
    // Swal.fire({
    //   icon:'info',
    //   title: '¿A que area hará la solicitud?',
    //   showConfirmButton:true,
    //   showCancelButton:true,
    //   confirmButtonText:'Operación',
    //   cancelButtonText:'Transporte',
    //   confirmButtonColor:'#126b37',
    //   cancelButtonColor:'#126b37'
    // }).then((response)=>{
    //   if(response.isConfirmed){
    //     this._serviceP.messageMinersOp().subscribe();
    //   }else{
    //     this._serviceP.messageMinersTs().subscribe();
    //   }
    //   this._serviceP.sendToMiner(id).subscribe({
    //     next:(data:any)=>{
    //       Swal.fire({
    //         icon:'success',
    //         title: data.message,
    //         showCancelButton: false,
    //         showConfirmButton:false,
    //         showCloseButton:true
    //       })
    //       this.getPqrs();
    //     }
    //   })
    // })

    
  }

  showMining(){
    this.dataSource.data = this.allPqrs.filter((x:any) => x.status == "MINING")
  }

  showFollow(){
    this.dataSource.data = this.allPqrs.filter((x:any) => x.status == "FOLLOW")
  }

  showTotal(){
  this.dataSource.data = this.allPqrs.filter((x:any)=> x.status == "CREATED")
  }

  getSignatureValid(){
    this._serviceP.getSignature().subscribe({
      next: (data: any) => {
        this.signatureValid = data;
        console.log(data)
        if (data.message == "FALSE") {
          Swal.fire({
            icon: 'info',
            title: 'Firma Necesaria',
            text: 'Su usuario no cuenta con una firma asignada, por favor comunicarse con el coordinador para subir su firma digital',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton:true,
            allowOutsideClick: false,
            confirmButtonColor: '#ff0000',
            cancelButtonColor: '#a9a9a9'
          })
        }
      }
    })
  }

  openDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      width: '400px', // Ajusta el tamaño del modal según lo que necesites
      disableClose: true
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

  openDialogToMiner(id: number) {
    const dialogRef = this.dialog.open(SelectMinnerComponent, {
      width: '90%',
      height: 'auto' ,
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getPqrs()
    });
  }


  closeDialog(): void {
    this.dialog.closeAll(); // Cierra el diálogo actual
  }
  

  deletePqr(id: number) {
    Swal.fire({
      icon: 'warning',
      title: '¿ Esta seguro de elinar la PQR ?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#F11F1F',
      cancelButtonColor: '#E8E8E8'
    }).then(result => {
      if (result.isConfirmed) {
        this._serviceP.deletePqr(id).subscribe({
          next: (data: any) => {
            Swal.fire({
              icon: 'success',
              title: data.message
            })
            this.getPqrs();
          }
        })
      }
    })

    
  }

  formatDate(dateString: string): string | null {
    // Parse the date string to a Date object
    const date = new Date(dateString);
    // Format the date using Angular's DatePipe
    return this.datePipe.transform(date, 'dd/MMM/yyyy');
  }

  splitDate(date: string): string {
    const newdate: string[] = date.split('T')[0].split('-')
    return newdate[2] + "-" + newdate[1] + "-" + newdate[0];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private _filter(value: string): { name: string }[] {
    const filterValue = value.toLowerCase();
    return this.regionals.filter((reg: any) => reg.name.toLowerCase().includes(filterValue));
  }

}
