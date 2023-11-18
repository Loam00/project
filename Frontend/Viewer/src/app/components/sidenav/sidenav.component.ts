import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './navData';
import { transition, trigger, style, animate, keyframes } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
        style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms',
        style({opacity: 0})
        )
      ])
    ]),
      trigger('rotate', [
        transition(':enter', [
          animate('1000ms',
            keyframes([
              style({transform: 'rotate(0deg)', offset: '0'}),
              style({transform: 'rotate(2turn)', offset: '1'})
            ])
          )
        ])
      ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  isAuthenticated = false;

  @HostListener('window:resize', ['$event'])
  OnResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  constructor(private AuthService: AuthService) {};

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.AuthService.isUserLoggedIn$.subscribe( (isLoggedIn) => {
      for(let i=1; i<3; i++) {
      this.navData[i].isLoggedIn = !isLoggedIn;
      }
      for(let i = 3; i < 7; i++){
        this.navData[i].isLoggedIn = isLoggedIn;
      }
    })
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

}
