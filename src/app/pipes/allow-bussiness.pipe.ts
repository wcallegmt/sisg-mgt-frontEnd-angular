import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allowBussiness'
})
export class AllowBussinessPipe implements PipeTransform {

  transform(value: number): any {
    let strAllow = 'No';
    switch (value) {
      case 1:
        strAllow = 'Sí';
        break;
        case 0:
          strAllow = 'No';
          break;
    
      default:
        strAllow = 'No';
        break;
    }
    return strAllow;
  }

}
