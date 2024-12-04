import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss'
})
export class SignatureComponent {
  formReAsigned!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  ID: any;
  isDisable = false;
  users: any;

  file!: File | undefined;
  Files: File[] = [];
  namesFiles: string[] = [];
  isFile = false;
  nameUser = "";

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _fb: FormBuilder, private _serviceA: AccountService, private _redirect: Router,
    private _route: ActivatedRoute, private _serviceT: PqrsService, private _role: RoleService) {

  }

  ngOnInit(): void {
    this.reasigned();
    this.ID = Number(this._route.snapshot.paramMap.get("id"));
    console.log(this.ID);

    this.nameUser = this._role.getName();

    this.formReAsigned = this._fb.group({
      reasigned: ['', [Validators.required]],
      
    })

    this.formReAsigned.patchValue({
      reasigned:this.nameUser
    })
   
  }

  getFile(event: any) {
    const file = event.target.files[0]; // Tomar el primer archivo seleccionado
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file) {
      const fileType = file.type; // Obtener el tipo MIME del archivo

      // Validar que el tipo de archivo esté permitido
      if (!allowedExtensions.includes(fileType)) {
        Swal.fire({
          icon: 'warning',
          title: 'Solo se permiten archivos JPG, JPEG o PNG.'
        })
        event.target.value = ''; // Limpiar el input si el archivo no es válido
        return;
      }

      // Si el archivo es válido, agregarlo a los arreglos
      if (this.Files.length == 1) {
        Swal.fire({
          icon: 'error',
          title: 'Solo se permite un archivo'
        })
        return;
      }

      this.Files.push(file);
      this.namesFiles.push(file.name);
      this.isFile = true;
    }
  }

  deleteFile(file: string) {
    if (this.namesFiles.length < 1) {
      this.isFile = false;
    }
    const fileIndex = this.Files.findIndex(x => x.name == file);
    this.namesFiles = this.namesFiles.filter(name => name !== file);

    if (fileIndex > -1) {
      this.Files.splice(fileIndex, 1);
    }


    this.fileInput.nativeElement.value = '';

  }

  reasigned() {
    this._serviceA.getAnalists().subscribe({
      next: (data: any) => {
        this.users = data;
      }
    })


  }


  submit() {
    this.submitted = true;
    const data = new FormData();
    data.append("userName",this.formReAsigned.get('reasigned')!.value)
    this.Files.forEach((file, index) => {
      data.append(`File${index + 1}`, file);
    });

    this._serviceT.addSignature(data).subscribe({
      next: (data: any) => {
        this._redirect.navigate(["/indexPqrs"])
        Swal.fire({
          icon: 'success',
          title: data.message
        })
      }
    })
    


  }
}
