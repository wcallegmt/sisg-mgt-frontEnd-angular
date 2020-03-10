import { IngDate } from '../interfaces/ngDate.interface';
export class NgDateModel {

    year: number;
    month: number;
    day: number;

    constructor( objDate: IngDate ) {
        this.year = objDate.year;
        this.month = objDate.month;
        this.day = objDate.day;
    }

}
