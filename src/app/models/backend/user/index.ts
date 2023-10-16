export interface User{
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  token: string;
  role?: string;
  negocioId?: string;
  dni?: string; // Agregar el campo dni de tipo number
  picture?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  tipoDoc: string;
}
