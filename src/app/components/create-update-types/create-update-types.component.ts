import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import Swal from 'sweetalert2';
import { FlowPqrs } from '../../interfaces/FlowPqrs';

@Component({
  selector: 'app-create-update-types',
  templateUrl: './create-update-types.component.html',
  styleUrl: './create-update-types.component.scss'
})
export class CreateUpdateTypesComponent {
  formType!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  ID: any;
  isDisable = false;
  _flows:FlowPqrs = new FlowPqrs();

  DataFlows: any[];

  constructor(private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute, private _serviceP: PqrsService) {

    this.DataFlows =  [{
      name : "General",
      value : this._flows.General
    },{
      name : "Dir. Gestion y Contraloria",
      value : this._flows.DirectivoContralor
    },{
      name : "Coordinador",
      value : this._flows.Coordinador
    }]

  }

  ngOnInit(): void {
    this.ID = Number(this._route.snapshot.paramMap.get("id"));
    console.log(this.ID);

    this.formType = this._fb.group({
      name: ['', [Validators.required]],
      flow: ['',Validators.required]
    })

    if (this.ID > 0) {
      this.getType(this.ID);
    }
  }

  getType(id: number) {
    this._serviceP.getType(id).subscribe({
      next: (data: any) => {
        this.formType.patchValue({
          name: data.name,
          flow: data.flow
        })
        console.log(data);
      }
    })
  }

  submit() {
    this.submitted = true;

    if (this.ID > 0) {
      let formData = new FormData();
      formData.append('name', this.formType.get("name")!.value);
      formData.append('flow', this.formType.get("flow")!.value);

      this._serviceP.updateType(this.ID, formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexTypes")
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

      formData.append('name', this.formType.get("name")!.value);
      formData.append('flow', this.formType.get("flow")!.value);

      this._serviceP.createType(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this._redirect.navigateByUrl("/indexTypes")
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
