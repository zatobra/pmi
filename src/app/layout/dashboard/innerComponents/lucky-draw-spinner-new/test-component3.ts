import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'tes-app3',
  templateUrl: './test-component3.html',
  styleUrls: [ './test-component3.scss' ],
  animations: [
    trigger('curtainReveal', [
      state('hidden', style({
        width: '0',
      })),
      state('visible', style({
        width: '100%',
      })),
      transition('hidden => visible', [
        animate('1s ease-in-out')
      ]),
    ]),
  ]
})
export class TestComponent3 {

isRevealed: boolean = false;

revealCurtain() {
  this.isRevealed = true;
}

 
}
