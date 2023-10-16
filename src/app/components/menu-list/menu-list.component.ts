import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@app/models/backend/user/index';
import { CarritoService } from '@app/services/CarritoService';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  @Input() isAuthorized !: boolean | null;
  @Input() user: User | null = null;
  @Output() signOut = new EventEmitter<void>();

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
  }

  closeMenu() : void {

  // Emitir el evento para cerrar el menú
  this.menuToggle.emit();

  // Limpiar el carrito después de que se complete la navegación y la vista se haya ocultado
  this.carritoService.clearCart();
  }


  onSignOut(): void {
    console.log('onSignOut se ha llamado');

    // Borrar todos los elementos del almacenamiento local
    localStorage.clear();

    console.log('Toda la caché de localStorage se ha borrado.');

    // Emitir el evento para cerrar sesión
    this.signOut.emit();
  }



  isAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.user?.role === 'ADMIN';
  }

  isSuperAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.user?.role === 'SUPERADMIN';
  }


}
