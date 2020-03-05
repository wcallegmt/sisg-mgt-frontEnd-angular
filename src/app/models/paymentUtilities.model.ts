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

    totalUtilitie: number;
    totalPayed: number;
    period: string;
    isPayed: boolean;

    constructor() {
        const today = new Date();
        const month = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

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
        this.dateOperation = `${ today.getFullYear() }-${ month }-${ day }`;
        this.numberOperation = '';
        this.observation = '';
        this.totalUtilitie = 0;
        this.totalPayed = 0;
        this.period = 'MES-AÑO';
        this.isPayed = false;
        // console.log(this.dateOperation);
    }
}