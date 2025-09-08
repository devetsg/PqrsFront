import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update-mail',
  templateUrl: './create-update-mail.component.html',
  styleUrl: './create-update-mail.component.scss'
})
export class CreateUpdateMailComponent {
   formMail!: FormGroup;
    submitted = false;
    errorMessages: string[] = [];
    ID: any;
    isDisable = false;
  
  
  
    constructor(private _fb: FormBuilder, private _redirect: Router,
      private _route: ActivatedRoute, private _serviceP:PqrsService) {
  
    }
  
    ngOnInit(): void {
      this.ID = Number(this._route.snapshot.paramMap.get("id"));
      console.log(this.ID);
  
      this.formMail = this._fb.group({
        name: ['', [Validators.required]],
  
      })
  
      if (this.ID > 0) {
        this.getMail(this.ID);
      }
    }
  
    getMail(id: number) {
      this._serviceP.getMailCopy(id).subscribe({
        next: (data: any) => {
          this.formMail.patchValue({
            name: data.name,
          })
          console.log(data);
        }
      })
    }
  
    submit() {
      this.submitted = true;
  
      if (this.ID > 0) {
        let formData = new FormData();
        formData.append('name', this.formMail.get("name")!.value);
  
        this._serviceP.createUpdateMailCopy(formData,this.ID).subscribe({
          next: (response: any) => {
            console.log(response);
            this._redirect.navigateByUrl("/indexMail")
            Swal.fire({
              icon: 'success',
              title: response.message
            })
          },
          error: error => {
            if (error.error.errors) {
              this.errorMessages = error.error.errors
            }
          }
        })
      } else {
        let formData = new FormData();
  
        formData.append('name', this.formMail.get("name")!.value);
  
        this._serviceP.createUpdateMailCopy(formData).subscribe({
          next: (response: any) => {
            console.log(response);
            this._redirect.navigateByUrl("/indexMail")
            Swal.fire({
              icon: 'success',
              title: response.message
            })
          },
          error: error => {
            if (error.error.errors) {
              this.errorMessages = error.error.errors
            }
          }
        })
      }
  
  
    }
}
