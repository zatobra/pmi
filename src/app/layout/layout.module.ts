import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslateModule } from "@ngx-translate/core";

import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { Sidebar2Component } from "./components/sidebar2/sidebar2.component";
import { TopnavComponent } from "./components/topnav/topnav.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { LayoutComponent } from "./layout.component";
import { NavComponent } from "./nav/nav.component";
// import {RippleModule} from 'primeng';
import {TooltipModule} from 'primeng/tooltip';
import { MegaMenuModule} from "primeng/megamenu";
import {  SlideMenuModule} from "primeng/slidemenu";
import {  TieredMenuModule} from "primeng/tieredmenu";
import { PanelMenuModule } from 'primeng/panelmenu';
import { FooterComponent } from "../footer/footer.component";
import { MenuItemComponent } from "./components/sidebar - Copy/menu-item.component";

@NgModule({
  imports: [
    CommonModule,
    // RippleModule,
    TooltipModule,
    LayoutRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    TranslateModule,
    // MegaMenuModule,
    // // MenuItemModule
    // PanelMenuModule,
    // TieredMenuModule,
    // SlideMenuModule
    MegaMenuModule,
    SlideMenuModule,
    TieredMenuModule
  ],
  declarations: [

    LayoutComponent,
    FooterComponent,
    NavComponent,
    TopnavComponent,
    SidebarComponent,
    Sidebar2Component,
    MenuItemComponent
  ],
})
export class LayoutModule {}
