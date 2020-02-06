import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'havePatent'
})
export class HavePatentPipe implements PipeTransform {

  transform(value: boolean): any {
    return value ? 'Sí' : 'No';
  }

}
