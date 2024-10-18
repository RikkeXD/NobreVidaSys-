import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../core/auth/services/token.service';
import { navegationMenu } from '../../app.navegation';
import { MenuCategory } from '../../core/models/MenuCategoryModel';

interface MenuItem {
  title: string;
  icon: string;
  route?: string; // Para links diretos
  subMenu?: Array<{ title: string; route: string }>; // Para submenus
}

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterOutlet,
    CommonModule

  ],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  userName!: string | null
  userSobrenome!: string | null
  userPermissao!: string | null
  isReportsMenuOpen = false;
  subMenuOpen: boolean[] = [];
  protected isSidebarClosed = true;

  private tokenService = inject(TokenService)

  menuItems = navegationMenu

  
  ngOnInit(){
    console.log(navegationMenu)
    this.userName = this.tokenService.getNome()
    this.userSobrenome = this.tokenService.getSobrenome()
    this.userPermissao = this.tokenService.getPermissao() === '0' ? "Administrador": "Usuario Padrão"
    console.log('nome', this.userName)
    console.log('sobrenome', this.userSobrenome)
    console.log('permissao', this.tokenService.getPermissao())
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