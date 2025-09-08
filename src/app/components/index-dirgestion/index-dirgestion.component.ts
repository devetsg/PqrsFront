import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ShowMinerComponent } from '../show-miner/show-miner.component';
import { SignalRServiceService } from '../../services/signal-rservice.service';

@Component({
  selector: 'app-index-dirgestion',
  templateUrl: './index-dirgestion.component.html',
  styleUrl: './index-dirgestion.component.scss'
})
export class IndexDirgestionComponent {
   displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','statusMiner','opts'];
    dataSource = new MatTableDataSource();
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(public dialog: MatDialog,private _serviceP:PqrsService, private sanitizer: DomSanitizer,
      private signalRService: SignalRServiceService
    ){}
    ngOnInit(): void {
      this.signalRService.startConnection().then(() => {
        this.signalRService.addCrudListener((action, data) => {
          console.log('Received notification:', action, data);
          // Aquí puedes manejar las acciones (Create, Update, Delete)
        this.getPqrs();
  
        });
      });
      // this.listenSignalR();
      this.getPqrs()
    }
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    getPqrs() {
      this._serviceP.getPqrsGestion().subscribe({
        next: (data: any) => {
          console.log(data)
          this.dataSource.data = data
        }
      })
    }
  
    listenSignalR(){
      // Escuchar notificaciones
      this.signalRService.addCrudListener((action, data) => {
        console.log('Received notification:', action, data);
  
        this.getPqrs();
      });
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
