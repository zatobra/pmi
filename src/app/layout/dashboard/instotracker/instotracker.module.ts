import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeComponent } from "./home/home.component";
import { BodyComponent } from "./body/body.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { NgxPaginationModule } from "ngx-pagination";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FormsModule } from "@angular/forms";

import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgxMatDrpModule } from "ngx-mat-daterange-picker";
import { ModrenBodyComponent } from "./modren-body/modren-body.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ModalModule } from "ngx-bootstrap/modal";

import { FilterPipeModule } from "ngx-filter-pipe";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { MatToolbarModule } from "@angular/material/toolbar";

import { InstotrackerRoutingModule } from "./instotracker-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { SingleShopComponent } from "./single-shop/single-shop.component";
import { ShopDetailComponent } from "./shop-detail/shop-detail.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InstotrackerRoutingModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    ScrollingModule,
    MultiSelectModule,
    DropdownModule,
    NgxPaginationModule,
    CalendarModule,
    AccordionModule,
    Ng2SearchPipeModule,
    NgxMatDrpModule,
    NgbModule,
    FilterPipeModule,

    ModalModule.forRoot(),
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    HomeComponent,
    BodyComponent,
    ModrenBodyComponent,
    UserProfileComponent,
    ShopDetailComponent,
    SingleShopComponent,
  ],
})
export class InstotrackerModule {}
