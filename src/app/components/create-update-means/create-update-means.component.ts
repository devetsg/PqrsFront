import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

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



  constructor(private _fb: FormBuilder,
  private _serviceP: PqrsService,
  public dialogRef: MatDialogRef<CreateUpdateMeansComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.ID = this.data.id;
    
    this.formMean = this._fb.group({
      name: ['', [Validators.required]],
    });

    if (this.data.isEdit && this.ID > 0) {
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
          Swal.fire({
          icon: 'success',
          title: response.message
        });
        this.dialogRef.close(true);
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
          Swal.fire({
          icon: 'success',
          title: response.message
        });
        this.dialogRef.close(true);
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
