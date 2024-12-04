import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-index-means',
  templateUrl: './index-means.component.html',
  styleUrl: './index-means.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexMeansComponent {
  displayedColumns: string[] = ['No', 'Name', 'Actions'];
  dataSource = new MatTableDataSource();

  constructor(private _serviceP:PqrsService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getMeans();
  }

  getMeans() {
    this._serviceP.getMeans().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      }
    })
  }

  deleteMean(id: number) {
    this._serviceP.deleteMean(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message
        })
        this.getMeans();
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
