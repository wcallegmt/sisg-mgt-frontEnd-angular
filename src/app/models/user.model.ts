export class UserModel {
    idEmployee: number;
    idCompany: number;
    idArea: number;
    idTypeDocument: number;
    idNationality: number;
    document: string;
    email: string;
    phone: string;
    address: string;
    sex: string;
    dateBorn: string;
    nameUser: string;
    passwordUser: string;
    repeatPassword: string;
    role: string;

    constructor() {
        this.idCompany = null;
        this.idArea = null;
        this.idTypeDocument = null;
        this.idNationality = 170;
        this.document = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.sex = 'M';
        this.dateBorn = '';
        this.nameUser = '';
        this.passwordUser = '';
        this.repeatPassword = '';
        this.role = '';
    }
}
