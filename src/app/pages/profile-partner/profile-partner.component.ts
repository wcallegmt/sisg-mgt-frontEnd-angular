import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { PartnerService } from '../../services/partner.service';
import { environment } from '../../../environments/environment';
import { ChartOptions, ChartDataSets, ChartLegendOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { formatNumber } from '@angular/common';
import { PeriodService } from '../../services/period.service';
import { IUtilitieProduct } from '../../interfaces/chartUtilitieProduct.interface';

@Component({
  selector: 'app-profile-partner',
  templateUrl: './profile-partner.component.html',
  styleUrls: ['./profile-partner.component.css']
})
export class ProfilePartnerComponent implements OnInit {
  
  @ViewChild('mapBranch', {static: true}) mapElement: ElementRef;
  @ViewChild('infowindowcontent', {static: true}) infoElement: ElementRef;

  map: google.maps.Map;
  markBranch: google.maps.Marker;

  today = new Date();

  productMaxUtilitie = '';
  productMinUtilitie = '';

  dataMonths = [
    {id: 1, value: 'Enero'},
    {id: 2, value: 'Febrero'},
    {id: 3, value: 'Marzo'},
    {id: 4, value: 'Abril'},
    {id: 5, value: 'Mayo'},
    {id: 6, value: 'Junio'},
    {id: 7, value: 'Julio'},
    {id: 8, value: 'Agosto'},
    {id: 9, value: 'Setiembre'},
    {id: 10, value: 'Octubre'},
    {id: 11, value: 'Noviembre'},
    {id: 12, value: 'Diciembre'}
  ];

  dataYears: number[] = [];

  bodyChart: any = {
    month: this.today.getMonth() + 1,
    year: this.today.getFullYear()
  };

  uriApi = environment.URI_API + `/Image/user/`;
  token = '';

  idPartner = 0;

  dataProfile: any = {
    apellidoNombre: '',
    documento: '',
    nombrePais: '',
    fechaNacimiento: '',
    sexo: '',
    direccion: '',
    telefono: '',
    email: '',
    totalSucursales: 0,
    responsable: '',
    imagen: 'xD'
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          // console.log('label', label);
          return 'S/ ' + formatNumber( value, 'en', '.2-2' );
        }
      },
    }
  };
  barChartLabels: Label[] = ['item 1'];
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Ingreso en el mes', backgroundColor: '#7367F0', hoverBackgroundColor: '#7F4DEC', borderColor: '#6219FF' }
  ];

  barChartOptionsOffice: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    legend: {
      position: 'left'
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',

        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          // console.log('label', label); 
          if (value) {
            
            return formatNumber( value, 'en', '.2-2' );
          }
          return '';
        }
      },
    }
  };

  barChartLabelsOffice: Label[] = ['sucursal 1', 'Sucursal 2'];
  barChartDataOffice: ChartDataSets[] = [
    { data: [5000, 3508, 1250], label: 'producto 1'},
    { data: [3000, 2000, 4100], label: 'producto 2'},
    { data: [1140, 1060, 1500], label: 'producto 3'}
  ];

  qName = '';
  qType = 'ALL';
  qUbigeo = '';
  qProduct = '';

  dataOffice: any[] = [];
  
  // params query payment
  qMonthPay = this.today.getMonth() + 1;
  qYearPay = this.today.getFullYear();

  qBranch = '';
  qDebtLte = 0;
  qDebtGte = 0;
  qDebtEq = 0;

  qPayLte = 0;
  qPayGte = 0;
  qPayEq = 0;
  qOperation = '';
  qBank = '';

  dataPayments: any[] = [];

  constructor( private actvRouter: ActivatedRoute, private partnerSvc: PartnerService, private periodSvc: PeriodService ) { }

  ngOnInit() {

    this.actvRouter.params.subscribe( (res: any) => {

      this.idPartner = res.id;

    });

    this.periodSvc.onGetAnioStart().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      for (let index = res.data.year; index <= this.today.getFullYear(); index++) {

        this.dataYears.push(index);

      }

    });

    this.token = localStorage.getItem('token');

    this.partnerSvc.onGetProfilePartner( this.idPartner ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProfile = res.data;

    });

    this.onGetUtilitieProduct();
    this.onGetOfficeBranch();
    
    this.onLoadMap();

    this.onGetPayment();

  }

  onLoadMap() {
    const latlng = new google.maps.LatLng( 0, 0 );
    const mapOptions: google.maps.MapOptions = {
      center: latlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map( this.mapElement.nativeElement, mapOptions);

    this.markBranch = new google.maps.Marker({
      title: 'titulo marcador',
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      draggable: true
    });

    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent( this.infoElement.nativeElement );

    google.maps.event.addDomListener( this.markBranch, 'click', (event: Event) => {
      infoWindow.open(this.map, this.markBranch);
    });
  }

  onGetOfficeBranch() {
    this.partnerSvc.onGetOfficeBranchByPartner( this.idPartner, this.qName, this.qType, this.qUbigeo, this.qProduct).subscribe( (res: any) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      // console.log(res);

      this.dataOffice = res.data;

    });
  }

  onGetPayment() {
    
    this.partnerSvc.onGetPaymentsByPartner( this.idPartner, this.qMonthPay, this.qYearPay, this.qBranch, this.qDebtLte, this.qDebtGte, this.qDebtEq, this.qPayLte, this.qPayGte, this.qPayEq, this.qOperation, this.qBank ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      console.log(res);

      this.dataPayments = res.data;
    });

  }

  onGetUtilitieProduct() {

    this.partnerSvc.onChartUtilitieProduct( this.idPartner, this.bodyChart.month, this.bodyChart.year ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.barChartLabels = [];
      this.barChartData[0].data = [];

      if (Array( res.data )[0].length === 0) {

        this.barChartLabels = ['Sin registros'];
        this.barChartData[0].data = [0];

        return true;
      }

      this.productMaxUtilitie = res.data[0].nombreProducto || '';
      this.productMinUtilitie = res.data[ res.data.length - 1 ].nombreProducto || '';

      for (const iterator of res.data) {

        this.barChartLabels.push( iterator.nombreProducto );
        this.barChartData[0].data.push( iterator.ingresoProducto );

      }

    });

    this.partnerSvc.onChartUtilitieProductBranch( this.idPartner, this.bodyChart.month, this.bodyChart.year ).subscribe( (res: any) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.barChartLabelsOffice = [];
      this.barChartDataOffice = [];

      if (res.data === []) {

        this.barChartLabelsOffice = ['Sin registros'];
        this.barChartDataOffice[0].data = [0];

        return true;
      }

      let idBranch = 0;
      let idProduct = 0;
      const arrBranch: any[] = [];
      let arrProduct: number[] = [];

      for (const iterator of res.data) {

        if (idBranch !== iterator.idSucursal) {
          this.barChartLabelsOffice.push( iterator.nombreSucursal );
          arrBranch.push({
            id: iterator.idSucursal,
            name: iterator.nombreSucursal
          });
        }

        if (idProduct !== iterator.idProducto) {
          arrProduct.push(iterator.idProducto);
        }

        idBranch = iterator.idSucursal;

      }

      arrProduct = [...new Set(arrProduct)];

      console.log(res);

      idProduct = 0;
      let arrUtilitiePro: number[] = [];
      let nameProduct = '';

      arrProduct.forEach( product => {

        arrUtilitiePro = [];
        arrBranch.forEach( branch => {

          const aux: any = res.data.find( item => Number( item.idSucursal ) === branch.id && Number( item.idProducto ) === product );
          if (aux) {
            // console.log(aux);
            arrUtilitiePro.push( aux.utilidad || 0 );
            nameProduct = aux.nombreProducto || '';
          } else {
            arrUtilitiePro.push( 0 );
          }
        });

        this.barChartDataOffice.push({
          data: arrUtilitiePro,
          label: nameProduct
        });

      });

    });

  }

  onLoadMapBranch( idBranch: number ) {

    const dataTemp = this.dataOffice.find( branch  => Number( branch.idSucursal ) === idBranch );

    if (!dataTemp) {
      console.warn('No se encontró registro');
      return false;
    }

    console.log(dataTemp);

    document.getElementById('titleBranch').innerHTML = dataTemp.nombreSucursal || '';
    document.getElementById('addressBranch').innerHTML = dataTemp.direccionSucursal || '';


    const latlng = new google.maps.LatLng( dataTemp.latitud, dataTemp.longitud );

    this.markBranch.setPosition( latlng );
    this.map.setCenter( latlng );

  }

}
