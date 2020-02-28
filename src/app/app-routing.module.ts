import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { EmptyGuard } from './guards/empty.guard';

const APP_ROUTES: Routes = [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: AuthLayoutComponent,
        loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
        // children: [
        //     {
        //         path: '',
        //         loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
        //     }
        // ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [EmptyGuard],
        // canActivateChild: [EmptyGuard],
        children: [
            {
                path: '',
                loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
            }
        ]
    },

    { path: '**', redirectTo: 'login', pathMatch: 'full'  },

];


@NgModule({
    imports: [ 
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
