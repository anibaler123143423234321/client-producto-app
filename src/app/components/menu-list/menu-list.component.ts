import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@app/models/backend/user/index';

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

  constructor() { }

  ngOnInit(): void {
  }

  closeMenu() : void {
    this.menuToggle.emit();
  }

  onSignOut(): void {
    this.signOut.emit();
  }

  isAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.user?.role === 'ADMIN';
  }
}
