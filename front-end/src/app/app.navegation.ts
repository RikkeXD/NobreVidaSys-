import { Navegation } from "./core/models/NavegationModel";
import { MenuCategory } from "./core/models/MenuCategoryModel";
import { CadClienteComponent } from "./pages/cadastro/cad-cliente/cad-cliente.component";
import { CadUsuarioComponent } from "./pages/cadastro/cad-usuario/cad-usuario.component";
import { CadProdutoComponent } from "./pages/cadastro/cad-produto/cad-produto.component";
import { authGuard } from "./core/auth/guard/auth.guard";
import { ListaClienteComponent } from "./pages/lista/lista-cliente/lista-cliente.component";
import { ListaUsuarioComponent } from "./pages/lista/lista-usuario/lista-usuario.component";
import {ListaProdutoComponent } from "./pages/lista/lista-produto/lista-produto.component"
import { CadEmpresaComponent } from "./pages/cadastro/cad-empresa/cad-empresa.component";
import { CriarVendaComponent } from "./pages/venda/criar-venda/criar-venda.component";
import { ListaPedidoComponent } from "./pages/venda/lista-pedido/lista-pedido.component";

let menu: MenuCategory[] = []

const cadastro: Navegation[] = [
    {
        router: "cadastro/cliente",
        name: "Cadastro de cliente",
        component: CadClienteComponent,
        canActivate: [authGuard]
    },
    {
        router: "cadastro/usuario",
        name: "Cadastro de usuario",
        component: CadUsuarioComponent,
        canActivate: [authGuard]
    },{
        router: "cadastro/produto",
        name: "Cadastro de produto",
        component: CadProdutoComponent,
    },
    {
        router: "cadastro/embalagem",
        name: "Cadastro de embalagem",
        component: CadProdutoComponent,
    },
    {
        router: "cadastro/empresa",
        name: "Cadastro de empresa",
        component: CadEmpresaComponent,
    }
]

const lista: Navegation[] = [
    {
        router: "lista/cliente",
        name: "Lista de cliente",
        component: ListaClienteComponent,
        canActivate: [authGuard]
    },
    {
        router: "lista/usuario",
        name: "Lista de usuario",
        component: ListaUsuarioComponent,
        canActivate: [authGuard]
    },
    {
        router: "lista/produto",
        name: "Lista de produto",
        component: ListaProdutoComponent,
        canActivate: [authGuard]
    },
    {
        router: "lista/embalagem",
        name: "Lista de embalagem",
        component: CadProdutoComponent,
        canActivate: [authGuard]
    },
    {
        router: "lista/empresa",
        name: "Lista de empresa",
        component: ListaProdutoComponent,
        canActivate: [authGuard]
    },
    {
        router: "lista/pedido",
        name: "Lista de pedidos",
        component: ListaPedidoComponent,
        canActivate: [authGuard]
    }
]

const venda: Navegation[] = [
    {
        router: "criar/venda",
        name: "Criar Venda",
        component: CriarVendaComponent,
        canActivate: [authGuard]
    }
]

menu.push({ category: "Cadastro", icon:"add_circle", navegation: cadastro });
menu.push({ category: "Lista", icon:"add_circle", navegation: lista });
menu.push({ category: "Venda", icon:"add_circle", navegation: venda });

export { menu }