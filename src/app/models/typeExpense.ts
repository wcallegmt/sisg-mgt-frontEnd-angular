export class TypeExpenseModel {

    idTypeExpense: number;
    name: string;
    description: string;
    statusRegister: boolean;

    constructor() {

        this.idTypeExpense = 0;
        this.name = '';
        this.description = '';
        this.statusRegister = true;

    }
}
