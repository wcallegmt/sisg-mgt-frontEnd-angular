export class UtilitieModel {

    idUtilitie: number;
    idPartner: number;
    idOfficeBranch: number;

    idResponsable: number;
    responsable: string;
    typeSeller: string;

    totalExpense: number;
    expenseForProduct: number;

    incomeTax: number;
    idPeriod: number;
    utilities: ComissionUtilidad[];

    totalUtilities: number;
    totalPatent: number;
    totalIncomeTax: number;

    totalCompany: number;
    totalPartner: number;
    totalRepsonsable: number;

    constructor() {
        this.idUtilitie = 0;
        this.idPartner = null;
        this.idOfficeBranch = null;

        this.idResponsable = 0;
        this.responsable = '';

        this.totalExpense = 0;
        this.expenseForProduct = 0;

        this.incomeTax = 0;
        this.idPeriod = 0;
        this.utilities = [];

        this.totalUtilities = 0;
        this.totalPatent = 0;
        this.totalIncomeTax = 0;

        this.totalCompany = 0;
        this.totalPartner = 0;
        this.totalRepsonsable = 0;
    }

    public onCalculate() {
        let sumUtilities = 0;
        let sumPatent = 0;
        let sumIncomeTax = 0;

        let sumUtiCompany = 0;
        let sumUtiPartner = 0;
        let sumUtiResponsbale = 0;

        for (const iterator of this.utilities) {
            sumUtilities += iterator.utilitie;
            sumPatent += iterator.uNetaPatent;
            sumIncomeTax += iterator.impuestoRenta;

            sumUtiCompany += iterator.uNetaCompany;
            sumUtiPartner += iterator.uNetaPartner;
            sumUtiResponsbale += iterator.uNetaResponsable;

        }

        this.totalUtilities = sumUtilities;
        this.totalPatent = sumPatent;
        this.totalIncomeTax = sumIncomeTax;

        this.totalCompany = sumUtiCompany;
        this.totalPartner = sumUtiPartner;
        this.totalRepsonsable = sumUtiResponsbale;
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
    // totalEgresos: number,
    onChangeUtilidadProducto(  egresoProducto: number, impuestoPorcentaje: number , idResponsable: number, typeSeller = '') {
        this.uNetaPatent = parseFloat( ( this.utilitie * ( this.percentPatent / 100) ).toFixed(2) );

        if (idResponsable !== 0) { // el socio tiene un responsable asignado

            if ((typeSeller.toUpperCase()) === 'AD') { // si es administrador de grupo
                this.uNetaResponsable = parseFloat( ( this.utilitie * ( this.percentResponsable / 100) ).toFixed(2) );
            } else {
                this.uNetaResponsable = parseFloat( ( (this.utilitie - this.uNetaPatent) * ( this.percentResponsable / 100 ) ).toFixed(2) );
            }
        }

        this.uNetaCompany = parseFloat( ( this.utilitie *  (this.percentCompany / 100 )  ).toFixed(2) );

        this.uBrutaPartner = parseFloat( ( (this.utilitie * (  this.percentPartner / 100 ) )  - this.uNetaPatent ).toFixed(2) );

        this.uNetaNoTax = parseFloat( ( this.uBrutaPartner - egresoProducto ).toFixed(2) );

        this.impuestoRenta = parseFloat( (this.uNetaNoTax * (impuestoPorcentaje / 100) ).toFixed(2)) ;

        this.uNetaPartner = parseFloat( (this.uNetaNoTax - this.impuestoRenta).toFixed(2) ) ;

        console.log(this.utilitie);
    }
}
