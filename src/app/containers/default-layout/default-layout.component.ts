import { Component, OnInit } from "@angular/core";
import { navItems } from "../../_nav";
import { navItemsPremium } from "../../_nav_premium";
import { AutenticacaoService } from "../../autenticacao/autenticacao.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = [];

  constructor(private autenticacaoService: AutenticacaoService) {}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit() {
    const premium = this.autenticacaoService.getPremium();
    this.navItems = premium ? navItemsPremium : navItems;
  }

  logout() {
    this.autenticacaoService.logout();
  }
}
