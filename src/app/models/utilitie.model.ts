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

    totalBrutoUtilities: number;

    totalNetoPatent: number;

    totalIncomeTax: number;

    totalBrutoCompany: number;
    totalBrutoPartner: number;
    totalBrutoResponsable: number;

    totalNetoCompany: number;
    totalNetoPartner: number;
    totalNetoRepsonsable: number;

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

        this.totalBrutoUtilities = 0;
        this.totalNetoPatent = 0;
        this.totalIncomeTax = 0;

        this.totalBrutoCompany = 0;
        this.totalBrutoPartner = 0;
        this.totalBrutoResponsable = 0;

        this.totalNetoCompany = 0;
        this.totalNetoPartner = 0;
        this.totalNetoRepsonsable = 0;
    }

    // totalEgresos: number,
    onChangeUtilidadProducto(  index: number ): Promise<any> {

        return new Promise( (resolve) => {
            this.utilities[index].incomeTaxProduct = parseFloat( ( this.utilities[index].utilitieProduct * ( this.incomeTax / 100 ) ).toFixed(2)) ;
            this.utilities[index].uNetaPatent = parseFloat( ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentPatent / 100 ) ).toFixed(2) );
            // this.utilities[index].utilitieBrutaProduct = parseFloat( ( this.utilities[index].utilitie / ( (impuestoPorcentaje / 100 ) + 1 ) ).toFixed(2) );


            // console.log('comision responsable', this.utilities[index].percentResponsable);
            if (this.idResponsable !== 0) { // el socio tiene un responsable asignado

                if ((this.typeSeller.toUpperCase()) === 'AD') { // si es administrador de grupo
                    this.utilities[index].uBrutaResponsable = parseFloat( 
                        ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentResponsable / 100) 
                        ).toFixed(2) );
                } else {
                    this.utilities[index].uBrutaResponsable = parseFloat( (
                        ( (this.utilities[index].utilitieProduct - this.utilities[index].uNetaPatent)  * ( this.utilities[index].percentResponsable / 100 )  )
                        ).toFixed(2) );
                }
                console.log('uti bruta responsable', this.utilities[index].uBrutaResponsable);
            }

            this.utilities[index].utilitieBrutaProduct = parseFloat( ( this.utilities[index].utilitieProduct - (  this.utilities[index].uNetaPatent + this.utilities[index].uBrutaResponsable ) ).toFixed(2) );
            this.utilities[index].utilitieNetaProduct = this.utilities[index].utilitieBrutaProduct;
            // this.utilities[index].utilitieNetaProduct = parseFloat( ( this.utilities[index].utilitieBrutaProduct - (this.utilities[index].uNetaPatent + this.utilities[index].uBrutaResponsable) ).toFixed(2) ) ;

            this.utilities[index].inBrutaCompany = parseFloat( ( ( this.utilities[index].utilitieProduct *  ( this.utilities[index].percentCompany / 100 ) ) ).toFixed(2) );
            this.utilities[index].inBrutaPartner = parseFloat( ( ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentPartner / 100 ) )  ).toFixed(2) );

            this.utilities[index].uBrutaCompany = parseFloat( ( ( this.utilities[index].utilitieBrutaProduct *  ( this.utilities[index].percentCompany / 100 ) ) ).toFixed(2) );
            this.utilities[index].uBrutaPartner = parseFloat( (  this.utilities[index].inBrutaPartner - this.utilities[index].incomeTaxProduct ).toFixed(2) );

            this.utilities[index].uNetaCompany = this.utilities[index].uBrutaCompany;
            this.utilities[index].uNetaPartner = this.utilities[index].uBrutaPartner;

            this.utilities[index].uNetaResponsable = this.utilities[index].uBrutaResponsable;

            resolve({ok: true});
        });

    }

    public onCalculate() {
        console.log('calculando');
        let sumUtilities = 0;
        let sumPatent = 0;
        let sumIncomeTax = 0;

        let sumBrutaCompany = 0;
        let sumBrutaPartner = 0;
        let sumBrutaResponsable = 0;

        let sumUtiCompany = 0;
        let sumUtiPartner = 0;
        let sumUtiResponsbale = 0;

        for (const iterator of this.utilities) {
            sumUtilities += iterator.utilitieProduct;
            sumPatent += iterator.uNetaPatent;

            sumBrutaCompany += iterator.uBrutaCompany;
            sumBrutaPartner += iterator.uBrutaPartner;
            sumBrutaResponsable += iterator.uBrutaResponsable;

            sumIncomeTax += iterator.incomeTaxProduct;

            sumUtiCompany += iterator.uNetaCompany;
            sumUtiPartner += iterator.uNetaPartner;
            sumUtiResponsbale += iterator.uNetaResponsable;
        }

        this.totalBrutoUtilities = parseFloat((sumUtilities).toFixed(2));

        this.totalNetoPatent = parseFloat((sumPatent).toFixed(2));
        this.totalIncomeTax = parseFloat((sumIncomeTax).toFixed(2));

        this.totalBrutoCompany = parseFloat((sumBrutaCompany).toFixed(2));
        this.totalBrutoPartner = parseFloat((sumBrutaPartner).toFixed(2));
        this.totalBrutoResponsable = parseFloat((sumBrutaResponsable).toFixed(2));

        this.totalNetoCompany = parseFloat((sumUtiCompany).toFixed(2));
        this.totalNetoPartner = parseFloat((sumUtiPartner - this.totalExpense).toFixed(2));
        this.totalNetoRepsonsable = parseFloat((sumUtiResponsbale).toFixed(2));
    }
}

export class ComissionUtilidad {

    idProduct: number;
    nameProduct: string;
    utilitieProduct: number;
    utilitieBrutaProduct: number;
    utilitieNetaProduct: number;

    percentPartner: number;
    percentCompany: number;
    percentResponsable: number;
    percentPatent: number;

    inBrutaCompany: number;
    inBrutaPartner: number;

    uBrutaCompany: number;
    uBrutaPartner: number;
    uBrutaResponsable: number;

    uNetaPatent: number;
    uNetaCompany: number;
    uNetaPartner: number;
    uNetaResponsable: number;

    uNetaNoTax: number;

    incomeTaxProduct: number;

    constructor( idProduct: number, nameProduct: string, percentPartner: number, percentCompany: number, percentResponsable: number, percentPatent: number) {

        this.idProduct = idProduct;
        this.nameProduct = nameProduct;

        this.utilitieProduct = 0;
        this.utilitieBrutaProduct = 0;
        this.utilitieNetaProduct = 0;

        this.percentPatent = percentPatent;
        this.percentPartner = percentPartner;
        this.percentCompany = percentCompany;
        this.percentResponsable = percentResponsable;

        this.inBrutaCompany = 0;
        this.inBrutaPartner = 0;

        this.uBrutaCompany = 0;
        this.uBrutaPartner = 0;
        this.uBrutaResponsable = 0;

        this.uNetaPatent = 0;
        this.uNetaCompany = 0;
        this.uNetaPartner = 0;
        this.uNetaResponsable = 0;

        this.incomeTaxProduct = 0;
    }
    
}
