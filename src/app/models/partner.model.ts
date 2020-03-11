import { PersonModel } from './person.model';

export class PartnerModel extends PersonModel {
    idPartner: number;
    idResponsable: number;

    directToCompany: string;
    allowBussiness: string;

    nameUser: string;
    passwordUser: string;
    repeatPassword: string;
    statusRegister: boolean;


    constructor() {
        super(); // super es el llamado al contructor de la clase padre

        const today = new Date();
        const month = today.getMonth() < 9 ?  '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getMonth() < 10 ?  '0' + today.getDate() : today.getDate();

        this.idPartner = 0;
        this.idResponsable = null;
        this.idTypeDocument = '1';
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
        this.dateBorn = `${ today.getFullYear() - 18 }-${ month }-${ day }`;
        this.nameUser = '';
        this.passwordUser = '';
        this.repeatPassword = '';
        this.statusRegister = true;
    }
}
