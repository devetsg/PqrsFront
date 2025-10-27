import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { SignalRServiceService } from '../../services/signal-rservice.service';

import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateSenderComponent } from '../create-update-sender/create-update-sender.component';

@Component({
  selector: 'app-index-sender',
  templateUrl: './index-sender.component.html',
  styleUrl: './index-sender.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexSenderComponent {
  displayedColumns: string[] = ['email', 'serverIMAP', 'serverSMTP', 'portIMAP', 'portSMTP', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(private dialog: MatDialog,
    private _serviceP: PqrsService,
    private signalRService: SignalRServiceService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.listenSignalR();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.signalRService.addCrudListener((action, data) => {
        console.log('Received notification:', action, data);
        // Aquí puedes manejar las acciones (Create, Update, Delete)
        this.getSenders()
      });
    });
    this.getSenders();
  }

  getSenders() {
    this._serviceP.getSenders().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
  }

  listenSignalR(){
    // Escuchar notificaciones
    this.signalRService.addCrudListener((action, data) => {
      console.log('Received notification:', action, data);

      this.getSenders();
    });
  }

  deleteSender(id: number) {
    this._serviceP.deleteSender(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message
        })
        this.getSenders();
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

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateUpdateSenderComponent, {
      width: '600px', // Más ancho por los 6 campos
      data: { isEdit: false, id: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSenders();
      }
    });
  }

  openEditDialog(id: number) {
    const dialogRef = this.dialog.open(CreateUpdateSenderComponent, {
      width: '600px',
      data: { isEdit: true, id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSenders();
      }
    });
  }
}
