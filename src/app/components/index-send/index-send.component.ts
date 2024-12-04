import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { HistoryComponent } from '../history/history.component';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { ShowMinerComponent } from '../show-miner/show-miner.component';

@Component({
  selector: 'app-index-send',
  templateUrl: './index-send.component.html',
  styleUrl: './index-send.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexSendComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','radication','typepqr','regional','statusMiner','opts'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _serviceP:PqrsService, public dialog: MatDialog, private sanitizer: DomSanitizer){}
  ngOnInit(): void {
    this.getPqrs()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPqrs() {
    this._serviceP.getPqrsSend().subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data
      }
    })
  }

  deletePqr(id: number) {
   
    
  }

  openDialog(id: number) {

    const dialogRef = this.dialog.open(HistoryComponent, {
      width: '85%',
      height: '90%',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
