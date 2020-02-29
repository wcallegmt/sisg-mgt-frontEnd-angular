import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { AreaComponent } from '../../pages/area/area.component';
import { SedeComponent } from '../../pages/sede/sede.component';
import { ProductComponent } from '../../pages/product/product.component';
import { ResponsableComponent } from '../../pages/responsable/responsable.component';
import { PartnerComponent } from '../../pages/partner/partner.component';
import { BranchOfficeComponent } from '../../pages/branch-office/branch-office.component';
import { BranchOfficeListComponent } from '../../pages/branch-office-list/branch-office-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EmptyGuard } from '../../guards/empty.guard';
import { EmployeeComponent } from '../../pages/employee/employee.component';
import { EmployeeListComponent } from '../../pages/employee-list/employee-list.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { TypeExpenseComponent } from '../../pages/type-expense/type-expense.component';
import { ExpenseComponent } from '../../pages/expense/expense.component';
import { ConfigUtilitiesComponent } from '../../pages/config-utilities/config-utilities.component';
import { UtilitiesComponent } from '../../pages/utilities/utilities.component';
import { PeriodOpenComponent } from '../../pages/period-open/period-open.component';
import { ProfilePartnerComponent } from '../../pages/profile-partner/profile-partner.component';
import { UtilitiesPaymentComponent } from '../../pages/utilities-payment/utilities-payment.component';
import { PeriodCloseComponent } from '../../pages/period-close/period-close.component';

export const ROUTES_ADMIN: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'company', component: CompanyComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'area', component: AreaComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'sede', component: SedeComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'employee', component: EmployeeComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'employeeList', component: EmployeeListComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'product', component: ProductComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'responsable', component: ResponsableComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'partner', component: PartnerComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'branchOffice', component: BranchOfficeComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'branchOfficeList', component: BranchOfficeListComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'typeExpense', component: TypeExpenseComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'expense', component: ExpenseComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'configUtilities', component: ConfigUtilitiesComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'utilities', component: UtilitiesComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'periodOpen', component: PeriodOpenComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'profilePartner', component: ProfilePartnerComponent, canActivate: [EmptyGuard, AuthGuard] },
    { path: 'utilitiesPayment', component: UtilitiesPaymentComponent, canActivate: [EmptyGuard, AuthGuard] },

    { path: 'periodClose', component: PeriodCloseComponent, canActivate: [EmptyGuard, AuthGuard] },
    // { path: '**', redirectTo: 'login' }
];
