import { Routes } from '@angular/router';
import { CadUsuarioComponent } from './pages/cadastro/cad-usuario/cad-usuario.component';
import { CadClienteComponent } from './pages/cadastro/cad-cliente/cad-cliente.component';
import { authGuard } from './core/auth/guard/auth.guard';
import { CadProdutoComponent } from './pages/cadastro/cad-produto/cad-produto.component';
import { CadEmbalagemComponent } from './pages/cadastro/cad-embalagem/cad-embalagem.component';
import { ListaProdutoComponent } from './pages/lista/lista-produto/lista-produto.component';
import { ListaClienteComponent } from './pages/lista/lista-cliente/lista-cliente.component';
import { ListaUsuarioComponent } from './pages/lista/lista-usuario/lista-usuario.component';
import { CadEmpresaComponent } from './pages/cadastro/cad-empresa/cad-empresa.component';
import { ListaEmpresaComponent } from './pages/lista/lista-empresa/lista-empresa.component';
import { ListaEmbalagemComponent } from './pages/lista/lista-embalagem/lista-embalagem.component';
import { CriarVendaComponent } from './pages/venda/criar-venda/criar-venda.component';
import { ListaPedidoComponent } from './pages/venda/lista-pedido/lista-pedido.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path:"cadastro/usuario",
        component: CadUsuarioComponent,
        canActivate: [authGuard]
    },
    {
        path:"criar/venda",
        component: CriarVendaComponent,
        canActivate: [authGuard]
    },
    {
        path:"cadastro/cliente",
        component: CadClienteComponent,
        canActivate: [authGuard]
    },
    {
        path:"cadastro/produto",
        component: CadProdutoComponent,
        canActivate: [authGuard]
    },
    {
        path:"cadastro/embalagem",
        component: CadEmbalagemComponent,
        canActivate: [authGuard]
    },
    {
        path:"cadastro/empresa",
        component: CadEmpresaComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/embalagem",
        component: ListaEmbalagemComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/produto",
        component: ListaProdutoComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/cliente",
        component: ListaClienteComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/usuario",
        component: ListaUsuarioComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/empresa",
        component: ListaEmpresaComponent,
        canActivate: [authGuard]
    },
    {
        path:"lista/pedido",
        component: ListaPedidoComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
]
