import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting: boolean = false;

  constructor(
    private router: Router
  ) { }

  printPass() {
    this.isPrinting = true;
    this.router.navigate(['print-pass'], { queryParams: { print: true } });
    // this.router.navigate(['print-pass', { outlets: { 'print': ['print'] } }]);
  }

  readyToPrint() {

    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null }}]);
    });
    // window.print();
    // this.isPrinting = false;
    // this.router.navigate([{ outlets: { print: null } }]);
  }
}
