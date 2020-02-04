import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        SidebarComponent,
        NavbarComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        RouterModule
        // NgbModule
     ],
    exports: [
        SidebarComponent,
        NavbarComponent,
        FooterComponent
    ],
    providers: [],
})
export class ComponentsModule {}
