import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { HistoryComponent } from '../history/history.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';
import { ShowMinerComponent } from '../show-miner/show-miner.component';

@Component({
  selector: 'app-index-dir',
  templateUrl: './index-dir.component.html',
  styleUrl: './index-dir.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class IndexDirComponent {
  formFilter!: FormGroup;


  // displayedColumns: string[] = ['No', 'subject', 'Actions'];
  displayedColumns: string[] = ['pqrId','reception','creation','document','usuario','regional','statusMiner','opts'];
  dataSource = new MatTableDataSource();
  sends: any;
  oldSends: any;
  constructor(private _serviceP: PqrsService, public dialog: MatDialog, private sanitizer: DomSanitizer,
              private _fb:FormBuilder) {
    this.formFilter = this._fb.group({
      filter: [''],

    })

    this.formFilter.get('filter')?.valueChanges.subscribe((value:string) => {
      console.log(value)

      if (value.length > 3) {
        this.sends = this.sends.filter((item: any) =>
          item.userName.toLowerCase().includes(value.toLowerCase()) // Reemplaza 'someField' con el campo de los datos que deseas filtrar
        );
        
      } else {
        this.sends = this.oldSends
      }
    })
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPqrs();
  }

  getPqrs() {
    this._serviceP.getPqrs().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        console.log(data)
      }
    })

    this._serviceP.getPqrsSend().subscribe({
      next: (data2: any) => {
        console.log(data2)
        this.sends = data2;
        this.oldSends = this.sends;
      }
    })
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

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
