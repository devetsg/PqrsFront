import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, range } from 'rxjs';
import { RoleService } from '../services/role.service';
import { SharedService } from '../services/shared.service';






@Injectable({
  providedIn: 'root',

})
export class supervisorGuard implements CanActivate {
  islocal = this.checkLocal();



  constructor(private _serviceR: RoleService, private _redirect: Router, private _ServiceS: SharedService) {

  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    const rolesExpected = route.data['expectedRoleSuper'];
    const rolesArray = rolesExpected.split(',');

    if (this.islocal) {

      const actualRole = this._serviceR.getRole();

      if (!actualRole) {
        this._ServiceS.showModal('', 'Por favor Iniciar Sesion');
        this._redirect.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      }

      let result = rolesArray.find((x: any) => {
        return x == actualRole
      })
      

      if (result) {
        return of(true);
      } else {
        this._ServiceS.showModal('Unauthorized', 'Area Exclusiva para Administradores');
        this._redirect.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      }

      return of(true);
    }
    return of(true);

  }

  checkLocal() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }


}
