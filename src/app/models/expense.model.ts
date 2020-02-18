export class ExpenseModel {

    idExpense: number;
    idPartner: number;
    idBranchOffice: number;
    idMoney: number;
    idTypeVoucher: number;
    dateEmission: string;
    observation: string;
    totalExpense: number;

    detailExpense: DetailExpenseModel[];

    constructor() {
        this.idExpense = 0;
        this.idPartner = 1;
        this.idBranchOffice = 0;
        this.idMoney = 1;
        this.idTypeVoucher = 0;
        this.dateEmission = '';
        this.observation = '';
        this.totalExpense = 0;

        this.detailExpense = [];

    }

    onCalculate() {
        let sum = 0;
        for (const iterator of this.detailExpense) {
            sum += iterator.totalDetail || 0;
        }
        this.totalExpense = sum;
    }
}

export class DetailExpenseModel {

    idDetailExpense: number;
    idTypeExpense: number;
    totalDetail: number;

    constructor() {
        this.idDetailExpense = 0;
        this.idTypeExpense = null;
        this.totalDetail = 0.00;
    }
}
