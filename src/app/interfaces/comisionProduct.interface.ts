export interface ComisionProductInterface {
    idProduct: number;
    nameProduct: string;
    percentPatent: number;
    percentCompany: number;
    percentPartner: number;
    percentResponsable: number;
    idResponsable: number;
    responsable: string;
    typeSeller: string;
    directComapny: string;

    changePercentPatent: boolean;
    changePercentCompany: boolean;
    changePercentPartner: boolean;
    changePercentResponsable: boolean;
}

export interface UilitieDataChanges {
    idResponsable: number;
    responsable: string;
    typeSeller: string;
    totalExpense: number;
    incomeTax: number;
    details: ComisionProductInterface[];
}
