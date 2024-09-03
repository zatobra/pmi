import { LayoutModule } from "@angular/cdk/layout";
import { OverlayModule } from "@angular/cdk/overlay";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  LocationStrategy,
  HashLocationStrategy,
  KeyValuePipe,
} from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { Config } from "src/assets/config";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { SessionService } from "./shared/services/session.service";
import { SessionInterceptor } from "./shared/services/session.interceptor";
import { SessionInterceptorNew } from "./shared/services/session.interceptor.new";
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  /* for development
    return new TranslateHttpLoader(
        http,
        '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
        '.json'
    );*/
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    OverlayModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      preventDuplicates: true,
      countDuplicates: true,
      autoDismiss: true,
    }),
    AgmCoreModule.forRoot({
      apiKey: Config.API_KEY,
      libraries: ["places", "geometry"],
    }),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    NgIdleKeepaliveModule.forRoot()
  ],

  exports: [],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    KeyValuePipe,
    SessionService,
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
