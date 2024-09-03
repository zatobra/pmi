import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() item: any;
  showSubMenu: boolean = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }

  isNavigationItem(): boolean {
    return !this.item.subMenu;
  }

  getRouterLink(): string[] {
    if (this.item.link) {
      return ['/dashboard', this.item.link];
    }
    return [];
  }

   // This is for debugging purposes to check the value of link
   debugLog() {
    console.log('Router link:', this.getRouterLink());
  }

  

}
