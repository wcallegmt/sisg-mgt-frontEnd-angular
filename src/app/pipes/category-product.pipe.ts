import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryProduct'
})
export class CategoryProductPipe implements PipeTransform {

  transform(value: string): any {
    let category = 'Deportivas';
    switch (value) {
      case 'SPORTS':
        category = 'Deportivas';
        break;
        case 'LOTTERY':
          category = 'Lotería';
          break;
        case 'CASINO':
          category = 'Casino';
          break;
        case 'VIRTUAL':
          category = 'Virtual';
          break;

      default:
        category = 'No especificado';
        break;
    }
    return category;
  }

}
