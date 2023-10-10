export interface Compra {
  id: number;
  userId: number;
  productoId: number;
  titulo: string;
  precioCompra: number;
  fechaCompra: string;
  cantidad: number;
  estadoCompra: string;
  tipoEnvio?: string;
  tipoDePago?: string; // Asegúrate de que esta propiedad esté definida
  codigo?: string;
}
