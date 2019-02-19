export class bfVm {
  
  constructor(bfCode) {
    this.bfCode = bfCode;
    this.instructions = this.prepare(this.bfCode); // syntax check
    this.delay = 500;
    this.init();
  }

  bfCode: string;
  status: number; // 1: running; 0: stopped; -1: error;
  
  data: number[];
  instructions: string[];
  
  dataPointer: number;
  instructionPointer: number;
  
  currentLoopStart: number[]; // loop start tracking stack
  
  output: string;

  delay: number;

  init() {
    this.status = 0;
    this.data = (new Array(10)).fill(0); // initial dataStack size: 10, can be dynamically extended
    this.dataPointer = 0;
    this.instructionPointer = 0;
    this.currentLoopStart = [];
    this.output = '';
  }

  // syntax check, mainly for checking [] balancing
  //     striped down version of balanced parentheses check,
  //     from my https://github.com/gentlespoon/LeetCode-Solutions/blob/master/020_Valid-Parentheses.js
  prepare(bfCode: string) : string[] {
    // if empty bfCode
    if (!bfCode.length) return [];
    // tokenize
    var inst = bfCode.split('');
    var stack = [];
    for (let i of inst) {
      if (i==='[') stack.push(i);
      else if (i===']') {
        if (!stack.pop()) throw('Unbalanced []');
      }
    }
    if (stack.length) throw('Unbalanced []');
    return inst;
  }


  // next instruction
  next() {
    if (this.status !== 1) return;
    console.log(this.instructions[this.instructionPointer]);
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
        throw 'Unrecognized token ' + this.instructions[this.instructionPointer];
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
      throw('Data Pointer moving out of bound!');
    }
    this.dataPointer--;
  }

  // "+"
  dataIncrement() {
    if (this.data[this.dataPointer] === 255) {
      console.warn('Overflowing data at address ' + this.dataPointer.toString(16) + '.');
    }
    this.data[this.dataPointer]++;
  }
  // "-"
  dataDecrement() {
    if (this.data[this.dataPointer] === 0) {
      console.warn('Underflowing data at address ' + this.dataPointer.toString(16) + '.');
    }
    this.data[this.dataPointer]--;
  }

  // "."
  dataOutput() {
    this.output += this.data[this.dataPointer];
  }
  // ","
  dataInput(char: number) {
    this.data[this.dataPointer] = char;
  }

  // "["
  loopStart() {
    this.currentLoopStart.push(this.instructionPointer); 
    if (this.data[this.dataPointer] === 0) {
      // jump to next ]
      this.instructionPointer = this.instructions.indexOf(']', this.instructionPointer);
    }
  }
  // "]"
  loopEnd() {
    if (this.data[this.dataPointer] !== 0) {
      this.instructionPointer = this.currentLoopStart[this.currentLoopStart.length-1];
    } else {
      this.instructionPointer = this.currentLoopStart.pop();
    }
  }




}
