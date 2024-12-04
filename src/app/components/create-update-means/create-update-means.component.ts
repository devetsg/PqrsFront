import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update-means',
  templateUrl: './create-update-means.component.html',
  styleUrl: './create-update-means.component.scss'
})
export class CreateUpdateMeansComponent {
  formMean!: FormGroup;
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

    this.formMean = this._fb.group({
      name: ['', [Validators.required]],

    })

    if (this.ID > 0) {
      this.getMean(this.ID);
    }
  }

  getMean(id: number) {
    this._serviceP.getMean(id).subscribe({
      next: (data: any) => {
        this.formMean.patchValue({
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
      formData.append('name', this.formMean.get("name")!.value);

      this._serviceP.updateMean(this.ID, formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexMeans")
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

      formData.append('name', this.formMean.get("name")!.value);

      this._serviceP.createMean(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexMeans")
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
