import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { SignalRServiceService } from '../../services/signal-rservice.service';

@Component({
  selector: 'app-index-principal',
  templateUrl: './index-principal.component.html',
  styleUrl: './index-principal.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexPrincipalComponent {
  displayedColumns: string[] = ['No', 'Name', 'Actions'];
  dataSource = new MatTableDataSource();

  constructor(private _serviceP: PqrsService,private signalRService: SignalRServiceService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.signalRService.addCrudListener((action, data) => {
        console.log('Received notification:', action, data);
        // Aquí puedes manejar las acciones (Create, Update, Delete)
        this.getPrincipals();
      });
    });
    this.getPrincipals();
  }

  getPrincipals() {
    this._serviceP.getPrincipals().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
  }

  listenSignalR(){
    // Escuchar notificaciones
    this.signalRService.addCrudListener((action, data) => {
      console.log('Received notification:', action, data);

      this.getPrincipals();
    });
  }

  deletePrincipal(id: number) {
    this._serviceP.deletePrincipal(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message
        })
        this.getPrincipals();
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
