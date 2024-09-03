import { Component, OnInit,Renderer2,AfterViewInit  } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  private intervalId: any;
  pmirm: boolean;
  localhost: boolean=false;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const hostName = window.location.hostname;
    this.pmirm = hostName?.indexOf("pmirm") >= 0;
    this.localhost = hostName?.indexOf("localhost") >= 0;
    if(this.pmirm || this.localhost === true){
    this.loadOneTrustScript();
  }}

  ngAfterViewInit(): void {
    if(this.pmirm || this.localhost === true){

    setTimeout(() => {
      this.ensureScreenInteractive();
    }, 1000); 
  }
  }

  loadOneTrustScript(): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
    script.charset = 'UTF-8';
    script.setAttribute('data-document-language', 'true');
    script.setAttribute('data-domain-script', '018f3dd3-70e8-7671-902e-98b0a4ce5d04-test');
    script.onload = this.onOneTrustLoad.bind(this);
    script.onerror = this.onOneTrustError.bind(this);
    this.renderer.appendChild(document.head, script);
  }

  onOneTrustLoad(): void {
    console.log('OneTrust script loaded successfully');
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = 'function OptanonWrapper() { }';
    this.renderer.appendChild(document.head, script);
  }

  onOneTrustError(): void {
    console.error('Failed to load OneTrust script');
  }
  private ensureScreenInteractive(): void {
    console.log('Checking for blocking overlay...');
    this.intervalId = setInterval(() => {
      const blockingElement = document.querySelector('.onetrust-pc-dark-filter') as HTMLElement;
      if (blockingElement) {
        console.log('Found blocking overlay, disabling its blocking behavior.');
        blockingElement.style.display = 'none'; // Hide the blocking overlay
        // Additional cleanup or adjustments specific to your application
        clearInterval(this.intervalId); // Stop checking once handled
      } else {
        console.log('No blocking overlay found.');
      }
    }, 500);
  }
}