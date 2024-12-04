import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { User } from '../interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private islocalAvailable = this.checkLocalStorage();
  myApiUrl = environment.endpoint;
  myApiUrlA = "api/account/";
  private userSource = new ReplaySubject<User | null>(1)
  user$ = this.userSource.asObservable();
  isLogged$ = new BehaviorSubject<string | null>(null);


  constructor(private _http: HttpClient, private _redirect: Router) { }

  //ACCOUNT
  login(data: FormData): Observable<any> {
    return this._http.post(`${this.myApiUrl}${this.myApiUrlA}login`, data)
  }

  getAnalists(): Observable<any> {
    return this._http.get(`${this.myApiUrl}${this.myApiUrlA}getAnalists`)
  }


  public setUser(user: any): Promise<void> {
    return new Promise<void>((resolve) => {
      localStorage.setItem(environment.userKey, user.token);
      this.userSource.next(user.message);
      resolve();
    });
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this._redirect.navigate(['login'])
    this.isLogged$.next(null)
  }

  getUsers() {
    return this._http.get(`${this.myApiUrl}${this.myApiUrlA}getUsers`)
  }




  //GET LOCALSTORAGE
  getJWT() {
    if (this.islocalAvailable) {
      const key = localStorage.getItem(environment.userKey);

      if (key) {
        return key;
      } else {
        return null
      }
    } else {
      return null;
    }
  }


  getRole(): void {
    let key = this.getJWT();
    if (key !== null) {
      let obj: any = jwtDecode(key)


      this.isLogged$.next(obj.role);
    }
  }

  getArea(): any {
    let key = this.getJWT();
    if (key !== null) {
      let obj: any = jwtDecode(key)


      return obj.given_name;
    }
  }

  checkLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }
}
