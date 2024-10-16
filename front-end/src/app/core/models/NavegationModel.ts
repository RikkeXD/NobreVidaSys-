export interface Navegation {
    router: string,
    name: string,
    pathMatch?: string,
    redirectTo?: string,
    component: any,
    canActivate?: any,
    icon?: string
}