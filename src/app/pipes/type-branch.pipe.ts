import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeBranch'
})
export class TypeBranchPipe implements PipeTransform {

  transform(value: string): any {
    let outStr = 'Casa de apuesta';
    switch (value) {
      case 'POINTSALE':
        outStr = 'Punto de venta';
        break;
        case 'BETHOUSE':
          outStr = 'Casa de apuesta';
          break;
    
      default:
        outStr = 'Sin especificar';
        break;
    }

    return outStr;
  }

}
