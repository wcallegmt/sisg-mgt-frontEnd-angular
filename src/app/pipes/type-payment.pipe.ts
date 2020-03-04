import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typePayment'
})
export class TypePaymentPipe implements PipeTransform {

  transform(value: string): any {
    if (value === 'UE') {
      return 'Utilidad empresa';
    }
    return 'Ingreso producto';
  }

}
