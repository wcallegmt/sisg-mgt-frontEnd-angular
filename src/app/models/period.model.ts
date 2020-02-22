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
