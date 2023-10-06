
export interface Producto{
  id: number;
  nombre: string;
  picture: string;
  precio: number;
  fechaCreacion?: string;
  categoriaId?: string;
  negocioId?: string;
  stock: number;
}
