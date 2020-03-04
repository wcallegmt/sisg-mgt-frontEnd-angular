import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paidOut'
})
export class PaidOutPipe implements PipeTransform {

  transform(paid: boolean): any {

    if (paid) {
      return 'Sí';
    }
    return 'No';
  }

}
