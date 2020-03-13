import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES_ADMIN } from './admin-layout.routes';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { HttpClientModule } from '@angular/common/http';
import { AreaComponent } from '../../pages/area/area.component';
import { RowIndexPipe } from '../../pipes/row-index.pipe';
import { SedeComponent } from '../../pages/sede/sede.component';
import { ProductComponent } from '../../pages/product/product.component';
import { HavePatentPipe } from '../../pipes/have-patent.pipe';
import { PartnerComponent } from '../../pages/partner/partner.component';
import { ResponsableComponent } from '../../pages/responsable/responsable.component';
import { TypeSellerPipe } from '../../pipes/type-seller.pipe';
import { DirectCompanyPipe } from '../../pipes/direct-company.pipe';
import { AllowBussinessPipe } from '../../pipes/allow-bussiness.pipe';
import { BranchOfficeComponent } from '../../pages/branch-office/branch-office.component';
import { BranchOfficeListComponent } from '../../pages/branch-office-list/branch-office-list.component';
import { TypeBranchPipe } from '../../pipes/type-branch.pipe';
import { EmployeeComponent } from 'src/app/pages/employee/employee.component';
import { EmployeeListComponent } from '../../pages/employee-list/employee-list.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { NgSelect2Module } from 'ng-select2';
import { TypeExpenseComponent } from '../../pages/type-expense/type-expense.component';
import { ExpenseComponent } from '../../pages/expense/expense.component';
import { ConfigUtilitiesComponent } from '../../pages/config-utilities/config-utilities.component';
import { UtilitiesComponent } from '../../pages/utilities/utilities.component';
import { CategoryProductPipe } from '../../pipes/category-product.pipe';
import { PeriodOpenComponent } from '../../pages/period-open/period-open.component';
import { ProfilePartnerComponent } from '../../pages/profile-partner/profile-partner.component';
import { UtilitiesPaymentComponent } from '../../pages/utilities-payment/utilities-payment.component';
import { PeriodCloseComponent } from '../../pages/period-close/period-close.component';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { SumUtilitiePipe } from '../../pipes/sum-utilitie.pipe';
import { TypePaymentPipe } from '../../pipes/type-payment.pipe';
import { PaidOutPipe } from '../../pipes/paid-out.pipe';

// configuración de idioma para ng picker Bootstrap
import {Component, Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ProfileResponsableComponent } from '../../pages/profile-responsable/profile-responsable.component';
import { ProfileEmployeeComponent } from '../../pages/profile-employee/profile-employee.component';
import { ReportComponent } from '../../pages/report/report.component';
import { SexPipe } from '../../pipes/sex.pipe';
import { TotalDebPayPipe } from '../../pipes/total-debt-pay.pipe';

const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}


@NgModule({
    declarations: [
        DashboardComponent,
        CompanyComponent,
        AreaComponent,
        SedeComponent,
        ProductComponent,
        RowIndexPipe,
        HavePatentPipe,
        TypeSellerPipe,
        DirectCompanyPipe,
        AllowBussinessPipe,
        TypeBranchPipe,
        CategoryProductPipe,
        PartnerComponent,
        ResponsableComponent,
        BranchOfficeComponent,
        BranchOfficeListComponent,
        EmployeeComponent,
        EmployeeListComponent,
        ProfileComponent,
        TypeExpenseComponent,
        ExpenseComponent,
        ConfigUtilitiesComponent,
        UtilitiesComponent,
        PeriodOpenComponent,
        ProfilePartnerComponent,
        UtilitiesPaymentComponent,
        PeriodCloseComponent,
        ProfileResponsableComponent,
        ProfileEmployeeComponent,
        ReportComponent,
        SumUtilitiePipe,
        TypePaymentPipe,
        PaidOutPipe,
        SexPipe,
        TotalDebPayPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgSelect2Module,
        ChartsModule,
        NgxPaginationModule,
        NgbModule,
        RouterModule.forChild(ROUTES_ADMIN)
     ],
    exports: [],
    providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class AdminLayoutModule { }
