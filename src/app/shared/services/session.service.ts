import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionIdKey = 'JSESSIONIDNEW';

  constructor() { }

  // Store the JSESSIONID
  storeSessionId(sessionId: string): void {
    localStorage.setItem(this.sessionIdKey, sessionId);
  }

  // Get the stored JSESSIONID
  getStoredSessionId(): string | null {
    return localStorage.getItem(this.sessionIdKey);
  }

  // Compare the current JSESSIONID with the stored one
  compareSessionId(currentSessionId: string): boolean {
    const storedSessionId = this.getStoredSessionId();
    return storedSessionId === currentSessionId;
  }

  getStringAfterEquals(str: string): string {
    const index = str.indexOf('=');
    if (index !== -1 && index < str.length - 1) {
        return str.substring(index + 1);
    }
    return '';
}

  // Retrieve JSESSIONID from cookies
  getSessionIdFromCookie(): string {
  //  debugger;
    let sessionIdFromCookie= '';
    const name = 'JSESSIONIDNEW=';
   // const decodedCookie = decodeURIComponent(document.cookie);
   if(document.cookie){
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if(c.includes(name)){
        sessionIdFromCookie = this.getStringAfterEquals(c);
      }
      else{
        sessionIdFromCookie= '';
      }
      // while (c.charAt(0) === ' ') {
      //   c = c.substring(1);
      // }
      // if (c.indexOf(name) === 0) {
      //   return c.substring(name.length, c.length);
      // }
    }
   }

   return sessionIdFromCookie;
  }
}
