import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SideNavBarComponent } from './shared/side-nav-bar/side-nav-bar.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GlobalMessageService } from './core/auth/services/global-message.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SideNavBarComponent,ToastModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-sv';
  login!: boolean

  private routerService = inject(Router)
  private globalMessageService = inject(GlobalMessageService)

  verificarToken() {
    return !!localStorage.getItem('token')
  }
}
