import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { DashboardGuard } from "./dashboard.guard";
import { HomeComponent } from "./innerComponents/home/home.component";
import { ShopListComponent } from "./innerComponents/shop-list/shop-list.component";
import { SummaryComponent } from "./innerComponents/summary/summary.component";
import { ProductivityComponent } from "./innerComponents/productivity/productivity.component";
import { DetailsComponent } from "./innerComponents/details/details.component";
import { DailyVisitReportComponent } from "./innerComponents/daily-visit-report/daily-visit-report.component";
import { ShopDetailComponent } from "./innerComponents/shop-detail/shop-detail.component";
import { MslDashboardComponent } from "./innerComponents/msl-dashboard/msl-dashboard.component";
import { ProductivityDashboardComponent } from "./innerComponents/productivity-dashboard/productivity-dashboard.component";
import { TposmDeploymentReportComponent } from "./innerComponents/tposm-deployment-report/tposm-deployment-report.component";
import { UpdatePasswordComponent } from "./user/update-password/update-password.component";
import { RawDataComponent } from "./raw-data/raw-data.component";
import { DataAvailabilityComponent } from "./innerComponents/data-availability/data-availability.component";
import { MerchandiserListComponent } from "./innerComponents/merchandiser-list/merchandiser-list.component";
import { AbnormalityComponent } from "./innerComponents/abnormality/abnormality.component";
import { TimeAnalysisReportComponent } from "./innerComponents/time-analysis-report/time-analysis-report.component";
import { MerchandiserAttendanceComponent } from "./innerComponents/merchandiser-attendance/merchandiser-attendance.component";
import { DailyEvaluationReportComponent } from "./innerComponents/daily-evaluation-report/daily-evaluation-report.component";
import { EmailManagerComponent } from "./innerComponents/email-manager/email-manager.component";
import { UploadRoutesComponent } from "./innerComponents/upload-routes/upload-routes.component";
import { SingleRouteDetailComponent } from "./innerComponents/upload-routes/routes-inner-pages/single-route-detail/single-route-detail.component";
import { ShopsForSingleRouteComponent } from "./innerComponents/upload-routes/routes-inner-pages/shops-for-single-route/shops-for-single-route.component";
import { AddDeviceComponent } from "./innerComponents/add-device/add-device.component";
import { SupervisorWwwrSummaryComponent } from "./innerComponents/supervisor-wwwr-summary/supervisor-wwwr-summary.component";
import { ShopListReportComponent } from "./innerComponents/shop-list-report/shop-list-report.component";
import { UploadRoutesNewComponent } from "./innerComponents/upload-routes-new/upload-routes-new.component";
import { MerchandiserPlannedCallsComponent } from "./innerComponents/merchandiser-planned-calls/merchandiser-planned-calls.component";
import { DashboardTableauComponent } from "./Tableau/dashboard-tableau/dashboard-tableau.component";
import { ProductivityTableauComponent } from "./Tableau/productivity-tableau/productivity-tableau.component";
import { SkuDashboardComponent } from "./Tableau/sku-dashboard/sku-dashboard.component";
import { MerchandiserScoreComponent } from "./innerComponents/merchandiser-score/merchandiser-score.component";
import { VoErrorReportComponent } from "./innerComponents/vo-error-report/vo-error-report.component";
import { MerchandiserWiseScoreComponent } from "./innerComponents/merchandiser-wise-score/merchandiser-wise-score.component";
import { ComplienceReportComponent } from "./innerComponents/complience-report/complience-report.component";
import { TableauHelperComponent } from "./Tableau/tableau-helper/tableau-helper.component";
import { UniqueBasedProductivityReportComponent } from "./innerComponents/unique-based-productivity-report/unique-based-productivity-report.component";
import { MtDashboardComponent } from "./Tableau/mt-dashboard/mt-dashboard.component";
import { GtDashboardComponent } from "./Tableau/gt-dashboard/gt-dashboard.component";
import { SssGtDashboardComponent } from "./Tableau/sss-gt-dashboard/sss-gt-dashboard.component";
import { ComplianceDashboardComponent } from "./Tableau/compliance-dashboard/compliance-dashboard.component";
import { TrendingOosReportComponent } from "./innerComponents/trending-oos-report/trending-oos-report.component";
import { MtdOosReportComponent } from "./innerComponents/mtd-oos-report/mtd-oos-report.component";
import { ManageProductsComponent } from "./innerComponents/manage-products/manage-products.component";
import { ExpiryDataReportComponent } from "./innerComponents/expiry-data-report/expiry-data-report.component";
import { ManageSurveyorsComponent } from "./innerComponents/manage-surveyors/manage-surveyors.component";
import { ComplianceDashboardNationalComponent } from "./Tableau/compliance-dashboard-national/compliance-dashboard-national.component";
import { ProfileComponent } from "./innerComponents/profile/profile.component";
import { UploadHurdleRateComponent } from "./innerComponents/upload-hurdle-rate/upload-hurdle-rate.component";
import { VdComplianceMtComponent } from "./Tableau/vd-compliance-mt/vd-compliance-mt.component";
import { VdComplianceGtComponent } from "./Tableau/vd-compliance-gt/vd-compliance-gt.component";
import { AttendanceReportComponent } from "./innerComponents/attendance-report/attendance-report.component";
import { VdReportComponent } from "./innerComponents/vd-report/vd-report.component";
import { MerchandiserRosterComponent } from "./innerComponents/merchandiser-roster/merchandiser-roster.component";
import { UploadDesiredSosComponent } from "./innerComponents/upload-desired-sos/upload-desired-sos.component";
import { ShopWiseRoutesComponent } from "./innerComponents/shop-wise-routes/shop-wise-routes.component";
import { ManageVdComponent } from "./innerComponents/manage-vd/manage-vd/manage-vd.component";
import { UploadVdHurdleRatesComponent } from "./innerComponents/upload-vd-hurdle-rates/upload-vd-hurdle-rates.component";
import { ManageEmailsComponent } from "./innerComponents/manage-emails/manage-emails.component";
import { CalenderDemoComponent } from "./innerComponents/calender/calender-demo/calender-demo.component";
import { DistributionCheckInCardComponent } from "./innerComponents/distribution-check-in-card/distribution-check-in-card.component";
import { RoleManagementComponent } from "./innerComponents/change_menu/role_management.component";
import { OosShopListComponent } from "./innerComponents/oos-shop-list/oos-shop-list.component";
import { MerchandiserAttendanceMapViewComponent } from "./innerComponents/merchandiser-attendance-map-view/merchandiser-attendance-map-view.component";
import { DataAvailabilityChannelwiseComponent } from "./innerComponents/data-availability-channelwise/data-availability-channelwise.component";
import { AppBuildsComponent } from "./innerComponents/app-builds/app-builds.component";
import { DashboardDataComponent } from "./dashboard-data/dashboard-data.component";
import { SOSandSODComponent } from "./innerComponents/sos-and-sod/sos-and-sod.component";
import { VisitBaseProductivityComponent } from "./innerComponents/visit-base-productivity/visit-base-productivity.component";
import { UploadSamsungSalesAchievementComponent } from "./innerComponents/upload-samsung-sales-achievement/upload-samsung-sales-achievement.component";
import { SamsungSalesAchievementReportComponent } from "./innerComponents/samsung-sales-achievement-report/samsung-sales-achievement-report.component";
import { UploadSamsungRetailerDataComponent } from "./innerComponents/upload-samsung-retailer-data/upload-samsung-retailer-data.component";
import { SamsungRetailerDataReportComponent } from "./innerComponents/samsung-retailer-data-report/samsung-retailer-data-report.component";
import { ShopLocationApprovalComponent } from "./innerComponents/shop-location-approval/shop-location-approval.component";
import { SamsungClaimManagementOPDComponent } from "./innerComponents/samsung-claims-management-opd/samsung-claim-management-opd-component";
import { SectionClaimImagesComponent } from "./innerComponents/section-claim-images/section-claim-images.component";
import { LuckyDrawSpinnerComponent } from "./innerComponents/lucky-draw-spinner/lucky-draw-spinner-component";
import { SROShopDetailComponent } from "./innerComponents/shop-detail-sro/shop-detail-sro.component";
import { SpinnerFileuploadComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-fileupload-component/spinner-fileupload-component";
import { SpinnerAnimationComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-component/spinner-animation-component";
import { TestComponent } from "./innerComponents/lucky-draw-spinner-new/test-component";
import { TestComponentGitLib } from "./innerComponents/lucky-draw-spinner-new/test-component-git-lib";
import { SpinnerAnimationDrawComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-draw-component/spinner-animation-draw-component";
import { TestComponent2 } from "./innerComponents/lucky-draw-spinner-new/test-component2";
import { TestComponent3 } from "./innerComponents/lucky-draw-spinner-new/test-component3";
import { SpinnerAnimationDrawNewComponent } from "./innerComponents/lucky-draw-spinner-new/spinner-animation-draw-new-component/spinner-animation-draw-new-component";
import { ManageComplianceComponent } from "./innerComponents/manage-compliance/manage-compliance-component";
import { AddEmployeeComponent } from "./innerComponents/add-employee/add-employee.component";
import { SamsungLeaveManagementComponent } from "./innerComponents/samsung-leave-management/samsung-leave-management-component";
import { SamsungClaimManagementTravellingComponent } from "./innerComponents/samsung-claims-management-travelling/samsung-claims-management-travelling-component";
import { SamsungHrIncentivesManagementComponent } from "./innerComponents/samsung-hr-incentives-management/samsung-hr-incentives-management-component";
import { SamsungHrIncentivesFileUploadComponent } from "./innerComponents/samsung-hr-incentives-file-upload/samsung-hr-incentives-file-upload-component";
import { TsmTargetSummaryComponent } from "./innerComponents/tsm-target-summary/tsm-target-summary.component";
import { WidgetsComponent } from "./widgets/widgets.component";
import { MarketIntelligenceComponent } from "./innerComponents/market-intelligence/market-intelligence.component";
import { PayrollProcessComponent } from "./innerComponents/payroll-process/payroll-process.component";
import { PayrollUnprocessComponent } from "./innerComponents/payroll-unprocess/payroll-unprocess.component";
import { WidgetsNewComponent } from "./widgets/widgets-new.component";
import { UploadTgtFileComponent } from "./innerComponents/upload-tgt-file/upload-tgt-file-component";
import { UploadSalesFileComponent } from "./innerComponents/upload-sales-file/upload-sales-file-component";
import { UploadSndKpisComponent } from "./innerComponents/upload-snd-kpis/upload-snd-kpis-component";
import { UploadTemplateComponent } from "./innerComponents/upload-template/upload-template.component";
import { ManagePtcFileComponent } from "./innerComponents/manage-ptc-file/manage-ptc-file";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "main", component: ProfileComponent },
      { path: "daily_visit_report", component: DailyVisitReportComponent },
      { path: "oos_details_report", component: DetailsComponent },
      { path: "shop_list_report", component: ShopListComponent },
      { path: "summary_report", component: SummaryComponent },
      { path: "productivity_report", component: ProductivityComponent },
      { path: "supervisor_productivity", component: ProductivityComponent },
      { path: "msl_dashboard", component: MslDashboardComponent },
      {
        path: "visit-base-productivity",
        component: VisitBaseProductivityComponent,
      },
      { path: "manage_products", component: ManageProductsComponent },
      { path: "manage_surveyors", component: ManageSurveyorsComponent },
      {
        path: "manage-employee",
        component: AddEmployeeComponent,
      },
      {
        path: "market-intelligence",
        component: MarketIntelligenceComponent,
      },
      
      { path: "app_builds", component: AppBuildsComponent },
      {
        path: "distribution-check-in",
        component: DistributionCheckInCardComponent,
      },
      {
        path: "distribution-check-in-sup",
        component: DistributionCheckInCardComponent,
      },

      {
        path: "app-widgets",
        component: WidgetsComponent,
      },

      {
        path: "app-widgets/:queryId",
        component: WidgetsNewComponent,
      },

      
      {
        path: "trending_oos_report",
        component: TrendingOosReportComponent,
      },
      {
        path: "productivity_dashboard",
        component: ProductivityDashboardComponent,
      },
      {
        path: "tposm_deployment_report",
        component: TposmDeploymentReportComponent,
      },
      {
        path: "daily_evaluation_report",
        component: DailyEvaluationReportComponent,
      },
      {
        path: "shareofshelf",
        component: SOSandSODComponent,
      },

      { path: "update_password", component: UpdatePasswordComponent },
      { path: "raw_data", component: RawDataComponent },
      { path: "dashboard_data", component: DashboardDataComponent },
      { path: "brand_sku_oos", component: DataAvailabilityComponent },
      {
        path: "brand_sku_oos_gt",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_gt_condiment",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_gt_culinary",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_gt/:regionId",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_so",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_so/:regionId",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_imt",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_imt_condiment",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_imt_culinary",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "brand_sku_oos_imt/:clusterId",
        component: DataAvailabilityChannelwiseComponent,
      },
      {
        path: "supervisor_wwwr_summary",
        component: SupervisorWwwrSummaryComponent,
      },
      { path: "data_abnormality_report", component: AbnormalityComponent },
      { path: "time-analysis-report", component: TimeAnalysisReportComponent },
      { path: "shop-list-report", component: ShopListReportComponent },
      { path: "merchandiser_List", component: MerchandiserListComponent },
      { path: "manage-emails", component: ManageEmailsComponent },
      {
        path: "merchandiser_attendance",
        component: MerchandiserAttendanceComponent,
      },
      { path: "sms_manager", component: EmailManagerComponent },
      { path: "upload_routes/route_list", component: UploadRoutesComponent },
      {
        path: "upload_routes/single_route_details",
        component: SingleRouteDetailComponent,
      },
      {
        path: "upload_routes/shops_for_single_route",
        component: ShopsForSingleRouteComponent,
      },
      { path: "add_device", component: AddDeviceComponent },

      { path: "upload_routes_new", component: UploadRoutesNewComponent },

      {
        path: "upload-samsung-sales-achievement",
        component: UploadSamsungSalesAchievementComponent,
      },

      {
        path: "samsung-sales-achievement-report",
        component: SamsungSalesAchievementReportComponent,
      },

      {
        path: "upload-samsung-retailer-data",
        component: UploadSamsungRetailerDataComponent,
      },

      {
        path: "manage-snd-kpis",
        component: UploadSndKpisComponent,
      },

      

      {
        path: "upload-tgt-file",
        component: UploadTgtFileComponent
      },

      {
        path: "upload-sales-file",
        component: UploadSalesFileComponent
      },

      {
        path: "samsung-retailer-data-report",
        component: SamsungRetailerDataReportComponent,
      },

      {
        path: "shop_location_approval",
        component: ShopLocationApprovalComponent,
      },

      {
        path: "samsung-claim-management-opd",
        component: SamsungClaimManagementOPDComponent,
      },
      {
        path: "samsung-claim-management-travelling",
        component: SamsungClaimManagementTravellingComponent,
      },
      {
        path: "samsung-leave-management",
        component: SamsungLeaveManagementComponent,
      },
      {
        path: "samsung-hr-incentives-management",
        component: SamsungHrIncentivesManagementComponent,
      },
      {
        path: "samsung-hr-incentives-file-upload",
        component: SamsungHrIncentivesFileUploadComponent,
      },

      {
        path: "samsung-claim-images/:id",
        component: SectionClaimImagesComponent,
      },

      { path: "lucky-draw-spinner", component: LuckyDrawSpinnerComponent },
      { path: "spinner-fileupload", component: SpinnerFileuploadComponent },
      { path: "spinner-animation", component: SpinnerAnimationComponent },
      {
        path: "spinner-animation-draw",
        component: SpinnerAnimationDrawComponent,
      },
      {
        path: "spinner-animation-draw-new",
        component: SpinnerAnimationDrawNewComponent,
      },

      { path: "test-component", component: TestComponent },
      { path: "test-component2", component: TestComponent2 },
      { path: "test-component3", component: TestComponent3 },

      { path: "test-component-git-lib", component: TestComponentGitLib },

      { path: "role_management", component: RoleManagementComponent },

      { path: "upload_routes/:surveyorId", component: ShopWiseRoutesComponent },
      {
        path: "merchandiser-planned-calls",
        component: MerchandiserPlannedCallsComponent,
      },
      { path: "availability-tableau", component: DashboardTableauComponent },
      { path: "rental-dashboard", component: ProductivityTableauComponent },
      { path: "availability-dashboard", component: SkuDashboardComponent },
      { path: "mt-dashboard", component: MtDashboardComponent },
      { path: "gt-dashboard", component: GtDashboardComponent },
      { path: "sss-gt-dashboard", component: SssGtDashboardComponent },
      { path: "compliance-dashboard", component: ComplianceDashboardComponent },
      { path: "merchandiser_score", component: MerchandiserScoreComponent },
      { path: "vo_error_report", component: VoErrorReportComponent },
      { path: "raw_data/:reportId", component: RawDataComponent },
      { path: "dashboard_data/:reportId", component: DashboardDataComponent },
      { path: "upload_template", component: UploadTemplateComponent },
      
      {
        path: "map",
        component: MerchandiserAttendanceMapViewComponent,
      },
      {
        path: "merchandiser_wise_score",
        component: MerchandiserWiseScoreComponent,
      },
      {
        path: "merchandiser_score/:surveyorId/:startDate/:endDate",
        component: MerchandiserScoreComponent,
      },
      {
        path: "mtd-oos-mt",
        component: MtdOosReportComponent,
      },
      {
        path: "mtd-oos-gt",
        component: MtdOosReportComponent,
      },

      { path: "compliance-report", component: ComplienceReportComponent },
      {
        path: "capturedAbnormalUnvisited",
        component: UniqueBasedProductivityReportComponent,
      },
      { path: "expiry-data-mt", component: ExpiryDataReportComponent },
      { path: "expiry-data-gt", component: ExpiryDataReportComponent },
      {
        path: "compliance-dashboard-national",
        component: ComplianceDashboardNationalComponent,
      },
      { path: "vd-compliance-mt", component: VdComplianceMtComponent },
      { path: "vd-compliance-gt", component: VdComplianceGtComponent },
      { path: "attendance-report", component: AttendanceReportComponent },
      { path: "upload_hurdle_rates", component: UploadHurdleRateComponent },
      { path: "vd-report-mt", component: VdReportComponent },
      { path: "vd-report-gt", component: VdReportComponent },
      { path: "merchandiser_roster", component: MerchandiserRosterComponent },
      { path: "upload_desired_sos", component: UploadDesiredSosComponent },
      { path: "calender", component: CalenderDemoComponent },
      { path: "manage-compliance", component: ManageComplianceComponent },
      { path: "manage-ptc-file", component: ManagePtcFileComponent },
      
      {
        path: "tableau",
        component: TableauHelperComponent,
      },
      {
        path: "manage-vd",
        component: ManageVdComponent,
      },
      {
        path: "vdHurdleRate",
        component: UploadVdHurdleRatesComponent,
      },
      {
        path: "oos-shop-list",
        component: OosShopListComponent,
      },
      {
        path: "tsm-target-summary",
        component: TsmTargetSummaryComponent,
      },
      { path: "payroll-process", component: PayrollProcessComponent },
      { path: "payroll-unprocess", component: PayrollUnprocessComponent },
    ],
  },
  // { path: 'shop_detail/:id', component: ShopDetailComponent },
  { path: "shop_detail/:id", component: ShopDetailComponent },
  { path: "shop_detail_sro/:id", component: SROShopDetailComponent },

  {
    path: "evaluation",
    loadChildren: () =>
      import("./evaluation/evaluation.module").then((m) => m.EvaluationModule),
  },
  {
    path: "instogram",
    loadChildren: () =>
      import("./instotracker/instotracker.module").then(
        (m) => m.InstotrackerModule
      ),
  },
  {
    path: "virtual_view",
    loadChildren: () =>
      import("./virtual-view/virtual-view.module").then(
        (m) => m.VirtualViewModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
