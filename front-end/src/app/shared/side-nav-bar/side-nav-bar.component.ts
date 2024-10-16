import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuCategory } from '../../core/models/MenuCategoryModel';
import { menu } from '../../app.navegation';
import { TokenService } from '../../core/auth/services/token.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
    ],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  userName!: string | null
  navegation: MenuCategory[] | undefined

  private tokenService = inject(TokenService)

  ngOnInit(){
    this.userName = this.tokenService.getNome()
    this.navegation = menu
  }

  logout(): void{
    this.tokenService.removeToken()
    window.location.reload()
  }
}