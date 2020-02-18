export class ExpenseModel {

    idExpense: number;
    idPartner: number;
    idBranchOffice: number;
    idMoney: string;
    idTypeVoucher: number;
    idTypeExpense: number;
    dateEmission: string;
    observation: string;
    totalExpense: number;
    statusRegister: boolean;
    constructor() {
        this.idExpense = 0;
        this.idPartner = null;
        this.idBranchOffice = null;
        this.idMoney = '1';
        this.idTypeVoucher = null;
        this.idTypeExpense = null;
        this.dateEmission = '';
        this.observation = '';
        this.totalExpense = 0;
        this.statusRegister = true;
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
