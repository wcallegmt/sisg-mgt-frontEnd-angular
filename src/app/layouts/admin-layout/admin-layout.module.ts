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

@NgModule({
    declarations: [
        DashboardComponent,
        CompanyComponent,
        AreaComponent,
        UserComponent,
        UserListComponent,
        RowIndexPipe
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
