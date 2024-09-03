import { Injectable, NgZone } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  // idleState = 'Not started.';
  // timedOut = false;
  // lastPing?: Date = null;

  // constructor(
  //   private idle: Idle,
  //   private keepalive: Keepalive,
  //   private toastr: ToastrService,
  //   private router: Router,
  //   private ngZone: NgZone
  // ) {
  //   idle.setIdle(6000); // 5 seconds idle time
  //   idle.setTimeout(5); // 5 seconds timeout after idle
  //   idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

  //   idle.onIdleEnd.subscribe(() => {
  //     this.idleState = 'No longer idle.';
  //     console.log(this.idleState);
  //   });
  //   idle.onTimeout.subscribe(() => {
  //     this.idleState = 'Timed out!';
  //     this.timedOut = true;
  //     this.logout();
  //     console.log(this.idleState);
  //   });
  //   idle.onIdleStart.subscribe(() => {
  //     this.idleState = 'You\'ve gone idle!';
  //     console.log(this.idleState);
  //   });

  //   keepalive.interval(5); // Ping interval of 5 seconds
  //   keepalive.onPing.subscribe(() => {
  //     this.lastPing = new Date();
  //     console.log('Last keepalive ping:', this.lastPing);
  //   });

  //   // Removed visibility change event listener as requested
  //   window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  // }

  // handleBeforeUnload(event: Event) {
  //   // Optionally save the state or perform other actions here if needed
  //   // Removed the logout call to prevent automatic logout on page refresh
  // }

  // startWatching() {
  //   this.reset();
  // }

  // stopWatching() {
  //   this.idle.stop();
  //   this.idleState = 'Stopped.';
  //   console.log(this.idleState);
  // }

  // reset() {
  //   this.idle.watch();
  //   this.idleState = 'Started.';
  //   this.timedOut = false;
  //   console.log(this.idleState);
  // }

  // logout() {
  //   localStorage.clear();
  //   this.router.navigate(['/login']);
  //   this.stopWatching();
  //   window.location.reload();
  // }
}
