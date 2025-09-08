import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID, viewChild, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { RoleService } from './services/role.service';
import { AccountService } from './services/account.service';
import { NavigationEnd, Router } from '@angular/router';
import * as AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PqrsService } from './services/pqrs.service';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit{
  @ViewChild('drawer',{ static: false }) drawer!: MatDrawer;
  accordion = viewChild.required(MatAccordion);
  public screenWidth!: number;
  title = 'ManagerPqrsFront';
  iconClass = 'sideMenu bi bi-caret-right-fill'; // Clase inicial del ícono
  drawerOpen = false;
  isLogged: any;
  formInterval!:FormGroup;
  validSignature = false;
  isChange = false;
  oldInterval?:number;
  // isVisibleMenu: boolean = false;
  public isLocalStorageAvailable!: boolean;
  isHome: boolean = false;
  role = "";
  constructor(private _roleService: RoleService, private _serviceA: AccountService, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,private _fb:FormBuilder,
    private _serviceE:PqrsService,private cdr: ChangeDetectorRef
  ) {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }
    if (isPlatformBrowser(this.platformId)) { AOS.init({ once: true, duration: 1000 }); }
    this.formInterval = _fb.group({
      interval: ["",Validators.required]
    })

    this.formInterval.get("interval")?.valueChanges.subscribe((value) => {
      this.isChange = value == this.oldInterval || this.oldInterval == null ? false : true;
    })

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (typeof window !== 'undefined') {
      this.screenWidth = event.target.innerWidth;
      console.log(this.screenWidth)
      AOS.init();
    }
    
  }

  ngAfterViewChecked() {
    if (this.drawer && !this.drawerOpen) {
      this.drawer.open();
      // this.drawerOpen = true;
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      if (this.drawer) {
        this.drawer.open();
      } else {
        console.error("❌ Error: 'drawer' no está definido.");
        

      }
    }, 500);


    
  }

  ngOnInit(): void {
    this.getInterval();
    this._serviceA.isLogged$.subscribe({
      next: (data: any) => {
        this.isLogged = data;
        console.log(this.isLogged)
      }
    })

    this._serviceA.getRole();

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.isHome = this.router.url === '/account/login';
    //   }
    // });
    
    
    
  }

  getInterval(){
    this._serviceE.getInterval().subscribe({
      next:(data:any)=>{
        this.formInterval.patchValue({
          interval : data.interval
        })
        this.oldInterval = data.interval
      }
    })
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

  submit(){
    let interval = this.formInterval.get("interval")?.value;
    this._serviceE.updateInterval(interval).subscribe({
      next:(data:any)=>{
        Swal.fire({
          title:"Intervalo de notificacion actualizado",
          showConfirmButton:false,
          showCancelButton:false,
          showCloseButton:true,
          icon:'success'
        })
        this.isChange = false;
        this.oldInterval = interval;
      }
    })
  }

  logout(){
    this._serviceA.logout();
  }
  onButtonClick() {
    this.drawer.toggle();
    this.toggleIcon();
  }

  toggleIcon() {
    this.drawerOpen = !this.drawerOpen; // Alterna el estado del drawer
    this.iconClass = this.drawerOpen ? 'sideMenu bi bi-caret-left-fill' : 'sideMenu bi bi-caret-right-fill';
  }

  
}
