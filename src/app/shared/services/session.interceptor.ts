import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService,public router: Router,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    // // Clone the request to add the boolean parameter
    // const modifiedReq = req.clone({
    //   setParams: {
    //     booleanParam: 'true'  // Set your boolean value here, convert it to string
    //   },
    // setHeaders: {
    //   booleanHeader: 'true'  // Set your boolean value here, convert it to string
    // }
   // body: { ...req.body, ...jsonObject }
    // });
    // // Pass the modified request to the next handler
    // return next.handle(modifiedReq);

    // const storedSessionId = this.sessionService.getStoredSessionId();


    // Compare session IDs before the request
    // const currentSessionId = this.sessionService.getSessionIdFromCookie();
   
    // if (storedSessionId && storedSessionId !== currentSessionId) {
    //  // this.authService.logout();
    // //  localStorage.removeItem("isLoggedin");
    // // this.router.navigate(["/login"]);
    //   return next.handle(req);
    // }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Extract the JSESSIONID from the response headers
     //     debugger;
         //  const newSessionId2= this.getSessionIdFromResponse(event);
         const storedSessionId = this.sessionService.getStoredSessionId();
          const newSessionId = this.sessionService.getSessionIdFromCookie();
        //  const newSessionId = document.cookie;

          if (newSessionId) {
         
            // Compare session IDs after the response
            if (storedSessionId && newSessionId && storedSessionId != newSessionId) {
           
              this.sessionService.storeSessionId(newSessionId);
              localStorage.removeItem("isLoggedin");
              this.router.navigate(["/login"]);
              window.location.reload();
            // this.authService.logout();
           //  this.sessionService.storeSessionId(newSessionId);
            } else {
              // Update the stored session ID if necessary
           
              this.sessionService.storeSessionId(newSessionId);
            }
          }
        }
      })
    );
  }

  private getSessionIdFromResponse(response: HttpResponse<any>): string | null {
   
    const jsonString = JSON.stringify(response.body);
    console.log(jsonString);

    // Extract and log the headers
    const headers = response.headers;
    headers.keys().forEach(key => {
      console.log(`${key}: ${headers.get(key)}`);
    });

    // Get specific header value
    const setCookie = headers.get('Set-Cookie');
    console.log('Set-Cookie:', setCookie);
    const sessionIdCookie = response.headers.get('Set-Cookie');
    if (sessionIdCookie) {
      const match = sessionIdCookie.match(/JSESSIONID=([^;]+);/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
}
