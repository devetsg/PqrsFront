import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PqrsService } from '../../services/pqrs.service';
import { RoleService } from '../../services/role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { Console } from 'console';
@Component({
  selector: 'app-add-data-mined',
  templateUrl: './add-data-mined.component.html',
  styleUrl: './add-data-mined.component.scss'
})
export class AddDataMinedComponent {
  formMiner!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  ID: any;
  isDisable = false;
  users: any;
  pqr:any;
  file!: File | undefined;
  Files: File[] = [];
  namesFiles: string[] = [];
  isFile = false;
  nameUser = "";
  observationFrom:any;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _fb: FormBuilder, private _serviceA: AccountService, private _redirect: Router,
    private _route: ActivatedRoute, private _serviceT: PqrsService, private _role: RoleService,
    public dialogRef: MatDialogRef<AddDataMinedComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.getPqr()

    },)
    this.reasigned();
    this.ID = Number(this._route.snapshot.paramMap.get("id"));
    console.log(this.ID);
    
    this.nameUser = this._role.getName();

    this.formMiner = this._fb.group({
      observations:[{value:'',disabled:true}],
      response:['']
      
    })

    
   
  }

  getPqr(){
    this._serviceT.getPqr(this.data.id).subscribe({
      next:(pqr:any)=>{
        this.pqr = pqr;
        console.log(this.pqr)
        this.getObservation(this.pqr);
      }
    })
  }
  
  getObservation(pqr:any){
    let area = this._serviceA.getArea();
    if(area.includes("facturacion")){
      this.formMiner.patchValue({
        observations: pqr.observationToMinerFac
      })
    }else if(area.includes("operacion")){
      
      this.formMiner.patchValue({
        observations: pqr.observationToMinerOp
      })

    }else if(area.includes("transporte")){
      this.formMiner.patchValue({
        observations: pqr.observationToMinerTs
      })

    }
  }

  getFile(event: any) {
    const file = event.target.files[0]; // Tomar el primer archivo seleccionado
    const allowedExtensions = [
      'application/pdf', // PDF
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
      'application/msword', // Word (.doc)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
      'application/vnd.ms-excel' // Excel (.xls)
  ];

    if (file) {
      const fileType = file.type; // Obtener el tipo MIME del archivo

      // Validar que el tipo de archivo esté permitido
      if (!allowedExtensions.includes(fileType)) {
        Swal.fire({
          icon: 'warning',
          title: 'Solo se permiten archivos PDF, DOCX o XLSX.'
        })
        event.target.value = ''; // Limpiar el input si el archivo no es válido
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
    data.append("id",this.data.id)
    data.append("ObservationFromMiner",this.formMiner.get('response')!.value)

    this.Files.forEach((file, index) => {
      data.append(`files`, file);
    });

    this._serviceT.addDataMiner(data).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon:'success',
          title: data.message,
          showConfirmButton: false,
          showCancelButton:false,
          showCloseButton:true
        })
      }
    })
    


  }
}
