import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'directCompany'
})
export class DirectCompanyPipe implements PipeTransform {

  transform( value: number ): any {
    let strDirect = 'No';
    switch (value) {
      case 1:
        strDirect = 'Sí';
        break;
        case 0:
          strDirect = 'No';
          break;
    
      default:
        strDirect = 'No';
        break;
    }
    return strDirect;
  }

}
