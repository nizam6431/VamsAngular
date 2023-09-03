import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCell'
})
export class FormatCellPipe implements PipeTransform {

  transform(phoneNumberString: any): any {
    var cell = phoneNumberString.split(" ")
    var cleaned = ('' + cell[1]).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{0,3})(\d*)$/);
    if (match) {
      var cellNumber = '(' + match[1] + ') ' + match[2] + (match[3] ? '-' + match[3] : "");
      return `${cell[0]} ${cellNumber}`
    }
    else {
      return phoneNumberString
    }
  }

}
