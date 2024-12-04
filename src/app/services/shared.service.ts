import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  showModal(str1: string, str2: string) {
    Swal.fire({
      title: str1,
      text: str2,
      icon: 'error'
    });
  }
}
