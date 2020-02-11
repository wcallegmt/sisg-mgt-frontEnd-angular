export class PartnerModel {
    idPartner: number;
    idResponsable: number;
    idTypeDocument: number;
    idNationality: string;
    directToCompany: string;
    allowBussiness: string;
    document: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    sex: string;
    dateBorn: string;
    nameUser: string;
    passwordUser: string;
    repeatPassword: string;
    statusRegister: boolean;

    constructor() {
        this.idPartner = 0;
        this.idResponsable = null;
        this.idTypeDocument = 1;
        this.idNationality = '170';
        this.directToCompany = 'true';
        this.allowBussiness = 'true';
        this.document = '';
        this.name = '';
        this.surname = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.sex = 'M';
        this.dateBorn = '';
        this.nameUser = '';
        this.passwordUser = '';
        this.repeatPassword = '';
        this.statusRegister = true;
    }
}
