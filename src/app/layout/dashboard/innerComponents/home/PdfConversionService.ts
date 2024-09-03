// pdf-conversion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfConversionService {
  private apiUrl = 'http://localhost:8090/audit//api/convert-to-pdf'; // Update with your Java EE backend API URL
  private backendUrl = 'http://localhost:8090/audit//api/convert-to-pdf';

  constructor(private http: HttpClient) {}

  convertToPDF(htmlContent: string){
    const headers = new HttpHeaders({
      'Content-Type': 'text/html', // Set the content type to HTML
    });

    // Send the HTML content to the backend
    this.http
      .post(this.backendUrl, htmlContent, { headers, responseType: 'blob' })
      .subscribe((response) => {
        // Process the response, e.g., download the PDF
        this.downloadPdf(response);
      });
    }

    private downloadPdf(pdfBlob: Blob): void {
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'output.pdf';
      link.click();
  
      URL.revokeObjectURL(blobUrl);
    }
}
