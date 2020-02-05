export class UserModel {
    idEmployee: number;
    idCompany: number;
    idSede: number;
    idArea: number;
    idTypeDocument: number;
    idNationality: number;
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
    role: string;

    constructor() {
        this.idCompany = null;
        this.idSede = null;
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
        this.statusRegister = true;
        this.role = '';
    }
}
