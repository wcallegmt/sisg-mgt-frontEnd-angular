export class AreaModel {
    idArea: number;
    idCompany: number;
    nameArea: string;
    description: string;
    statusRegister: boolean;

    constructor() {
        this.idArea = 0;
        this.idCompany = null;
        this.nameArea = '';
        this.description = '';
        this.statusRegister = true;
    }
}
