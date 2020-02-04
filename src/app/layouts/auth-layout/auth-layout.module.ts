import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES_AUTH } from './auth-layout.routes';
import { LoginComponent } from '../../pages/login/login.component';



@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild( ROUTES_AUTH )
     ],
    exports: [],
    providers: [],
})
export class AuthLayoutModule {}
