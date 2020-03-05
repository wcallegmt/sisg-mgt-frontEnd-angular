import { PersonModel } from './person.model';

export class EmployeeModel extends PersonModel {
    idEmployee: number;
    idCompany: number;
    idSede: number;
    idArea: number;

    // idTypeDocument: number;
    // idNationality: number;
    // document: string;
    // name: string;
    // surname: string;
    // email: string;
    // phone: string;
    // address: string;
    // sex: string;
    // dateBorn: string;

    nameUser: string;
    passwordUser: string;
    repeatPassword: string;
    statusRegister: boolean;
    role: string;

    constructor() {
        super();

        const today = new Date();
        const month = today.getMonth() < 9 ?  '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getMonth() < 10 ?  '0' + today.getDate() : today.getDate();

        this.idCompany = null;
        this.idSede = null;
        this.idArea = null;
        this.idTypeDocument = null;
        this.idNationality = '170';
        this.document = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.sex = 'M';
        this.dateBorn = `${ today.getFullYear() - 18 }-${ month }-${ day }`;
        this.nameUser = '';
        this.passwordUser = '';
        this.repeatPassword = '';
        this.statusRegister = true;
        this.role = '';
    }
}
