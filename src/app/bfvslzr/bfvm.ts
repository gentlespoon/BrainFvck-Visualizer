export class bfVm {
  
  constructor(bfCode) {
    this.bfCode = bfCode;
    this.instructions = this.prepare(this.bfCode); // syntax check
    this.delay = 50;
    this.init();
  }

  bfCode: string;
  status: number; // 1: running; 0: stopped; -1: error/stop/end;
  
  data: number[];
  instructions: string[];
  
  dataPointer: number;
  instructionPointer: number;
  
  currentLoopStart: number[]; // loop start tracking stack
  
  output: string;
  input: string;

  delay: number;

  init() {
    this.status = 0;
    this.data = (new Array(10)).fill(0); // initial dataStack size: 10, can be dynamically extended
    this.dataPointer = 0;
    this.instructionPointer = 0;
    this.currentLoopStart = [];
    this.output = '';
    this.input = '';
  }

  // syntax check, mainly for checking [] balancing
  //     striped down version of balanced parentheses check,
  //     from my https://github.com/gentlespoon/LeetCode-Solutions/blob/master/020_Valid-Parentheses.js
  prepare(bfCode: string) : string[] {
    // if empty bfCode
    if (!bfCode.length) return [];
    // tokenize
    var inst = [];
    var stack = [];
    for (let i of bfCode) {
      switch(i) {
        case '[':
          stack.push(i);
          inst.push(i);
          break;
        case ']':
          if (!stack.pop()) throw('Unbalanced []');
          inst.push(i);
          break;
        case '<':
        case '>':
        case '+':
        case '-':
        case ',':
        case '.':
          inst.push(i);
          break;
        default:
      }
    }
    if (stack.length) throw('Unbalanced []');
    return inst;
  }


  // next instruction
  next() {
    if (this.status !== 1) return;
    if (this.instructionPointer === this.instructions.length) {
      this.status = -1; return;
    }
    switch (this.instructions[this.instructionPointer]) {
      case '>': this.dataPointerRight(); break;
      case '<': this.dataPointerLeft(); break;
      case '+': this.dataIncrement(); break;
      case '-': this.dataDecrement(); break;
      case '[': this.loopStart(); break;
      case ']': this.loopEnd(); break;
      case '.': this.dataOutput(); break;
      case ',': this.dataInput(0); break;
      default:
        this.status = -1;
        alert('Unrecognized token ' + this.instructions[this.instructionPointer]);
    }
    this.instructionPointer++;
    console.log(this.dataPointer, this.instructionPointer, this.currentLoopStart);
    if (this.status === 1) {
      setTimeout(()=>{this.next()}, this.delay);
    }
  }


  // bf operators

  // ">"
  dataPointerRight() {
    this.dataPointer++;
    if (this.dataPointer === this.data.length) {
      this.data.push(0);
    }
  }
  // "<"
  dataPointerLeft() {
    if (this.dataPointer === 0) {
      this.status = -1;
      alert('Data Pointer moving out of bound!');
    }
    this.dataPointer--;
  }

  // "+"
  dataIncrement() {
    if (this.data[this.dataPointer] === 255) {
      alert('Overflowing data at address ' + this.dataPointer.toString(16) + '.');
      this.data[this.dataPointer]=-1;
    }
    this.data[this.dataPointer]++;
  }
  // "-"
  dataDecrement() {
    if (this.data[this.dataPointer] === 0) {
      alert('Underflowing data at address ' + this.dataPointer.toString(16) + '.');
      this.data[this.dataPointer]=256;
    }
    this.data[this.dataPointer]--;
  }

  // "."
  dataOutput() {
    this.output += String.fromCharCode(this.data[this.dataPointer]);
  }
  // ","
  dataInput(char: number) {
    if (!this.input.length) {
      // if nothing in input box, pause and wait for input.
      this.status = 0;
      // because when execution of this inst ends, iP will ++;
      // iP -- to re execute this inst.
      this.instructionPointer--;
      alert('Waiting for input');
    } else {
      let t = this.input.split('');
      this.data[this.dataPointer] = t[0].charCodeAt(0);
      delete(t[0]);
      this.input = t.join('');
    }
  }

  // "["
  loopStart() {
    if (this.data[this.dataPointer] === 0) {
      // jump to next ]
      this.instructionPointer = this.instructions.indexOf(']', this.instructionPointer);
    } else {
      // enter loop body
      this.currentLoopStart.push(this.instructionPointer); 
    }
  }
  // "]"
  loopEnd() {
    if (this.data[this.dataPointer] !== 0) {
      this.instructionPointer = this.currentLoopStart[this.currentLoopStart.length-1];
    } else {
      this.currentLoopStart.pop();
    }
  }




}
