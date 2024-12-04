import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PqrsService } from '../../services/pqrs.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrl: './dialog-content.component.scss'
})
export class DialogContentComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  formSend!: FormGroup;
  file1!: File | undefined;
  file2!: File | undefined;
  file3!: File | undefined;
  isFile = false;
  namesFiles: string[] = [];
  Files: File[] = [];
  senders: any;
  isLoading = false;

  constructor(private _serviceT: PqrsService, private _fb: FormBuilder, public dialogRef: MatDialogRef<DialogContentComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router) {
    this.formSend = _fb.group({
      sender: [''],
      addressee: [{ value: '', disabled: true }],
      subject: [{ value: '', disabled: true }],
      body: ['']
    })
    console.log(this.file1);

  }

  ngOnInit(): void {
    console.log(this.data)
    this.formSend.patchValue({
      addressee: this.data.from,
      subject: this.data.subject
    })
  }

  

 


  submit() {
    this.isLoading = true;
    const form = new FormData();
    form.append('id', this.data.id);
    form.append('sender', this.formSend.get('sender')!.value);
    form.append('addressee', this.formSend.get('addressee')!.value);
    form.append('subject', this.formSend.get('subject')!.value);
    form.append('body', this.formSend.get('body')!.value);
    //for (let i = 0; i < this.file.length; i++) {
    //  form.append('file'+i, this.file[i]);
    //}
    this.Files.forEach((file, index) => {
      form.append(`File${index + 1}`, file);
    });

    console.log(form);

    this._serviceT.sendEmail(form).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          text: 'Correo Enviado Satisfactoriamente',
          allowOutsideClick: false,
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        })
      },
      error: error => {
        console.log(error);
      }
    })
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  getFile(event: any) {
    this.Files.push(event.target.files[0]);
    this.namesFiles.push(event.target.files[0].name);
    this.isFile = true
  }

  deleteFile(file: string) {
    if (this.namesFiles.length < 1) {
      this.isFile = false;
    }
    const fileIndex = this.Files.findIndex(x => x.name == file);
    this.namesFiles = this.namesFiles.filter(name => name !== file);

    if (fileIndex > -1) {
      this.Files.splice(fileIndex, 1);
    }


    this.fileInput.nativeElement.value = '';

  }
}
