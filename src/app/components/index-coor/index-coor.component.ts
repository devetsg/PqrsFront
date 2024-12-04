import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PqrsService } from '../../services/pqrs.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ShowMinerComponent } from '../show-miner/show-miner.component';

@Component({
  selector: 'app-index-coor',
  templateUrl: './index-coor.component.html',
  styleUrl: './index-coor.component.scss'
})
export class IndexCoorComponent {
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','statusMiner','opts'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,private _serviceP:PqrsService, private sanitizer: DomSanitizer){}
  ngOnInit(): void {
    this.getPqrs()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPqrs() {
    this._serviceP.getPqrsCoord().subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data
      }
    })
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
