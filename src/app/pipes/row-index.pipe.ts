import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rowIndex'
})
export class RowIndexPipe implements PipeTransform {

  transform(arrData: any[], page: number, limit: number = 5): any {
    let i = (page - 1) * limit;

    for (const key in arrData) {
      if (arrData.hasOwnProperty(key)) {
        arrData[key].rowIndex = i + 1;
        i ++ ;
      }
    }
    return arrData;
  }

}
