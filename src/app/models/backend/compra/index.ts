export interface Compra {
  id: number;
  userId: number;
  productoId: number;
  titulo: string;
  precioCompra: number;
  fechaCompra: string;
  cantidad: number;
  estadoCompra: string;
}
