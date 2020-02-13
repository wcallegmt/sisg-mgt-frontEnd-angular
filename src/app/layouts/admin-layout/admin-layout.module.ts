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
import { UserComponent } from '../../pages/user/user.component';
import { UserListComponent } from '../../pages/user-list/user-list.component';
import { SedeComponent } from '../../pages/sede/sede.component';
import { ProductComponent } from '../../pages/product/product.component';
import { HavePatentPipe } from '../../pipes/have-patent.pipe';
import { PartnerComponent } from '../../pages/partner/partner.component';
import { ResponsableComponent } from '../../pages/responsable/responsable.component';
import { TypeSellerPipe } from '../../pipes/type-seller.pipe';
import { DirectCompanyPipe } from '../../pipes/direct-company.pipe';
import { AllowBussinessPipe } from '../../pipes/allow-bussiness.pipe';
import { BranchOfficeComponent } from '../../pages/branch-office/branch-office.component';

@NgModule({
    declarations: [
        DashboardComponent,
        CompanyComponent,
        AreaComponent,
        UserComponent,
        UserListComponent,
        SedeComponent,
        ProductComponent,
        RowIndexPipe,
        HavePatentPipe,
        TypeSellerPipe,
        DirectCompanyPipe,
        AllowBussinessPipe,
        PartnerComponent,
        ResponsableComponent,
        BranchOfficeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forChild(ROUTES_ADMIN)
     ],
    exports: [],
    providers: [],
})
export class AdminLayoutModule { }
