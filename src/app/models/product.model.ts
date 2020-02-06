export class ProductModel {
    idProduct: number;
    // idCompany: number;
    nameProduct: string;
    descriptionProduct: string;
    havePatent: boolean;
    patentPercent: number;
    adquisitionDate: string;
    statusRegister: boolean;

    constructor() {
        this.idProduct = 0;
        // this.idCompany = 0;
        this.nameProduct = '';
        this.descriptionProduct = '';
        this.havePatent = false;
        this.patentPercent = 0.00;
        this.adquisitionDate = '';
        this.statusRegister = true;
    }
}
