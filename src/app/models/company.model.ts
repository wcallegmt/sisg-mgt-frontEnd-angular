export class CompanyModel {

    idCompany: number;
    document: string;
    bussinessName: string;
    tradeName: string;
    address: string;
    legalRepresentative: string;
    idNationality: number;
    email: string;
    phone: string;
    statusRegister: boolean;

    constructor() {
        this.idCompany = 0;
        this.document = '';
        this.bussinessName = '';
        this.tradeName = '';
        this.address = '';
        this.legalRepresentative = '';
        this.idNationality = 0;
        this.email = '';
        this.phone = '';
        this.statusRegister = true;
    }
}
