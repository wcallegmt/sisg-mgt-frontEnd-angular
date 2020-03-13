import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform( value: string ): any {
    if (value === 'M') {
      return 'Masculino';
    } else if (value === 'F') {
      return 'Femenino';
    }
    return 'Otro';
  }

}
