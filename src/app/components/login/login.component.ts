import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../interfaces/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;

  constructor(private _roleService: RoleService, private _serviceA: AccountService, 
    private _fb: FormBuilder, private _redirect: Router, 
    private aroute: ActivatedRoute) {
    this._serviceA.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          let role:string = this._roleService.getRole();
          switch(role){
            case "ANALISTA":
              this._redirect.navigate(['indexPqrs']);
              break;
            case "MINERO":
              this._redirect.navigate(['indexMiner']);
              break;
            
            case "COORDINADOR":
              this._redirect.navigate(['indexCoord']);
              break;
            case "DIRGENERAL":
              this._redirect.navigate(['indexDir']);
              break;
            case "SUPERVISOR":
              this._redirect.navigate(['indexSupervisor']);
              break;
              
            default: 
              this._redirect.navigate(['indexPqrs']);
              break;
          }
         
        } else {
          this.aroute.queryParamMap.subscribe({
            next: (params: any) => {
              this.returnUrl = params.get('returnUrl');
            }
          })
        }
      }
    })


    this.formLogin = _fb.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]]
    })
  }

  submit() {
    this.submitted = true;

    let form = new FormData();
    form.append('username', this.formLogin.get('UserName')!.value);
    form.append('password', this.formLogin.get('Password')!.value);

    this._serviceA.login(form).subscribe({
      next: (data: any) => {
        if (data.message == "OK") {
          
          this._serviceA.setUser(data);
          this._serviceA.getRole();

          let role = this._roleService.getRole();
          if(role == "DIRGENERAL"){
          this._redirect.navigate(["indexDir"])
          }
          else if(role == "COORDINADOR"){
            this._redirect.navigate(["indexCoord"])
          }
          else if(role == "MINERO"){
            this._redirect.navigate(["indexMiner"])
          }
          else if(role == "SUPERVISOR"){
            this._redirect.navigate(["indexSupervisor"])
          }
          else{
            this._redirect.navigate(["indexPqrs"])
          }
        } else if (data.message == "INVALIDCREDENTIALS") {
          Swal.fire({
            icon: 'error',
            title: 'Usuario O Contraseña Incorectos'
          })

        } else if (data.message == "NOTFOUND") {
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado'
          })
        } else if (data.message == "NOTAMEMBER") {
          Swal.fire({
            icon: 'error',
            title: 'Usuario sin acceso a esta aplicacion, por favor comuniquese con el Administrador'
          })
        } else if (data.message == "DISABLEDACCOUNT") {
          Swal.fire({
            icon: 'error',
            title: 'El usuario esta desabilitado'
          })
        }
      }
    })
  }
}
