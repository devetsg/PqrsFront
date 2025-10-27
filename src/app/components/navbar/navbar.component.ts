import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { RoleService } from '../../services/role.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('menuAnimation', [
      state('hidden', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*',
        opacity: 1,
      })),
      transition('hidden <=> visible', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class NavbarComponent {
  @Output() cerrarSesion = new EventEmitter<void>();
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  isLogged: any;
  showFiller = false;
  showMenu = false;
  showAdmin = false;
  textColor = '#075f47';
  textColorAdmin = '#075f47';
  activeButton: string = '';
  currentUrl: string = '';
  actualRole = ""
  constructor(public _redirect: Router,private _serviceA:AccountService,private _serviceR:RoleService) {

  }

  ngOnInit(): void {
    this.actualRole = this._serviceR.getRole();
    
    this._serviceA.isLogged$.subscribe({
      next: (data: any) => {
        this.isLogged = data;
      }
    })

    this._redirect.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log(this.currentUrl)
      }
    });
  }

  showMenuFunc() {
    if (this.showMenu) {
      this.showMenu = false;
      this.textColor = '#075f47'
    } else {
      this.showMenu = true;
      this.showAdmin = false;
      this.textColor = '#057857'
      this.textColorAdmin = '#075f47'
    }
  }

  showAdminFunc() {
    if (this.showAdmin) {
      this.showAdmin = false;
      this.textColorAdmin = '#075f47'
    } else {
      this.showAdmin = true;
      this.showMenu = false;
      this.textColor = '#075f47'
      this.textColorAdmin = '#057857'
    }
  }

  logout() {
    this.isLogged = undefined;
    this._serviceA.logout();
    this.ngOnInit();
  }

  setActive(buttonName: string) {
    this.activeButton = buttonName;
  }
}
