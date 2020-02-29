import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../../services/partner.service';
import { PaymentUtilitieService } from '../../services/payment-utilitie.service';
import { PaymentUtilitieModel } from 'src/app/models/paymentUtilities.model';

@Component({
  selector: 'app-utilities-payment',
  templateUrl: './utilities-payment.component.html',
  styleUrls: ['./utilities-payment.component.css']
})
export class UtilitiesPaymentComponent implements OnInit {

  dataResponsable: any[] = [];
  dataPartner: any[] = [];
  dataSucursal: any[] = [];

  bodyPayment: PaymentUtilitieModel;

  constructor(private partnerSvc: PartnerService, private paymentUtilitieSvc: PaymentUtilitieService) { }

  ngOnInit() {
    this.bodyPayment = new PaymentUtilitieModel();

    this.partnerSvc.onGetResponsable('').subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataResponsable = res.data;

      // console.log(res);
    });

    this.paymentUtilitieSvc.onGetPartnerForResp( this.bodyPayment.idResponsable ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      
      this.dataPartner = res.data;
      console.log(res);
    });


  }

}
