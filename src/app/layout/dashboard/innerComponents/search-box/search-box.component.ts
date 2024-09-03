import { Component, Input, Output, EventEmitter } from "@angular/core";
@Component({
  selector: "search-box",
  templateUrl: "./search-box.component.html",
  styleUrls: ["./search-box.component.scss"],
})
export class SearchBoxComponent {
  isActive = true;
  @Input("list") data: any;
  @Output() notify: EventEmitter<any> = new EventEmitter();
  filteredList: any = [];
  value: String;

  applyFilter() {
    if (!this.value) {
      this.filteredList = this.data;
    } else {
      this.filteredList = this.data.filter((x) =>
        Object.keys(x).some((key) =>
          String(x[key]).toLowerCase().includes(this.value.toLowerCase())
        )
      );
    }
    this.notify.emit(this.filteredList);
  }

  // to match in only two property
  // applyFilter() {
  //   if (!this.value) {
  //     this.filteredList = this.data;
  //   } else {
  //     this.filteredList = this.data.filter((x) =>
  //       x.title.toLowerCase().includes(this.value.toLowerCase()) ||
  //       x.name.toLowerCase().includes(this.value.toLowerCase())
  //     );
  //   }
  //   this.notify.emit(this.filteredList);
  // }
  

  onSearch(value: string): void {
    const filterValue = value.toLowerCase();
    const filteredOptions = this.data.filter((option) => {
      for (const prop in option) {
        if (
          option.hasOwnProperty(prop) &&
          typeof option[prop] === "string" &&
          option[prop].toLowerCase().includes(filterValue)
        ) {
          return true;
        }
      }
      return false;
    });
    this.notify.emit(filteredOptions);
  }

  onFilterClick(): void {
    if (!this.value) {
      this.filteredList = this.data;
      this.notify.emit(this.filteredList);
    } else {
      const filterValue = this.value.toLowerCase();
      const filteredOptions = this.data.filter((option) => {
        for (const prop in option) {
          if (
            option.hasOwnProperty(prop) &&
            typeof option[prop] === "string" &&
            option[prop].toLowerCase().includes(filterValue)
          ) {
            return true;
          }
        }
        return false;
      });
      this.notify.emit(filteredOptions);
    }
  }

  cancelFilter() {
    this.value = "";
    this.filteredList = this.data;
    console.log("this.filteredList: " + this.filteredList);
    this.notify.emit(this.filteredList);
  }
}
