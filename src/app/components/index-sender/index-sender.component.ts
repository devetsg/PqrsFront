import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

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

  constructor(private _serviceP: PqrsService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getSenders();
  }

  getSenders() {
    this._serviceP.getSenders().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
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
}
