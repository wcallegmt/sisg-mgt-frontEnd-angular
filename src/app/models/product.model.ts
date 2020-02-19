export class ProductModel {
    idProduct: number;
    // idCompany: number;
    nameProduct: string;
    category: string;
    descriptionProduct: string;
    havePatent: boolean;
    patentPercent: number;
    adquisitionDate: string;
    statusRegister: boolean;

    constructor() {
        this.idProduct = 0;
        // this.idCompany = 0;
        this.nameProduct = '';
        this.category = 'SPORTS';
        this.descriptionProduct = '';
        this.havePatent = false;
        this.patentPercent = 0.00;
        this.adquisitionDate = '';
        this.statusRegister = true;
    }
}
