import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { VoTrackingComponent } from './vo-tracking/vo-tracking.component';
import { DataTrackingComponent } from './data-tracking/data-tracking.component';
import { UnvisistedMapComponent } from './unvisisted-map/unvisisted-map.component';
import { CapturedShopsComponent } from './captured-shops/captured-shops.component';
import { VoLiveTrackingComponent } from './vo-live-tracking/vo-live-tracking.component';
import { RouteTrackerComponent } from './route-tracker/route-tracker.component';
import { RouteTracker2Component } from './route-tracker-2/route-tracker2.component';
import { RouteTracker3Component } from './route-tracker-3/route-tracker3.component';
import { RouteTrackerPMIRMComponent } from './route-tracker-pmirm/route-tracker-pmirm.component';

const routes: Routes = [
  { path: '',redirectTo:'list' ,pathMatch:'full' },
  { path: 'list', component:MainComponent,
children:[
  { path: '', redirectTo:'tracking',pathMatch:'full'},
  { path: 'tracking',component:VoTrackingComponent },
  { path: 'data-tracking',component:DataTrackingComponent },
  { path: 'unvisisted-map',component:UnvisistedMapComponent },
  { path: 'captured-shops',component:CapturedShopsComponent },
  { path: 'vo-live-tracking',component:VoLiveTrackingComponent },
  { path: 'route-tracker',component:RouteTrackerComponent },
  { path: 'route-tracker-pmirm',component:RouteTrackerPMIRMComponent },
  // { path: 'vo-live-tracking/:surveyorId', component: VoLiveTrackingComponent }
  
] },
{ path: 'route_tracker_2',component:RouteTracker2Component },
{ path: 'route_tracker_3',component:RouteTracker3Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualViewRoutingModule { }
