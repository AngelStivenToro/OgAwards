import { OptionTypes, UserTypes } from "./d";

export const users: UserTypes[] = [
  {
    id: "1",
    name: "Angel Toro",
    email: "angel.toro@tncj.com",
    alias: "Toro",
  },
  {
    id: "2",
    name: "Camilo Galindo",
    email: "camilo.galindo@tncj.com",
    alias: "CamiloG",
  },
  {
    id: "3",
    name: "Johan Duarte",
    email: "johan.duarte@tncj.com",
    alias: "Vopi",
  },
  {
    id: "4",
    name: "Santiago Ninco",
    email: "santiago.nincio@tncj.com",
    alias: "Ninco",
  },
];

export const options: OptionTypes[] = [
  {
    id: "1",
    name: "Crear Factura",
    icon: "bi bi-file-text-fill",
    descripcion: "Crear una nueva factura de venta",
    textButton: "Crear",
    route: "/add",
  },
  {
    id: "2",
    name: "Consultar Factura",
    icon: "bi bi-search",
    descripcion: "Consultar una factura ya existente",
    textButton: "Consultar",
    route: "/search",
  },
];
