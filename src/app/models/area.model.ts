export class AreaModel {
    idArea: number;
    idCompany: number;
    nameArea: string;
    statusRegister: boolean;

    constructor() {
        this.idArea = 0;
        this.idCompany = null;
        this.nameArea = '';
        this.statusRegister = true;
    }
}
