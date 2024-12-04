import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

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

  constructor(private _serviceP: PqrsService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPrincipals();
  }

  getPrincipals() {
    this._serviceP.getPrincipals().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
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
