import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-aproved',
  templateUrl: './select-aproved.component.html',
  styleUrl: './select-aproved.component.scss'
})
export class SelectAprovedComponent {
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

  emailId: any;

  constructor(private _serviceT: PqrsService, private _fb: FormBuilder, public dialogRef: MatDialogRef<SelectAprovedComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router, private _roleService: RoleService) {
    this.formSend = _fb.group({
      addressee: [{ value: '', disabled: true }],
      subject: [{ value: '', disabled: true }],
      body: ['']
    })
    console.log(this.file1);

  }

  ngOnInit(): void {
    this.getTask();
    this.getSenders();
  }

  getTask() {
    console.log(this.data.id);
    if (this.data.id > 0) {
      this._serviceT.getPqr(this.data.id).subscribe({
        next: (data: any) => {
          let email = data.from.match(/<(.+)>/)[1];  // Extrae lo que está dentro de <>
          this.emailId = data.messageId;
          if (data.subject.toString().includes("RE:")) {
            this.formSend.patchValue({
              addressee: email,
              subject: data.subject,
              body: data.response
            })
          } else {
            this.formSend.patchValue({
              addressee: email,
              subject: data.subject,
              body: data.response
            })
          }
          console.log(data)
        }
      })
    }
  }

  getSenders() {
    /*let area = this._roleService.getArea();*/
    //let formData = new FormData();
    //formData.append("areaName", area)

    this._serviceT.getSenders().subscribe({
      next: (data: any) => {
        this.senders = data
      }
    })
  }


  submit() {
    console.log(this.formSend)
    
    this.isLoading = true;
    const form = new FormData();
    form.append('id', this.data.id);
    form.append('addressee', this.formSend.get('addressee')!.value);
    form.append('subject', this.formSend.get('subject')!.value);
    form.append('body', this.formSend.get('body')!.value);
    form.append('emailId', this.emailId);
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
        }).then((result)=>{
          if(result.isConfirmed){
            this.dialogRef.close('Resultado opcional');

          }
        })
        this._router.navigate(["/indexDir"])
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
