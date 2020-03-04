export class PaymentUtilitieModel {

    idPaymentUtilitie: number;
    idResponsable: number;
    idPartner: number;
    idOfficeBranch: number;

    idUtilitie: number;
    numerationUtilitie: string;

    paymentyType: string;
    debt: number;
    idBank: number;
    amountPayable: number;
    dateOperation: string;
    numberOperation: string;
    observation: string;

    constructor() {
        const today = new Date();

        this.idPaymentUtilitie = 0;
        this.idResponsable = null;
        this.idPartner = null;
        this.idOfficeBranch = null;

        this.idUtilitie = 0;
        this.numerationUtilitie = '000-0000';
        this.paymentyType = 'UE';
        this.debt = 0.00;
        this.idBank = null;
        this.amountPayable = 0.00;
        this.dateOperation = `${today.getFullYear()}-${today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`;
        this.numberOperation = '';
        this.observation = '';
        // console.log(this.dateOperation);
    }
}