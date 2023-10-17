import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompraResponse } from '@app/pages/compra/store/save';
import { UserResponse } from '../../user.models';
import { CompraService } from '@app/services/CompraService';

// Define un nuevo tipo que incluya tanto la compra como el usuario
export interface CompraUserDialogData {
  user: UserResponse;
  compras: CompraResponse[];
}

@Component({
  selector: 'app-edit-compra-estado-modal',
  templateUrl: 'edit-compra-estado-modal.component.html',
})
export class EditCompraEstadoModalComponent {
  user: UserResponse;
  compras: CompraResponse[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditCompraEstadoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompraUserDialogData,
    public CompraService: CompraService
  ) {
    this.user = data.user;
    this.compras = this.filterComprasByUserId(data.compras, this.user.id);
  }

  // Función para filtrar compras por el ID de usuario
  filterComprasByUserId(comprasData: CompraResponse[], userId: number): CompraResponse[] {
    return comprasData.filter((compra) => {
      return compra.userId === userId;
    });
  }

  // Función para cambiar el estado de una compra
  cambiarEstado(compra: CompraResponse): void {
    // Aquí puedes agregar tu lógica para cambiar el estado de la compra
  }
}
