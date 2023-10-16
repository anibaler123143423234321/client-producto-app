export interface Compra {
  id: number;
  userId: number;
  productoId: number;
  titulo: string;
  precioCompra: number;
  fechaCompra: string; // Agrega la propiedad fechaCompra de tipo string
  cantidad: number;
  estadoCompra: string;
  tipoEnvio?: string;
  tipoDePago?: string; // Asegúrate de que esta propiedad esté definida
  codigo?: string;
}
