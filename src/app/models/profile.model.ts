export class ProfileModel {

    idTypeDocument: number;
    idNationality: number;
    nameNationality: string;
    document: string;
    name: string;
    surname: string;
    // nameComplete: string;
    email: string;
    phone: string;
    address: string;
    sex: string;
    dateBorn: string;

    nameUser: string;
    dateRegister: Date;

    constructor() {

        this.idTypeDocument = null;
        this.idNationality = 170;
        this.nameNationality = 'Sin especificar';
        this.document = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.sex = 'M';
        this.dateBorn = '';
        this.nameUser = '';
        this.dateRegister = new Date();

    }
}

export class ProfileInfoModel {
    aboutMe: string;
    facebook: string;
    instagram: string;
    google: string;
    languages: any[];
    constructor() {
        this.aboutMe = '';
        this.facebook = '';
        this.instagram = '';
        this.google = '';
        this.languages = [];
    }
}