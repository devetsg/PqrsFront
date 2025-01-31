import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AddDataMinedComponent } from '../add-data-mined/add-data-mined.component';
import { SignalRServiceService } from '../../services/signal-rservice.service';

@Component({
  selector: 'app-index-miner',
  templateUrl: './index-miner.component.html',
  styleUrl: './index-miner.component.scss'
})
export class IndexMinerComponent {
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','opts'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _serviceP:PqrsService, private sanitizer: DomSanitizer, public dialog: MatDialog,
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
    this.getPqrs()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPqrs() {
    this._serviceP.getPqrsMiner().subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data
      }
    })
  }

  deletePqr(id: number) {
   
    
  }

  openDialog(pqrId:number) {
  
    const dialogRef = this.dialog.open(AddDataMinedComponent, {
      width: '70%',  
      height: '70%',
      data: {
        id: pqrId
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  listenSignalR(){
    // Escuchar notificaciones
    this.signalRService.addCrudListener((action, data) => {
      console.log('Received notification:', action, data);

      this.getPqrs();
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
