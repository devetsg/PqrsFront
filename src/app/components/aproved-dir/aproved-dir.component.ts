import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aproved-dir',
  templateUrl: './aproved-dir.component.html',
  styleUrl: './aproved-dir.component.scss'
})
export class AprovedDirComponent {
  formResponse!: FormGroup;
  ID: any;
  messages: any;

  constructor(private _serviceP: PqrsService, private _fb: FormBuilder, private _redirect: Router,
    private _route: ActivatedRoute) {
    this.ID = _route.snapshot.paramMap.get('id');
    this.formResponse = _fb.group({
      pqrText: [{ value: '', disabled: true }],
      pqrSubject: [{ value: '', disabled: true }],
      response: [{ value: '', disabled: true }],
      corrections: [''],
    })
  }

  ngOnInit(): void {
    if (this.ID) {
      this.getPqr();
      this.getChat();
    }
  }

  getPqr() {
    this._serviceP.getPqr(this.ID).subscribe({
      next: (data: any) => {
        console.log(data)
        this.formResponse.patchValue({
          pqrText: data.body,
          pqrSubject: data.subject,
          response:data.response
        })
      }
    })
  }

  getChat() {
    this._serviceP.getChat(this.ID).subscribe({
      next: (data: any) => {
        console.log(data)
        this.messages = data;
      }
    })
  }

  sendFollow() {
    const data = new FormData();
    data.append("pqrId", this.ID);
    data.append("newStatus", "Follow");
    data.append("response", this.formResponse.get('response')!.value);
    data.append("corrections", this.formResponse.get('corrections')!.value);

    this._serviceP.sendFollow(data).subscribe({
      next: (data: any)=>{
        this._redirect.navigateByUrl("indexPqrs")
        Swal.fire({
          icon: 'success',
          title: data.message
        })
      }
    })
  }

  submit() {
    const data = new FormData();
    data.append("pqrId", this.ID);
    data.append("response", this.formResponse.get('response')!.value);
    data.append("comments", this.formResponse.get('comments')!.value);

    this._serviceP.responseToDir(data).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message
        })
      }
    })

  }
}
