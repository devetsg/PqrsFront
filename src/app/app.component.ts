import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { RoleService } from './services/role.service';
import { AccountService } from './services/account.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  public screenWidth!: number;
  title = 'ManagerPqrsFront';
  iconClass = 'sideMenu bi bi-caret-right-fill'; // Clase inicial del ícono
  drawerOpen = false;
  isLogged: any;
  validSignature = false;
  // isVisibleMenu: boolean = false;
  public isLocalStorageAvailable!: boolean;
  isHome: boolean = false;

  constructor(private _roleService: RoleService, private _serviceA: AccountService, private router: Router) {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (typeof window !== 'undefined') {
      this.screenWidth = event.target.innerWidth;
      console.log(this.screenWidth)
    }
  }


  ngOnInit(): void {
    this._serviceA.isLogged$.subscribe({
      next: (data: any) => {
        this.isLogged = data;
        // this.isVisibleMenu = true;
      }
    })

    this._serviceA.getRole();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHome = this.router.url === '/account/login';
      }
    });
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

  onButtonClick() {
    this.drawer.toggle(); // Acción 1: Alternar el drawer
    this.toggleIcon(); // Acción 2: Cambiar el ícono
  }

  toggleIcon() {
    this.drawerOpen = !this.drawerOpen; // Alterna el estado del drawer
    this.iconClass = this.drawerOpen ? 'sideMenu bi bi-caret-left-fill' : 'sideMenu bi bi-caret-right-fill';
  }

  
}
