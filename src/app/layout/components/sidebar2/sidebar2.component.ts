import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import {NgModule,ElementRef,Renderer2,ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, AfterContentInit, ContentChildren, QueryList, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MegaMenuItem,MenuItem, PrimeTemplate} from 'primeng/api';
import {RouterModule} from '@angular/router';
// import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: "app-sidebar2",
  templateUrl: "./sidebar2.component.html",
  styleUrls: ["./sidebar2.component.scss"],
})
export class Sidebar2Component implements OnInit {
//  p-tieredMenu = [
//     {
//         label: 'Videos1', icon: 'pi pi-fw pi-video',
//         // name: "vid",
//         routerLink:['/dashboard/app_builds'],
    
//         items: [
//             [
//                 {
//                     label: 'Video1 1',
//                     // name: "vid",
//                     // routerLink:["/dashboard/upload_routes_new"],
//                     command: () => this.router.navigate(['/dashboard/upload_routes_new']),
                   
//                 },
//                 {
//                     label: 'Video1 2',
//                     // name: "vid",
//                     routerLink:['/dashboard/app_builds'],
//                 }
//             ],
            
//         ]
//     },


//     {
//         label: 'Videos2', icon: 'pi pi-fw pi-video',
//         name: "vid",
//         command: () => this.router.navigate(['/dashboard/upload_routes_new']),
//         items: [
//             [
//                 {
//                     label: 'Video2 1',
//                     name: "vid",
//                     // routerLink:["/dashboard/upload_routes_new"],
//                     command: () => this.router.navigate(['/dashboard/upload_routes_new']),
                   
//                 },
//                 {
//                     label: 'Video2 2',
//                     name: "vid",
//                     routerLink:['/dashboard/app_builds'],
//                 }
//             ],
            
//         ]
//     },
  
    
// ];
items = [
    {
    label: 'Reporthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    icon: 'pi pi-upload',
    items: [
        [{
            //ADD THIS HERE
            items:[
                {
                label: 'Report 1',
                // routerLink:['/dashboard/upload_routes_new'],
                // command: () => this.router.navigate(['/dashboard/upload_routes_new']),
                items: [
                    [{
                        //ADD THIS HERE
                        items:[
                            {
                            label: 'Report 1',
                            routerLink:['/dashboard/upload_routes_new'],
                            // command: () => this.router.navigate(['/dashboard/upload_routes_new']),
                            
                        },
                        {
                            label: 'Report',
                            routerLink:['/dashboard/productivity_report']
                            // command: () => this.router.navigate(['/dashboard/productivity_report']),
                        },
            
                    ]
                    }]
                ]
                
            },
            {
                label: 'Report',
                routerLink:['/dashboard/productivity_report']
                // command: () => this.router.navigate(['/dashboard/productivity_report']),
            },

        ]
        }]
    ]
},
{
    label: 'Main', 
    icon: 'pi pi-fw pi-calendar', 
    routerLink:['/dashboard/merchandiser_List']
    // command: () => this.router.navigate(['/dashboard/merchandiser_List']),
}]


items2 = [
    {
    label: 'File',
    icon:'pi pi-fw pi-file',
    items: [
        {
            label: 'New',
            icon:'pi pi-fw pi-plus',
            items: [
                {
                label: 'Bookmark',
                icon:'pi pi-fw pi-bookmark'
                },
                {
                label: 'Video',
                icon:'pi pi-fw pi-video'
                }
            ]
        },
        {
            label: 'Delete',
            icon:'pi pi-fw pi-trash'
        },
        {
            label: 'Export',
            icon:'pi pi-fw pi-external-link'
        }
    ]
    },
    {
    label: 'Edit',
    icon:'pi pi-fw pi-pencil',
    items: [
        {
            label: 'Left',
            icon:'pi pi-fw pi-align-left'
        },
        {
            label: 'Right',
            icon:'pi pi-fw pi-align-right'
        },
        {
            label: 'Center',
            icon:'pi pi-fw pi-align-center'
        },
        {
            label: 'Justify',
            icon:'pi pi-fw pi-align-justify'
        }
    ]
    },
    {
    label: 'Users',
    icon:'pi pi-fw pi-user',
    items: [
        {
            label: 'New',
            icon:'pi pi-fw pi-user-plus',

        },
        {
            label: 'Delete',
            icon:'pi pi-fw pi-user-minus',
        },
        {
            label: 'Search',
            icon:'pi pi-fw pi-users',
            items: [
                {
                label: 'Filter',
                icon:'pi pi-fw pi-filter',
                items: [
                    {
                        label: 'Print',
                        icon:'pi pi-fw pi-print'
                    }
                ]
                },
                {
                icon:'pi pi-fw pi-bars',
                label: 'List'
                }
            ]
        }
    ]
    },
    {
    label: 'Events',
    icon:'pi pi-fw pi-calendar',
    items: [
        {
            label: 'Edit',
            icon:'pi pi-fw pi-pencil',
            items: [
                {
                label: 'Save',
                icon:'pi pi-fw pi-calendar-plus'
                },
                {
                label: 'Delete',
                icon:'pi pi-fw pi-calendar-minus'
                }
            ]
        },
        {
            label: 'Archieve',
            icon:'pi pi-fw pi-calendar-times',
            items: [
                {
                label: 'Remove',
                icon:'pi pi-fw pi-calendar-minus'
                }
            ]
        }
    ]
    }
];


items3: MenuItem[] = [
    {
        label: 'File',
        items: [{
                label: 'New', 
                icon: 'pi pi-fw pi-plus',
                items: [
                    {label: 'Project', routerLink:['/dashboard/productivity_report']},
                    {label: 'Other' , routerLink:['/dashboard/productivity_report']},
                ]
            },
            {label: 'Open', 
            // if (condition) {
                
            // }
            routerLink:['/dashboard/productivity_report']
        },
            {label: 'Quit', routerLink:['/dashboard/productivity_report']}
        ]
    },
    {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {label: 'Delete', icon: 'pi pi-fw pi-trash', routerLink:['/dashboard/productivity_report']},
            {label: 'Refresh', icon: 'pi pi-fw pi-refresh', routerLink:['/dashboard/productivity_report']}
        ]
    },
    {
        label: 'end',
        icon: 'pi pi-fw pi-pencil',
        routerLink:['/dashboard/productivity_report']
    },
    {
        label: 'end',
        icon: 'pi pi-fw pi-pencil',
        routerLink:['/dashboard/productivity_report']
    },
    {
        label: 'end',
        icon: 'pi pi-fw pi-pencil',
        routerLink:['/dashboard/productivity_report']
    },
    // {
    //     label: 'end',
    //     icon: 'pi pi-fw pi-pencil',
    //     routerLink:['/dashboard/productivity_report']
    // },
    // {
    //     label: 'endddddddddddddddddddddddddddddddddddddggggggggg',
    //     icon: 'pi pi-fw pi-pencil',
    //     routerLink:['/dashboard/productivity_report']
    // },
    // {
    //     label: 'end',
    //     icon: 'pi pi-fw pi-pencil',
    //     routerLink:['/dashboard/productivity_report']
    // },
    // {
    //     label: 'end',
    //     icon: 'pi pi-fw pi-pencil',
    //     routerLink:['/dashboard/productivity_report']
    // },
    // {
    //     label: 'end',
    //     icon: 'pi pi-fw pi-pencil',
    //     routerLink:['/dashboard/productivity_report']
    // },
];


