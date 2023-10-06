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
  dni?: number; // Agregar el campo dni de tipo number
}
