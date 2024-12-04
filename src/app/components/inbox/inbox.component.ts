import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PqrsService } from '../../services/pqrs.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { MyCustomPaginatorIntl } from '../../interfaces/paginator';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl } 
  ]
})
export class InboxComponent {
  displayedColumns: string[] = ['no', 'subject', 'body', 'action'];
  dataSource = new MatTableDataSource();

  dataMails: any;
  mails: any;
  formInbox!: FormGroup;
  ID!: any;

  constructor(private _fb:FormBuilder,private _serviceP: PqrsService, private _route: ActivatedRoute, public dialog: MatDialog) {
    this.formInbox = _fb.group({
      email:[""]
    })
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getMails() {
    //this._serviceP.getMails().subscribe({
    //  next: (data: any) => {
    //    console.log(data)
    //    this.dataSource.data = data;
    //    this.mails = data.length;
    //    this.dataMails = data;
    //  }
    //})
  }

  details(id: number) {
    let mail;

    for (mail of this.dataMails) {
      if (mail.id == id) {
        Swal.fire({
          icon: 'info',
          html: `<strong>Remitente: </strong> ${mail.from} <br>
                 <strong>Asunto: </strong> ${mail.subject} <br>`
        })
        break;
      }
    }
  }


  openDialog(Id: number,from:string,subject:string) {

    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '70%',
      height: '70%',
      data: {
        id: Id,
        from: from,
        subject:subject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submit() {
    let data = new FormData();
    data.append("destinatario", this.formInbox.get("email")!.value);
    this._serviceP.getMails(data).subscribe({
      next: (data: any) => {
        console.log(data)
        this.dataSource.data = data;
      }
    })
  }

}
