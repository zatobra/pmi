import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toastr-custom',
  templateUrl: './toastr-custom-component.html',
  styleUrls: ['./toastr-custom-component.scss']
})
export class ToastrCustomComponent {
  title: string;
  message: string;

  constructor(private toastr: ToastrService) {}

  buttonClick() {
    this.toastr.success('Button Clicked', 'Info');
  }
}
