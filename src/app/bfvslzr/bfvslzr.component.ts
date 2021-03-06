import { Component, OnInit } from '@angular/core';
import { bfVm } from './bfvm';

@Component({
  selector: 'app-bfvslzr',
  templateUrl: './bfvslzr.component.html',
  styleUrls: ['./bfvslzr.component.css']
})
export class BfvslzrComponent implements OnInit {

  bfCode = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';

  vm: bfVm;

  initialize() {
    this.vm = new bfVm(this.bfCode);
  }

  start() {
    this.vm.init();
    this.vm.status = 1;
    this.vm.next();
  }

  pause() {
    switch (this.vm.status) {
      case 0:
        this.vm.status = 1;
        this.vm.next();
        break;
      case 1:
        this.vm.status = 0; 
    }
  }

  stop() {
    this.vm.status = -1;
  }


  constructor() { }

  ngOnInit() {
    this.initialize();
  }

}
