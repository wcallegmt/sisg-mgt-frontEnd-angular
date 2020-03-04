import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumUtilitie'
})
export class SumUtilitiePipe implements PipeTransform {

  transform(details: any[], paymentType: string): any {
    
    let total = 0;
    for (const detail of details) {

      if (paymentType === 'UE') {
        total += detail.uBrutaEmpresa || 0;
      } else if (paymentType === 'IP') {
        total += detail.utilidadProducto || 0;
      }

    }
    return total;
  }

}
