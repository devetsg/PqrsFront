import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  role$ = new BehaviorSubject<string | null>(null);

  constructor(private _serviceA: AccountService) { }

  getRole() {
    let key = this._serviceA.getJWT();
    if (key !== null) {
      let dtoken: any = jwtDecode(key)
      let role = dtoken.role;
      // Actualiza el BehaviorSubject con el nuevo rol
      this.role$.next(role);
      return role;
    }
  }

  getName() {
    let key = this._serviceA.getJWT();
    if (key !== null) {
      let dtoken: any = jwtDecode(key)
      return dtoken.unique_name;
    }
  }

  getId() {
    let key = this._serviceA.getJWT();
    if (key !== null) {
      let dtoken: any = jwtDecode(key)
      return dtoken.nameid
    }
  }
}
