import { Component } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss'
})
export class TestsComponent {
  isPlaying = false;

  ready(){
    if(this.isPlaying){
      this.isPlaying = false
    }else{
      this.isPlaying = true
    }
  }
}
