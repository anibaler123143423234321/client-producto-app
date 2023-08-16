export interface Compra {
  id?: number; // El campo 'id' puede ser opcional si se generará automáticamente en el backend
  userId: string;
  productoId: number; // Cambiado a número para representar la ID del producto
  titulo: string;
  precio: number; // Cambiado a número para representar el precio
  fechaCompra: Date; // Cambiado a Date para representar la fecha
  cantidad: number; // Cambiado a número para representar la cantidad
}
