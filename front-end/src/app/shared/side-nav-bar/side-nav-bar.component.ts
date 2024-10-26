import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../core/auth/services/token.service';
import { navegationMenu } from '../../app.navegation';
import { MenuCategory } from '../../core/models/MenuCategoryModel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  subMenu?: Array<{ title: string; route: string }>;
}

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    OverlayPanelModule,
    ButtonModule
  ],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  userName!: string | null
  userSobrenome!: string | null
  userPermissao!: string | null
  empresaPrincipal!: string | null
  isReportsMenuOpen = false;
  subMenuOpen: boolean[] = [];
  protected isSidebarClosed = true;

  private tokenService = inject(TokenService)

  menuItems = navegationMenu
  
  ngOnInit(){
    this.userName = this.tokenService.getNome()
    this.userSobrenome = this.tokenService.getSobrenome()
    this.userPermissao = this.tokenService.getPermissao() === '0' ? "Administrador": "Usuario Padrão"
    this.empresaPrincipal = this.tokenService.getEmpresaPrincipal()
    this.subMenuOpen = new Array(this.menuItems.length).fill(false);
  }

  toggleSidebar() {
      this.isSidebarClosed = !this.isSidebarClosed;
  }

  logout(): void{
    this.tokenService.removeToken()
    window.location.reload()
  }

  toggleSubMenu(index: number) {
    this.subMenuOpen[index] = !this.subMenuOpen[index];
  }
}