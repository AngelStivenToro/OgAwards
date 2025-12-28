export interface UserTypes {
  id: string;
  name: string;
  email: string;
  alias: string;
}

export interface OptionTypes {
  id: string;
  name: string;
  icon?: string;
  descripcion?: string;
  textButton: string;
  route?: string;
}
