export class PeriodOpen {
    dateOpen: Date;
    numeration: string;
    observation: string;

    constructor() {
        this.dateOpen = new Date();
        this.numeration = '';
        this.observation = '';
    }
}

export class PeriodClose {

    datePeriod: Date;
    countExpenses: number;
    totalExpenses: number;
    countUtilities: number;
    totalBrutoUtilities: number;
    observation: string;
    constructor() {
        this.datePeriod = new Date();
        this.countExpenses = 0;
        this.totalExpenses = 0;
        this.countUtilities = 0;
        this.totalBrutoUtilities = 0;
        this.observation = '';
    }
}