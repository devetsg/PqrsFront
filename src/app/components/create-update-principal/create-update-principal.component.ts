import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update-principal',
  templateUrl: './create-update-principal.component.html',
  styleUrl: './create-update-principal.component.scss'
})
export class CreateUpdatePrincipalComponent {
  formPrincipal!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  ID: any;
  isDisable = false;



  constructor(private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute, private _serviceP: PqrsService) {

  }

  ngOnInit(): void {
    this.ID = Number(this._route.snapshot.paramMap.get("id"));
    console.log(this.ID);

    this.formPrincipal = this._fb.group({
      name: ['', [Validators.required]],

    })

    if (this.ID > 0) {
      this.getPrincipal(this.ID);
    }
  }

  getPrincipal(id: number) {
    this._serviceP.getPrincipal(id).subscribe({
      next: (data: any) => {
        this.formPrincipal.patchValue({
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
      formData.append('name', this.formPrincipal.get("name")!.value);

      this._serviceP.updatePrincipal(this.ID, formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexPrincipals")
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

      formData.append('name', this.formPrincipal.get("name")!.value);

      this._serviceP.createPrincipal(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexPrincipals")
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
