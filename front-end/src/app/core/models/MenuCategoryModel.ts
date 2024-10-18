import { Navegation } from "./NavegationModel";

export interface MenuCategory {
    title: string;
    icon: string;
    route?: string; // Para links diretos
    subMenu?: Array<{ title: string; route: string }>; // Para submenus
  }