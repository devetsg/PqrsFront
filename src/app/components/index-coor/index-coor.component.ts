import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ShowMinerComponent } from '../show-miner/show-miner.component';
import { SignalRServiceService } from '../../services/signal-rservice.service';
import { SeeMailComponent } from '../see-mail/see-mail.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-index-coor',
  templateUrl: './index-coor.component.html',
  styleUrl: './index-coor.component.scss'
})
export class IndexCoorComponent {
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','statusMiner','opts'];
  dataSource = new MatTableDataSource();
  selectedToggle: string = 'coordinacion';
  pqrsByEditing:any;
  actualRole = ""

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,private _serviceP:PqrsService, private sanitizer: DomSanitizer,
    private signalRService: SignalRServiceService, private _redirect:Router,private _serviceR:RoleService
  ){}
  ngOnInit(): void {
    this.actualRole = this._serviceR.getRole();
    this.signalRService.startConnection().then(() => {
      this.signalRService.addCrudListener((action, data) => {
        console.log('Received notification:', action, data);
        // Aquí puedes manejar las acciones (Create, Update, Delete)
      this.getPqrs();
      this.getByEditing();
      
      });
    });
    // this.listenSignalR();
    this.getPqrs()
    this.getByEditing();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPqrs() {
    this._serviceP.getPqrsCoord().subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data;
      }
    })
  }

  showFollow(){
    this._serviceP.getFullPqrs().subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data.filter((x:any)=> x.status == "CREATED"
        || x.status == "FOLLOW"
        || x.status == "MINING")
        
      }
    })
  }

  openDialogToSee(id: number) {
      const dialogRef = this.dialog.open(SeeMailComponent, {
        width: '90%',
        height: 'auto' ,
        data: {
          id: id,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
       
      });
  }

  getByEditing(){
    this._serviceP.getPqrsByEdit().subscribe({
      next: (data:any) => {
        console.log(data)
        this.pqrsByEditing = data;
        this.selectedToggle = "coordinacion"
      }
    })
  }

  showEdit(){
    this.dataSource.data = this.pqrsByEditing;
  }

  responsePqr(id:number){
      this._serviceP.checkServices(id).subscribe({
        next: (data:any)=>{        
          if(data == true){
            this._redirect.navigateByUrl(`/responsePqr/${id}`);
          }else{
            Swal.fire({
              icon:'warning',
              title: 'Agregar Servicios',
              text: 'Para continuar con la redacción de la respuesta a la pqr debe asociar los servicios',
              confirmButtonText:'Agregar Servicios',
              showConfirmButton:true,
              confirmButtonColor:'#14642c',
              showCloseButton: true
            }).then((response)=>{
              if(response.isConfirmed){
                this._redirect.navigateByUrl(`/addServices/${id}`)
              }
            })
          }
        }
      })
    }
  

  showTotal(){
  this.getPqrs();
  }

  listenSignalR(){
    // Escuchar notificaciones
    this.signalRService.addCrudListener((action, data) => {
      console.log('Received notification:', action, data);

      this.getPqrs();
    });
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
              this.getPqrs();
  
            },)
           
          }
        }
      )
    }
  
  deletePqr(id: number) {
   
    
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

  formatDate(dateString: string) {
    // // Parse the date string to a Date object
    // const date = new Date(dateString);
    // // Format the date using Angular's DatePipe
    // return this.datePipe.transform(date, 'dd/MMM/yyyy');
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
}
