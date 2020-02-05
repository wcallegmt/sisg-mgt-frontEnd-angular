export class SedeModel {
    idSede: number;
    idCompany: number;
    nameSede: string;
    addressSede: string;
    statusRegister: boolean;
    constructor() {
        this.idSede = 0;
        this.idCompany = null;
        this.nameSede = '';
        this.addressSede = '';
        this.statusRegister = true;
    }
}
