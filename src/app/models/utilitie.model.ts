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
    totalIncomeTax: number;

    totalBrutoPatent: number;
    totalBrutoCompany: number;
    totalBrutoPartner: number;
    totalBrutoResponsable: number;

    totalNetoNoTax: number;

    totalNetoPatent: number;
    totalNetoCompany: number;
    totalNetoPartner: number;
    totalNetoRepsonsable: number;

    statusRegister: boolean;

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

        this.totalNetoNoTax = 0;

        this.totalBrutoPatent = 0;
        this.totalBrutoCompany = 0;
        this.totalBrutoPartner = 0;
        this.totalBrutoResponsable = 0;

        this.totalNetoCompany = 0;
        this.totalNetoPartner = 0;
        this.totalNetoRepsonsable = 0;
        this.statusRegister = true;
    }

    // totalEgresos: number,
    onChangeUtilidadProducto(  index: number ): Promise<any> {

        return new Promise( (resolve) => {
            this.utilities[index].incomeTaxProduct = parseFloat( ( this.utilities[index].utilitieProduct * ( this.incomeTax / 100 ) ).toFixed(2)) ;
            this.utilities[index].uBrutaPatent = parseFloat( ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentPatent / 100 ) ).toFixed(2) );

            if (this.idResponsable !== 0) { // el socio tiene un responsable asignado
                console.log(this.typeSeller.toUpperCase());
                if ((this.typeSeller.toUpperCase()) === 'AG') { // si es administrador de grupo
                    this.utilities[index].uBrutaResponsable = parseFloat( ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentResponsable / 100)
                        ).toFixed(2) );
                } else {
                    this.utilities[index].uBrutaResponsable = parseFloat( (
                        ( (this.utilities[index].utilitieProduct - this.utilities[index].uBrutaPatent)  * ( this.utilities[index].percentResponsable / 100 )  )
                        ).toFixed(2) );
                }
                console.log('uti bruta responsable', this.utilities[index].uBrutaResponsable);
            }

            this.utilities[index].utilitieBrutaProduct = parseFloat( ( this.utilities[index].utilitieProduct - (  this.utilities[index].uBrutaPatent + this.utilities[index].uBrutaResponsable ) ).toFixed(2) );

            this.utilities[index].inBrutaCompany = parseFloat( ( ( this.utilities[index].utilitieProduct *  ( this.utilities[index].percentCompany / 100 ) ) ).toFixed(2) );
            this.utilities[index].inBrutaPartner = parseFloat( ( ( this.utilities[index].utilitieProduct * ( this.utilities[index].percentPartner / 100 ) )  ).toFixed(2) );

            this.utilities[index].uBrutaCompany = parseFloat( ( ( this.utilities[index].utilitieBrutaProduct *  ( this.utilities[index].percentCompany / 100 ) ) ).toFixed(2) );
            this.utilities[index].uBrutaPartner = parseFloat( (  this.utilities[index].inBrutaPartner - this.utilities[index].incomeTaxProduct ).toFixed(2) );

            resolve({ok: true});
        });

    }

    public onCalculate() {
        let sumUtilities = 0;
        let sumIncomeTax = 0;

        let sumBrutaPatent = 0;
        let sumBrutaCompany = 0;
        let sumBrutaPartner = 0;
        let sumBrutaResponsable = 0;

        for (const iterator of this.utilities) {
            sumUtilities += iterator.utilitieProduct;

            sumBrutaPatent += iterator.uBrutaPatent;
            sumBrutaCompany += iterator.uBrutaCompany;
            sumBrutaPartner += iterator.uBrutaPartner;
            sumBrutaResponsable += iterator.uBrutaResponsable;

            sumIncomeTax += iterator.incomeTaxProduct;
        }

        this.totalBrutoUtilities = parseFloat((sumUtilities).toFixed(2));

        this.totalIncomeTax = parseFloat((sumIncomeTax).toFixed(2));

        this.totalBrutoPatent = parseFloat( (sumBrutaPatent).toFixed(2) );
        this.totalBrutoCompany = parseFloat((sumBrutaCompany).toFixed(2));
        this.totalBrutoPartner = parseFloat((sumBrutaPartner).toFixed(2));
        this.totalBrutoResponsable = parseFloat((sumBrutaResponsable).toFixed(2));

        this.totalNetoPatent = this.totalBrutoPatent ;
        this.totalNetoCompany = this.totalBrutoCompany;
        this.totalNetoPartner = parseFloat( (sumBrutaPartner - this.totalExpense - this.totalIncomeTax ).toFixed(2) );
        this.totalNetoNoTax = parseFloat( (sumBrutaPartner - this.totalExpense).toFixed(2) );
        this.totalNetoRepsonsable = this.totalBrutoResponsable ;
    }
}

export class ComissionUtilidad {

    idDetailUtilitie: number;
    idProduct: number;
    nameProduct: string;
    utilitieProduct: number;
    utilitieBrutaProduct: number;

    percentPartner: number;
    percentCompany: number;
    percentResponsable: number;
    percentPatent: number;

    inBrutaCompany: number;
    inBrutaPartner: number;
    
    uBrutaPatent: number;
    uBrutaCompany: number;
    uBrutaPartner: number;
    uBrutaResponsable: number;

    incomeTaxProduct: number;

    constructor( idProduct: number, nameProduct: string, percentPartner: number, percentCompany: number, percentResponsable: number, percentPatent: number) {

        this.idDetailUtilitie = 0;
        this.idProduct = idProduct;
        this.nameProduct = nameProduct;

        this.utilitieProduct = 0;
        this.utilitieBrutaProduct = 0;

        this.percentPatent = percentPatent;
        this.percentPartner = percentPartner;
        this.percentCompany = percentCompany;
        this.percentResponsable = percentResponsable;

        this.inBrutaCompany = 0;
        this.inBrutaPartner = 0;

        this.uBrutaPatent = 0;
        this.uBrutaCompany = 0;
        this.uBrutaPartner = 0;
        this.uBrutaResponsable = 0;

        this.incomeTaxProduct = 0;
    }

}
