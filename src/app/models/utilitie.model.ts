export class UtilitieModel {

    idUtilitie: number;
    idPartner: number;
    idOfficeBranch: number;

    totalExpense: number;
    incomeTax: number;
    utilidades: ComissionUtilidad[];

    constructor() {
        this.idUtilitie = 0;
        this.idPartner = null;
        this.idOfficeBranch = null;

        this.totalExpense = 0;
        this.incomeTax = 0;
        this.utilidades = [];
    }
}

export class ComissionUtilidad {

    idProducto: number;
    idResponsable: number;
    responsable: string;
    directoEmpresa: boolean;
    nombreProducto: string;
    porcentajeSocio: number;
    porcentajeEmpresa: number;
    porcentajeResponsable: number;
    porcentajePatente: number;

    utilidadEmpresa: number;
    utilidadSocio: number;
    utilidadResponsable: number;

    inUtilidad: number;
    outUtilidadNetaSinImpuesto: number;

    constructor( idProducto: number, idResponsable: number, responsable: string,
                 directoEmpresa: boolean, nombreProducto: string, porcentajeSocio: number,
                 porcentajeEmpresa: number, porcentajeResponsable: number, porcentajePatente: number,
                 utilidadEmpresa = 0, utilidadSocio = 0, utilidadResponsable = 0, inUtilidad = 0, outUtilidadNetaSinImpuesto = 0) {

        this.idProducto = idProducto;
        this.idResponsable = idResponsable;
        this.responsable = responsable;
        this.directoEmpresa = directoEmpresa;
        this.nombreProducto = nombreProducto;
        this.porcentajeSocio = porcentajeSocio;
        this.porcentajeEmpresa = porcentajeEmpresa;
        this.porcentajeResponsable = porcentajeResponsable;
        this.porcentajePatente = porcentajePatente;

        this.utilidadEmpresa = utilidadEmpresa;
        this.utilidadSocio = utilidadSocio;
        this.utilidadResponsable = utilidadResponsable;

        this.inUtilidad = inUtilidad;
        this.outUtilidadNetaSinImpuesto = outUtilidadNetaSinImpuesto;

    }
}
