
export class BranchOfficeModel {

    idBranchOffice: number;
    nameBranch: string;
    addressBranch: string;
    ubigeo: string;
    department: string;
    province: string;
    distrit: string;
    latitude: number;
    longitude: number;
    width: number;
    height: number;
    large: number;
    idPartner: number;
    namePartner: string;
    typeBranch: string;
    categorie: string;
    comission: ComisionPartnerModel[];
    statusRegister: boolean;

    constructor() {
        this.idBranchOffice = 0;
        this.nameBranch = '';
        this.addressBranch = '';
        this.ubigeo = '';
        this.department = '';
        this.province = '';
        this.distrit = '';
        this.latitude = -12.04670;
        this.longitude = -77.03220;
        this.width = 0;
        this.height = 0;
        this.large = 0;
        this.idPartner = null;
        this.typeBranch = 'BETHOUSE';
        this.categorie = 'A';
        this.namePartner = '';
        this.comission = [];
        this.statusRegister = true;
    }
}

export class ComisionPartnerModel {
    idComisionPartner: number;
    idProduct: number;
    percentPartner: number;
    percentCompany: number;
    percentResponsable: number;

    constructor() {
        this.idComisionPartner = 0;
        this.idProduct = null;
        this.percentPartner = 0.00;
        this.percentCompany = 0.00;
        this.percentResponsable = 0.00;
    }
}
