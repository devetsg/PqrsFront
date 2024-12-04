import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-minner',
  templateUrl: './select-minner.component.html',
  styleUrl: './select-minner.component.scss'
})
export class SelectMinnerComponent {
  isMinerOp:boolean = false;
  isMinerTs:boolean = false;
  isMinerFac:boolean = false;
  formMinner:FormGroup;

  constructor(private _fb:FormBuilder,private _serviceP:PqrsService,public dialogRef: MatDialogRef<SelectMinnerComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any){
    this.formMinner = _fb.group({
      isMinerOp: [false],
      isMinerTs: [false],
      isMinerFac: [false],
      observationOp: [''],
      observationTs: [''],
      observationFac: [''],

    })
  }

  onCheckboxChangeMiner(event: MatCheckboxChange,type:string) {
    if(event.checked){
      if (type == "minerOp") {
        this.isMinerOp = true;  
      } else if( type == "minerFac" ){
        this.isMinerFac = true;    
      } else if( type == "minerTs" ){
        this.isMinerTs = true;    
      }
    }else{
      if (type == "minerOp") {
        this.isMinerOp = false;  
        this.formMinner.patchValue({
          observationOp: '',
        })
      } else if( type == "minerFac" ){
        this.isMinerFac = false;    
        this.formMinner.patchValue({
          observationFac: '',         
        })
      } else if( type == "minerTs" ){
        this.isMinerTs = false;    
        this.formMinner.patchValue({
          observationTs: '',        
        })
      }
    }
  }

  submit(){
    let data = new FormData();
    data.append("isMinerOp", this.formMinner.get("isMinerOp")!.value);
    data.append("isMinerTs", this.formMinner.get("isMinerTs")!.value);
    data.append("isMinerFac", this.formMinner.get("isMinerFac")!.value);

    data.append("observationOp", this.formMinner.get("observationOp")!.value);
    data.append("observationTs", this.formMinner.get("observationTs")!.value);
    data.append("observationFac", this.formMinner.get("observationFac")!.value);
    data.append("id", this.data.id);

    this._serviceP.sendToMiner(data).subscribe({
      next:(data:any)=>{
        Swal.fire({
          icon:'success',
          title: data.message,
          showCancelButton: false,
          showConfirmButton:false,
          showCloseButton:true,
          allowOutsideClick:false
        }).then((result)=> {
          if(result.dismiss){
            this.dialogRef.close()
          }
        })

        
      }
    })
  }
}
