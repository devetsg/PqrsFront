import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-index-types',
  templateUrl: './index-types.component.html',
  styleUrl: './index-types.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexTypesComponent {
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
    this.getTypes();
  }

  getTypes() {
    this._serviceP.getTypes().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
  }

  deleteType(id: number) {
    this._serviceP.deleteType(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message
        })
        this.getTypes();
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
