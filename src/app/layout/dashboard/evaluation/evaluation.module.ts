import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";

import { EvaluationRoutingModule } from "./evaluation-routing.module";
import { HomeComponent } from "./home/home.component";
import { DetailsPageComponent } from "./details-page/details-page.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { SectionOneViewComponent } from "./section-one-view/section-one-view.component";
import { SectionTwoViewComponent } from "./section-two-view/section-two-view.component";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { SectionThreeViewComponent } from "./section-three-view/section-three-view.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { SectionFourViewComponent } from "./section-four-view/section-four-view.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSliderModule } from "@angular/material/slider";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { SectionFiveComponent } from "./section-five/section-five.component";
import { NgxPaginationModule } from "ngx-pagination";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ResizableModule } from "angular-resizable-element";
import { Ng5SliderModule } from "ng5-slider";
import { SectionSixComponent } from "./section-six/section-six.component";
import { MatInputModule } from "@angular/material/input";
import { SectionSevenViewComponent } from "./section-seven-view/section-seven-view.component";
import { SectionNineViewComponent } from "./section-nine-view/section-nine-view.component";
import { SectionEightViewComponent } from "./section-eight-view/section-eight-view.component";
import { SectionTenViewComponent } from "./section-ten-view/section-ten-view.component";
import { SectionElevenViewComponent } from "./section-eleven-view/section-eleven-view.component";
import { ImageGalleryComponent } from "./image-gallery/image-gallery.component";
import { SectionTwelveComponent } from "./section-twelve/section-twelve.component";
import { CriteriViewComponent } from "./criteri-view/criteri-view.component";
import { SectionThirteenComponent } from "./section-thirteen/section-thirteen.component";
import { SectionFourteenComponent } from "./section-fourteen/section-fourteen.component";
import { ZsmRedflagShopsComponent } from "./zsm-redflag-shops/zsm-redflag-shops.component";
import { BarRatingModule } from "ngx-bar-rating";
import { SectionFifteenComponent } from "./section-fifteen/section-fifteen.component";
import { SectionSixteenViewComponent } from "./section-sixteen/section-sixteen-view.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { SectionSeventeenViewComponent } from "./section-seventeen-view/section-seventeen-view.component";
import { Ng2OrderModule } from "ng2-order-pipe";
import { SectionTwentyFiveComponent } from "./section-twenty-five/section-twenty-five.component";
import { HomeNewComponent } from "./home-new/home-new.component";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
@NgModule({
  declarations: [
    HomeComponent,
    HomeNewComponent,
    DetailsPageComponent,
    MainPageComponent,
    SectionOneViewComponent,
    SectionTwoViewComponent,
    SectionThreeViewComponent,
    SectionFourViewComponent,
    SectionFiveComponent,
    SectionSixComponent,
    SectionSevenViewComponent,
    SectionNineViewComponent,
    SectionEightViewComponent,
    SectionTenViewComponent,
    SectionElevenViewComponent,
    ImageGalleryComponent,
    SectionTwelveComponent,
    CriteriViewComponent,
    SectionThirteenComponent,
    SectionFourteenComponent,
    ZsmRedflagShopsComponent,
    SectionFifteenComponent,
    SectionSixteenViewComponent,
    SectionSeventeenViewComponent,
    SectionTwentyFiveComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    MatRadioModule,
    AccordionModule.forRoot(),
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSelectModule,
    MatOptionModule,
    NgxImageZoomModule,
    NgxPaginationModule,
    ResizableModule,
    Ng5SliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    BarRatingModule,
    MatTabsModule,
    MatButtonToggleModule,
    Ng2OrderModule,
    MatDatepickerModule,
  ],
})
export class EvaluationModule {}
