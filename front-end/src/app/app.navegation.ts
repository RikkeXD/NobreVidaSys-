import { Navegation } from "./core/models/NavegationModel";
import { MenuCategory } from "./core/models/MenuCategoryModel";
import { CadClienteComponent } from "./pages/cadastro/cad-cliente/cad-cliente.component";
import { CadUsuarioComponent } from "./pages/cadastro/cad-usuario/cad-usuario.component";
import { CadProdutoComponent } from "./pages/cadastro/cad-produto/cad-produto.component";
import { authGuard } from "./core/auth/guard/auth.guard";
import { ListaClienteComponent } from "./pages/lista/lista-cliente/lista-cliente.component";
import { ListaUsuarioComponent } from "./pages/lista/lista-usuario/lista-usuario.component";
import { ListaProdutoComponent } from "./pages/lista/lista-produto/lista-produto.component"
import { CadEmpresaComponent } from "./pages/cadastro/cad-empresa/cad-empresa.component";
import { CriarVendaComponent } from "./pages/venda/criar-venda/criar-venda.component";
import { ListaPedidoComponent } from "./pages/venda/lista-pedido/lista-pedido.component";

const navegationMenu: MenuCategory[] = [
    {
        title:'Dashboard',
        icon: "bx bx-home-alt",
        route: ""
    },
    {
    title: "Cliente",
    icon: "bx bxs-group",
    subMenu: [
        { title: "Lista de Cliente", route: "lista/cliente" },
        { title: "Cadastro de Cliente", route: "cadastro/cliente" },
    ]},
    {
        title: "Usuario",
        icon: "bx bx-user",
        subMenu: [
            { title: "Lista de Usuario", route: "lista/usuario" },
            { title: "Cadastro de Usuario", route: "cadastro/usuario" },
        ]
    },
    {
        title: "Empresa",
        icon: "bx bx-store-alt",
        subMenu: [
            { title: "Lista de Empresa", route: "lista/empresa" },
            { title: "Cadastro de Empresa", route: "cadastro/empresa" },
        ]
    },
    {
        title: "Pedido",
        icon: "bx bxs-cart",
        subMenu: [
            { title: "Novo Pedido", route: "criar/venda" },
            { title: "Lista de Pedidos", route: "lista/pedido" },
        ]
    },
    {
        title: "Produto",
        icon: "bx bxs-basket",
        subMenu: [
            { title: "Lista de Produto", route: "lista/produto" },
            { title: "Cadastro de Produto", route: "cadastro/produto" },
        ]
    },
    {
        title: "Embalagem",
        icon: "bx bxs-package",
        subMenu: [
            { title: "Lista de Embalagem", route: "lista/embalagem" },
            { title: "Cadastro de Embalagem", route: "cadastro/embalagem" },
        ]
    }
]

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
    }, {
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



export { navegationMenu }