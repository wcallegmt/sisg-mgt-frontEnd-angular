import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeSeller'
})
export class TypeSellerPipe implements PipeTransform {

  transform(value: string): any {
    let outStr = 'Sin especificar';
    switch (value) {
      case 'AG':
        outStr = 'Administrador grupo';
        break;
        case 'VV':
          outStr = 'Vendedor';
          break;
    
      default:
        outStr = 'Sin especificar';
        break;
    }

    return outStr;
  }

}
