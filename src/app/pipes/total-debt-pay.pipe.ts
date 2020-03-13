import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'totalDebPay'})

export class TotalDebPayPipe implements PipeTransform {

    transform(payments: any[], field: string): number {

        let totalDebt = 0;
        let totalPay = 0;

        payments.forEach( payment => {
            totalDebt += payment.deuda || 0;
            totalPay += payment.montoPagar || 0;
        });

        if (field === 'debt') {
            return totalDebt;
        }
        
        return totalPay;
    }
}