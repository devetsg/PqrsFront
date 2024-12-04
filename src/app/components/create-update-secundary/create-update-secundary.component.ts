import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update-secundary',
  templateUrl: './create-update-secundary.component.html',
  styleUrl: './create-update-secundary.component.scss'
})


export class CreateUpdateSecundaryComponent {
  formSecundary!: FormGroup;
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

    this.formSecundary = this._fb.group({
      name: ['', [Validators.required]],

    })

    if (this.ID > 0) {
      this.getSecundary(this.ID);
    }
  }

  getSecundary(id: number) {
    this._serviceP.getSecundary(id).subscribe({
      next: (data: any) => {
        this.formSecundary.patchValue({
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
      formData.append('name', this.formSecundary.get("name")!.value);

      this._serviceP.updateSecundary(this.ID, formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexSecundaries")
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
      let cedula = "103254564654";
      

      formData.append('name', this.formSecundary.get("name")!.value);
      formData.append('cedulaDos', cedula);


      this._serviceP.createSecundary(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexSecundaries")
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