items4 = [
    {
        label: 'Videos', icon: 'pi pi-fw pi-video',
        items: [
            [
                {
                    label: 'Video 1',
                    // routerLink:['/dashboard/productivity_report']
                    items: [{label: 'Video 1.1', routerLink:['/dashboard/productivity_report']}, {label: 'Video 1.2'}]
                },
                {
                    label: 'Video 2',
                    items: [{label: 'Video 2.1'}, {label: 'Video 2.2'}]
                }
            ],
            [
                {
                    label: 'Video 3',
                    items: [{label: 'Video 3.1'}, {label: 'Video 3.2'}]
                },
                {
                    label: 'Video 4',
                    items: [{label: 'Video 4.1'}, {label: 'Video 4.2'}]
                }
            ]
        ]
    },
    {
        label: 'Users', icon: 'pi pi-fw pi-users',
        items: [
            [
                {
                    label: 'User 1',
                    items: [{label: 'User 1.1'}, {label: 'User 1.2'}]
                },
                {
                    label: 'User 2',
                    items: [{label: 'User 2.1'}, {label: 'User 2.2'}]
                },
            ],
            [
                {
                    label: 'User 3',
                    items: [{label: 'User 3.1'}, {label: 'User 3.2'}]
                },
                {
                    label: 'User 4',
                    items: [{label: 'User 4.1'}, {label: 'User 4.2'}]
                }
            ],
            [
                {
                    label: 'User 5',
                    items: [{label: 'User 5.1'}, {label: 'User 5.2'}]
                },
                {
                    label: 'User 6',
                    items: [{label: 'User 6.1'}, {label: 'User 6.2'}]
                }
            ]
        ]
    },
    {
        label: 'Events', icon: 'pi pi-fw pi-calendar',
        items: [
            [
                {
                    label: 'Event 1',
                    items: [{label: 'Event 1.1'}, {label: 'Event 1.2'}]
                },
                {
                    label: 'Event 2',
                    items: [{label: 'Event 2.1'}, {label: 'Event 2.2'}]
                }
            ],
            [
                {
                    label: 'Event 3',
                    items: [{label: 'Event 3.1'}, {label: 'Event 3.2'}]
                },
                {
                    label: 'Event 4',
                    items: [{label: 'Event 4.1'}, {label: 'Event 4.2'}]
                }
            ]
        ]
    },
    {
        label: 'Settings', icon: 'pi pi-fw pi-cog',
        routerLink:['/dashboard/productivity_report']
    }
];




