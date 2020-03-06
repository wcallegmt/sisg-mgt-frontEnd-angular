import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { EmptyGuard } from './guards/empty.guard';
import { NoFoundComponent } from './pages/no-found/no-found.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: AuthLayoutComponent,
        loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
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

    { path: '**', pathMatch: 'full' , component: NoFoundComponent },

];


@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
