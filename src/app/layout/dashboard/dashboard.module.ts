import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatGridListModule } from "@angular/material/grid-list";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from "@angular/material/datepicker";

import { StatModule } from "../../shared/modules/stat/stat.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./innerComponents/home/home.component";
import { ShopListComponent } from "./innerComponents/shop-list/shop-list.component";
import { SummaryComponent } from "./innerComponents/summary/summary.component";
import { ProductivityComponent } from "./innerComponents/productivity/productivity.component";
import { FilterBarComponent } from "./innerComponents/filter-bar/filter-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DetailsComponent } from "./innerComponents/details/details.component";
import { DailyVisitReportComponent } from "./innerComponents/daily-visit-report/daily-visit-report.component";
import { ShopDetailComponent } from "./innerComponents/shop-detail/shop-detail.component";
import { SROShopDetailComponent } from "./innerComponents/shop-detail-sro/shop-detail-sro.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { MslDashboardComponent } from "./innerComponents/msl-dashboard/msl-dashboard.component";
import { ProductivityDashboardComponent } from "./innerComponents/productivity-dashboard/productivity-dashboard.component";
import { ChartsModule, ChartsModule as Ng2Charts } from "ng2-charts";
import { TposmDeploymentReportComponent } from "./innerComponents/tposm-deployment-report/tposm-deployment-report.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LineChartComponent } from "./innerComponents/home/line-chart/line-chart.component";
import { UpdatePasswordComponent } from "./user/update-password/update-password.component";
import { RawDataComponent } from "./raw-data/raw-data.component";
import { MatTableComponent } from "./innerComponents/mat-table/mat-table.component";
import { Ng2OrderModule } from "ng2-order-pipe";
import { DataAvailabilityComponent } from "./innerComponents/data-availability/data-availability.component";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { MerchandiserListComponent } from "./innerComponents/merchandiser-list/merchandiser-list.component";
import { AbnormalityComponent } from "./innerComponents/abnormality/abnormality.component";
import { TimeAnalysisReportComponent } from "./innerComponents/time-analysis-report/time-analysis-report.component";
import { NgxPaginationModule } from "ngx-pagination";
import { MerchandiserAttendanceComponent } from "./innerComponents/merchandiser-attendance/merchandiser-attendance.component";
import { DailyEvaluationReportComponent } from "./innerComponents/daily-evaluation-report/daily-evaluation-report.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { EmailManagerComponent } from "./innerComponents/email-manager/email-manager.component";
import { MessageStatusListComponent } from "./innerComponents/email-manager/childComponents/message-status-list/message-status-list.component";
import { AddNewMessageComponent } from "./innerComponents/email-manager/childComponents/add-new-message/add-new-message.component";
import { UploadRoutesComponent } from "./innerComponents/upload-routes/upload-routes.component";
import { SingleRouteDetailComponent } from "./innerComponents/upload-routes/routes-inner-pages/single-route-detail/single-route-detail.component";
import { ShopsForSingleRouteComponent } from "./innerComponents/upload-routes/routes-inner-pages/shops-for-single-route/shops-for-single-route.component";
import { AddEditGroupComponent } from "./innerComponents/email-manager/childComponents/add-edit-group/add-edit-group.component";
import { AddDeviceComponent } from "./innerComponents/add-device/add-device.component";
import { SupervisorWwwrSummaryComponent } from "./innerComponents/supervisor-wwwr-summary/supervisor-wwwr-summary.component";
import { ShopListReportComponent } from "./innerComponents/shop-list-report/shop-list-report.component";
import { UploadRoutesNewComponent } from "./innerComponents/upload-routes-new/upload-routes-new.component";
import { MerchandiserPlannedCallsComponent } from "./innerComponents/merchandiser-planned-calls/merchandiser-planned-calls.component";
import { TableauHelperComponent } from "./Tableau/tableau-helper/tableau-helper.component";
import { DashboardTableauComponent } from "./Tableau/dashboard-tableau/dashboard-tableau.component";
import { ProductivityTableauComponent } from "./Tableau/productivity-tableau/productivity-tableau.component";
import { SkuDashboardComponent } from "./Tableau/sku-dashboard/sku-dashboard.component";
import { VoErrorReportComponent } from "./innerComponents/vo-error-report/vo-error-report.component";
import { MerchandiserScoreComponent } from "./innerComponents/merchandiser-score/merchandiser-score.component";
import { MerchandiserWiseScoreComponent } from "./innerComponents/merchandiser-wise-score/merchandiser-wise-score.component";
import { ComplienceReportComponent } from "./innerComponents/complience-report/complience-report.component";
import { UniqueBasedProductivityReportComponent } from "./innerComponents/unique-based-productivity-report/unique-based-productivity-report.component";
import { MtDashboardComponent } from "./Tableau/mt-dashboard/mt-dashboard.component";
import { GtDashboardComponent } from "./Tableau/gt-dashboard/gt-dashboard.component";
import { SssGtDashboardComponent } from "./Tableau/sss-gt-dashboard/sss-gt-dashboard.component";
import { ComplianceDashboardComponent } from "./Tableau/compliance-dashboard/compliance-dashboard.component";
import { TrendingOosReportComponent } from "./innerComponents/trending-oos-report/trending-oos-report.component";
import { MtdOosReportComponent } from "./innerComponents/mtd-oos-report/mtd-oos-report.component";
import { ManageProductsComponent } from "./innerComponents/manage-products/manage-products.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { MatExpansionModule } from "@angular/material/expansion";
import { ExpiryDataReportComponent } from "./innerComponents/expiry-data-report/expiry-data-report.component";
import { ManageSurveyorsComponent } from "./innerComponents/manage-surveyors/manage-surveyors.component";
import { ManageSuperviserComponent } from "./innerComponents/manage-surveyors/manage-superviser/manage-superviser.component";
import { ManageMerchandiserComponent } from "./innerComponents/manage-surveyors/manage-merchandiser/manage-merchandiser.component";
import { ManageManagerComponent } from "./innerComponents/manage-surveyors/manage-manager/manage-manager.component";
import { ComplianceDashboardNationalComponent } from "./Tableau/compliance-dashboard-national/compliance-dashboard-national.component";
import { ProfileComponent } from "./innerComponents/profile/profile.component";
import { UploadHurdleRateComponent } from "./innerComponents/upload-hurdle-rate/upload-hurdle-rate.component";
import { VdComplianceMtComponent } from "./Tableau/vd-compliance-mt/vd-compliance-mt.component";
import { VdComplianceGtComponent } from "./Tableau/vd-compliance-gt/vd-compliance-gt.component";
import { AttendanceReportComponent } from "./innerComponents/attendance-report/attendance-report.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { VdReportComponent } from "./innerComponents/vd-report/vd-report.component";
import { MerchandiserRosterComponent } from "./innerComponents/merchandiser-roster/merchandiser-roster.component";
import { UploadDesiredSosComponent } from "./innerComponents/upload-desired-sos/upload-desired-sos.component";
import { ShopWiseRoutesComponent } from "./innerComponents/shop-wise-routes/shop-wise-routes.component";
import { ManageVdComponent } from "./innerComponents/manage-vd/manage-vd/manage-vd.component";
import { MatTabsModule } from "@angular/material/tabs";
import { UpdateVdProductComponent } from "./innerComponents/manage-vd/update-vd-product/update-vd-product.component";
import { UpdateVdPlanogramsComponent } from "./innerComponents/manage-vd/update-vd-planograms/update-vd-planograms.component";
import { UploadVdHurdleRatesComponent } from "./innerComponents/upload-vd-hurdle-rates/upload-vd-hurdle-rates.component";
import { ManageEmailsComponent } from "./innerComponents/manage-emails/manage-emails.component";
import { CalenderDemoComponent } from "./innerComponents/calender/calender-demo/calender-demo.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { CalendarHeaderComponent } from "./innerComponents/calender/calendar-header/calendar-header.component";
import { MainDashboardComponent } from "./innerComponents/home/main-dashboard/main-dashboard.component";
import { WelcomePageComponent } from "./innerComponents/home/welcome-page/welcome-page.component";
import { DistributionCheckInCardComponent } from "./innerComponents/distribution-check-in-card/distribution-check-in-card.component";
import { SearchBoxComponent } from "./innerComponents/search-box/search-box.component";
import { RoleManagementComponent } from "./innerComponents/change_menu/role_management.component";
import { OosShopListComponent } from "./innerComponents/oos-shop-list/oos-shop-list.component";
import { MerchandiserAttendanceMapViewComponent } from "./innerComponents/merchandiser-attendance-map-view/merchandiser-attendance-map-view.component";
import { JwPaginationModule } from "jw-angular-pagination";
import { StatChartsComponent } from "./innerComponents/stat-charts/stat-charts.component";
import { DataAvailabilityChannelwiseComponent } from "./innerComponents/data-availability-channelwise/data-availability-channelwise.component";
import { AppBuildsComponent } from "./innerComponents/app-builds/app-builds.component";
import { AgmCoreModule } from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { Config } from "src/assets/config";
import { DashboardDataComponent } from "./dashboard-data/dashboard-data.component";
import { SOSandSODComponent } from "./innerComponents/sos-and-sod/sos-and-sod.component";
import { VisitBaseProductivityComponent } from "./innerComponents/visit-base-productivity/visit-base-productivity.component";
import { UploadSamsungSalesAchievementComponent } from "./innerComponents/upload-samsung-sales-achievement/upload-samsung-sales-achievement.component";
import { SamsungSalesAchievementReportComponent } from "./innerComponents/samsung-sales-achievement-report/samsung-sales-achievement-report.component";
import { SamsungRetailerDataReportComponent } from "./innerComponents/samsung-retailer-data-report/samsung-retailer-data-report.component";
import { UploadSamsungRetailerDataComponent } from "./innerComponents/upload-samsung-retailer-data/upload-samsung-retailer-data.component";
import { ShopLocationApprovalComponent } from "./innerComponents/shop-location-approval/shop-location-approval.component";
import { LightboxModule } from "ngx-lightbox";
import { SectionClaimImagesComponent } from "./innerComponents/section-claim-images/section-claim-images.component";
import { LuckyDrawSpinnerComponent } from "./innerComponents/lucky-draw-spinner/lucky-draw-spinner-component";
import { CsvUploadComponent } from "./innerComponents/lucky-draw-spinner/csv-upload-component/csv-upload-component";
import { AnimationSpinnerComponent } from "./innerComponents/lucky-draw-spinner/animation-spinner-component/animation-spinner-component";
import { SpinnerAnimationComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-component/spinner-animation-component";
import { SpinnerFileuploadComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-fileupload-component/spinner-fileupload-component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TestComponent } from "./innerComponents/lucky-draw-spinner-new/test-component";
import { TestComponentGitLib } from "./innerComponents/lucky-draw-spinner-new/test-component-git-lib";
import { SpinnerAnimationDrawComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-draw-component/spinner-animation-draw-component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { TestComponent2 } from "./innerComponents/lucky-draw-spinner-new/test-component2";
import { TestComponent3 } from "./innerComponents/lucky-draw-spinner-new/test-component3";
import { SpinnerAnimationDrawNewComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-draw-new-component/spinner-animation-draw-new-component";
import { ManageComplianceComponent } from "./innerComponents/manage-compliance/manage-compliance-component";
import { AddEmployeeComponent } from "./innerComponents/add-employee/add-employee.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { SamsungLeaveManagementComponent } from "./innerComponents/samsung-leave-management/samsung-leave-management-component";
import { ToastrCustomComponent } from "./toastr-custom-component/toastr-custom-component";
import { SamsungClaimManagementOPDComponent } from "./innerComponents/samsung-claims-management-opd/samsung-claim-management-opd-component";
import { SamsungClaimManagementTravellingComponent } from "./innerComponents/samsung-claims-management-travelling/samsung-claims-management-travelling-component";
import { SamsungHrIncentivesManagementComponent } from "./innerComponents/samsung-hr-incentives-management/samsung-hr-incentives-management-component";
import { SamsungHrIncentivesFileUploadComponent } from "./innerComponents/samsung-hr-incentives-file-upload/samsung-hr-incentives-file-upload-component";
import { TsmTargetSummaryComponent } from "./innerComponents/tsm-target-summary/tsm-target-summary.component";
import { WidgetsComponent } from "./widgets/widgets.component";
import { BarChartWidgetComponent } from "./widgets/bar-chart-widget/bar.chart.widget.component";
import { BarWidgetComponent } from "./widgets/bar-widget/bar.widget.component";
import { IconWidgetComponent } from "./widgets/icon-widget/icon.widget.component";
import { DoughnetChartWidgetComponent } from "./widgets/doughnet-chart-widget/doughnet.chart.widget.component";
import { MarketIntelligenceComponent } from "./innerComponents/market-intelligence/market-intelligence.component";
import { PayrollProcessComponent } from "./innerComponents/payroll-process/payroll-process.component";
import { PayrollUnprocessComponent } from "./innerComponents/payroll-unprocess/payroll-unprocess.component";
import { WidgetsNewComponent } from "./widgets/widgets-new.component";
import { DashboardDataMenuComponent } from "./dashboard-data-menu/dashboard-data-menu.component";
import { UploadTgtFileComponent } from "./innerComponents/upload-tgt-file/upload-tgt-file-component";
import { UploadSalesFileComponent } from "./innerComponents/upload-sales-file/upload-sales-file-component";
import { UploadSndKpisComponent } from "./innerComponents/upload-snd-kpis/upload-snd-kpis-component";
import { UploadTemplateComponent } from "./innerComponents/upload-template/upload-template.component";
import { ManagePtcFileComponent } from "./innerComponents/manage-ptc-file/manage-ptc-file";

// import { AngularImageViewerModule } from "@hreimer/angular-image-viewer";
@NgModule({
  imports: [
    FormsModule,
    ChartsModule,
    // NgSelectMultipleOption,
    // NgMultiSelectDropDownModule,
    // MultiSelectModule,
    // DropdownModule,
    HttpClientModule,
    JwPaginationModule,
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    StatModule,
    MatCardModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    ModalModule.forRoot(),
    Ng2Charts,
    Ng2OrderModule,
    ButtonsModule.forRoot(),
    NgxPaginationModule,
    MatRadioModule,
    MatCheckboxModule,
    BsDropdownModule.forRoot(),
    MatMenuModule,
    ReactiveFormsModule,
    AccordionModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatProgressBarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AgmCoreModule.forRoot({
      apiKey: Config.API_KEY,
      libraries: ["places", "geometry", "drawing"],
    }),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    MatRadioModule,
    MatButtonModule,
    LightboxModule,
    // ImageViewerModule
    // AngularImageViewerModule
    CarouselModule,
    NgxSpinnerModule,
  ],
  declarations: [
    SOSandSODComponent,
    DashboardComponent,
    SearchBoxComponent,
    HomeComponent,
    ShopListComponent,
    SummaryComponent,
    ProductivityComponent,
    FilterBarComponent,
    DetailsComponent,
    DailyVisitReportComponent,
    ShopDetailComponent,
    SROShopDetailComponent,
    MslDashboardComponent,
    ProductivityDashboardComponent,
    TposmDeploymentReportComponent,
    LineChartComponent,
    UpdatePasswordComponent,
    RawDataComponent,
    MatTableComponent,
    DataAvailabilityComponent,
    MerchandiserListComponent,
    AbnormalityComponent,
    TimeAnalysisReportComponent,
    MerchandiserAttendanceComponent,
    DailyEvaluationReportComponent,
    EmailManagerComponent,
    MessageStatusListComponent,
    AddNewMessageComponent,
    UploadRoutesComponent,
    SingleRouteDetailComponent,
    ShopsForSingleRouteComponent,
    AddEditGroupComponent,
    AddDeviceComponent,
    SupervisorWwwrSummaryComponent,
    ShopListReportComponent,
    UploadRoutesNewComponent,

    RoleManagementComponent,
    MerchandiserPlannedCallsComponent,
    TableauHelperComponent,
    DashboardTableauComponent,
    ProductivityTableauComponent,
    SkuDashboardComponent,
    VoErrorReportComponent,
    MerchandiserScoreComponent,
    MerchandiserWiseScoreComponent,
    ComplienceReportComponent,
    UniqueBasedProductivityReportComponent,
    MtDashboardComponent,
    GtDashboardComponent,
    SssGtDashboardComponent,
    ComplianceDashboardComponent,
    TrendingOosReportComponent,
    MtdOosReportComponent,
    ManageProductsComponent,
    ExpiryDataReportComponent,
    ManageSurveyorsComponent,
    ManageSuperviserComponent,
    AppBuildsComponent,
    ManageMerchandiserComponent,
    ManageManagerComponent,
    ComplianceDashboardNationalComponent,
    ProfileComponent,
    UploadHurdleRateComponent,
    VdComplianceMtComponent,
    VdComplianceGtComponent,
    AttendanceReportComponent,
    VdReportComponent,
    MerchandiserRosterComponent,
    UploadDesiredSosComponent,
    ShopWiseRoutesComponent,
    ManageVdComponent,
    UpdateVdProductComponent,
    UpdateVdPlanogramsComponent,
    UploadVdHurdleRatesComponent,
    ManageEmailsComponent,
    CalenderDemoComponent,
    CalendarHeaderComponent,
    MainDashboardComponent,
    WelcomePageComponent,
    DistributionCheckInCardComponent,
    OosShopListComponent,
    MerchandiserAttendanceMapViewComponent,
    StatChartsComponent,
    DataAvailabilityChannelwiseComponent,
    DashboardDataComponent,
    VisitBaseProductivityComponent,
    UploadSamsungSalesAchievementComponent,
    SamsungSalesAchievementReportComponent,
    SamsungRetailerDataReportComponent,
    UploadSamsungRetailerDataComponent,
    ShopLocationApprovalComponent,
    SamsungClaimManagementOPDComponent,
    SamsungClaimManagementTravellingComponent,
    SamsungLeaveManagementComponent,
    SectionClaimImagesComponent,
    LuckyDrawSpinnerComponent,
    CsvUploadComponent,
    AnimationSpinnerComponent,
    SpinnerFileuploadComponent,
    SpinnerAnimationComponent,
    SpinnerAnimationDrawComponent,
    TestComponent,
    TestComponentGitLib,
    TestComponent2,
    TestComponent3,
    SpinnerAnimationDrawNewComponent,
    ManageComplianceComponent,
    AddEmployeeComponent,
    ToastrCustomComponent,
    SamsungHrIncentivesManagementComponent,
    SamsungHrIncentivesFileUploadComponent,
    TsmTargetSummaryComponent,
    WidgetsComponent,
    WidgetsNewComponent,
    BarChartWidgetComponent,
    BarWidgetComponent,
    IconWidgetComponent,
    DoughnetChartWidgetComponent,
    MarketIntelligenceComponent,
    PayrollProcessComponent,
    PayrollUnprocessComponent,
    DashboardDataMenuComponent,
    UploadTgtFileComponent,
    UploadSalesFileComponent,
    UploadSndKpisComponent,
    UploadTemplateComponent,
    ManagePtcFileComponent
  ],
  providers: [],
})
export class DashboardModule {}
