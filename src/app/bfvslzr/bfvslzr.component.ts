import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bfvslzr',
  templateUrl: './bfvslzr.component.html',
  styleUrls: ['./bfvslzr.component.css']
})
export class BfvslzrComponent implements OnInit {

  bfCode = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
  stepDelay = 600;

  running = false;

  data: number[];
  instructions: string[];

  instPtr: 0; // instruction pointer = 0
  dataPtr: 0; // data pointer = 0

  initialize() {
    this.running = false;
    this.instructions = this.bfCode.split('');
    console.log(this.instructions);
    this.data = (new Array(10)).fill(0);
    this.instPtr = 0;
    this.dataPtr = 0;
  }

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

}
