import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = true;

  openAuditSegurity = false;
  openComercial = false;
  openUtilities = false;
  constructor() { }

  ngOnInit() {
  }

}
