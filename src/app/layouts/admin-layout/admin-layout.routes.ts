import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { AreaComponent } from '../../pages/area/area.component';
import { UserComponent } from '../../pages/user/user.component';
import { UserListComponent } from '../../pages/user-list/user-list.component';
import { SedeComponent } from '../../pages/sede/sede.component';
import { ProductComponent } from '../../pages/product/product.component';
import { ResponsableComponent } from '../../pages/responsable/responsable.component';

export const ROUTES_ADMIN: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'area', component: AreaComponent },
    { path: 'sede', component: SedeComponent },
    { path: 'user', component: UserComponent },
    { path: 'userList', component: UserListComponent },
    { path: 'product', component: ProductComponent },
    { path: 'responsable', component: ResponsableComponent },

];
