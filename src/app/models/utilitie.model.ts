export class UtilitieModel {

    idUtilitie: number;
    idPartner: number;
    idOfficeBranch: number;

    idResponsable: number;
    responsable: string;
    typeSeller: string;

    totalExpense: number;
    incomeTax: number;
    idPeriod: number;
    utilities: ComissionUtilidad[];

    constructor() {
        this.idUtilitie = 0;
        this.idPartner = null;
        this.idOfficeBranch = null;

        this.idResponsable = 0;
        this.responsable = '';

        this.totalExpense = 0;
        this.incomeTax = 0;
        this.idPeriod = 0;
        this.utilities = [];
    }
}

export class ComissionUtilidad {

    idProduct: number;
    nameProduct: string;

    percentPartner: number;
    percentCompany: number;
    percentResponsable: number;
    percentPatent: number;

    uNetaPatent: number;
    uNetaCompany: number;
    uNetaPartner: number;
    uBrutaPartner: number;
    uNetaResponsable: number;

    utilitie: number;
    uNetaNoTax: number;

    impuestoRenta: number;

    constructor( idProduct: number, nameProduct: string, percentPartner: number,
                 percentCompany: number, percentResponsable: number, percentPatent: number) {

        this.idProduct = idProduct;

        this.nameProduct = nameProduct;
        this.percentPartner = percentPartner;
        this.percentCompany = percentCompany;
        this.percentResponsable = percentResponsable;
        this.percentPatent = percentPatent;

        this.uNetaPatent = 0;
        this.uNetaCompany = 0;
        this.uNetaPartner = 0;
        this.uBrutaPartner = 0;
        this.uNetaResponsable = 0;

        this.utilitie = 0;
        this.uNetaNoTax = 0;

        this.impuestoRenta = 0;

    }

    onChangeUtilidadProducto( totalEgresos: number, impuestoPorcentaje: number , idResponsable: number, typeSeller = '') {
        this.uNetaPatent = this.utilitie * ( parseFloat( (this.percentPatent / 100).toFixed(2) ) );

        if (idResponsable !== 0) { // el socio tiene un responsable asignado

            if ((typeSeller.toUpperCase()) === 'AD') { // si es administrador de grupo
                this.uNetaResponsable = this.utilitie * ( parseFloat( (this.percentResponsable / 100).toFixed(2) ) );
            } else {
                this.uNetaResponsable = (this.utilitie - this.uNetaPatent) * ( parseFloat( (this.percentResponsable / 100).toFixed(2) ) );
            }
        }

        this.uNetaCompany = this.utilitie * (  parseFloat( (this.percentCompany / 100).toFixed(2) )  );

        this.uBrutaPartner = (this.utilitie * (  this.percentPartner / 100 ) )  - this.uNetaPatent;

        this.uNetaNoTax = this.uBrutaPartner - totalEgresos;

        this.impuestoRenta = parseFloat( (this.uNetaNoTax * (impuestoPorcentaje / 100) ).toFixed(2)) ;

        this.uNetaPartner = this.uNetaNoTax - this.impuestoRenta;

        console.log(this.utilitie);
    }
}
