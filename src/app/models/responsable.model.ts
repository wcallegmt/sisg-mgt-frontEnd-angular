import { PersonModel } from './person.model';

export class ResponsableModel extends PersonModel {
    idResponsable: number;

    // idTypeDocument: number;
    // idNationality: string;
    // typeSeller: string;
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
    comision: ComisionResponsableModel[];

    constructor() {
        super();

        const today = new Date();
        const month = today.getMonth() < 9 ?  '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getMonth() < 10 ?  '0' + today.getDate() : today.getDate();

        this.idResponsable = 0;
        this.idTypeDocument = 1;
        this.idNationality = '170';
        this.typeSeller = '';
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
        this.comision = [];
    }
}

export class ComisionResponsableModel {
    idComisionResponsable: number;
    idProduct: number;
    percentComision: number;

    constructor() {
        this.idComisionResponsable = 0;
        this.idProduct = null;
        this.percentComision = 0.00;
    }
}