model: MenuItem[]= this.items2;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() orientation: string = 'horizontal';

    @Input() autoZIndex: boolean = true;

    @Input() baseZIndex: number = 0;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    activeItem: any;

    documentClickListener: any;

    startTemplate: TemplateRef<any>;

    endTemplate: TemplateRef<any>;

  @Input("hideSideBar") hideSideBar;
  public showMenu: string;
  menuList: any = [];
  value: any = 1;
  constructor(public el: ElementRef, public renderer: Renderer2, public cd: ChangeDetectorRef, private router: Router) {}
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch(item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                break;

                case 'end':
                    this.endTemplate = item.template;
                break;
            }
        });
    }

    onCategoryMouseEnter(event, menuitem: MegaMenuItem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return;
        }

        if (this.activeItem) {
            this.activeItem = menuitem;
        }
    }

    
    goto(){
      alert('Rows found!');
  }

    onCategoryClick(event, item: MenuItem | MegaMenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        if (item.items) {
            if (this.activeItem && this.activeItem === item) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
    }

    itemClick(event: MouseEvent, item: MenuItem | MegaMenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.activeItem = null;
    }

    getColumnClass(menuitem: MegaMenuItem) {
        let length = menuitem.items ? menuitem.items.length: 0;
        let columnClass;
        switch(length) {
            case 2:
                columnClass= 'p-megamenu-col-6';
            break;

            case 3:
                columnClass= 'p-megamenu-col-4';
            break;

            case 4:
                columnClass= 'p-megamenu-col-3';
            break;

            case 6:
                columnClass= 'p-megamenu-col-2';
            break;

            default:
                columnClass= 'p-megamenu-col-12';
            break;
        }

        return columnClass;
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = (event) => {
                if (this.el && !this.el.nativeElement.contains(event.target)) {
                    this.activeItem = null;
                    this.unbindDocumentClickListener();
                    this.cd.markForCheck();
                }
            };

            document.addEventListener('click', this.documentClickListener);
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }
}