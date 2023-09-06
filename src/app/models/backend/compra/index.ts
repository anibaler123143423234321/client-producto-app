export interface Compra {
  id: number;
  userId: number;
  productoId: number;
  titulo: string;
  precioCompra: number;
  fechaCompra: Date;
  cantidad: number;
  estadoCompra: string;
}
