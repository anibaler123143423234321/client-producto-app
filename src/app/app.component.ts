// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from './store';
import * as fromUser from './store/user';
import { GeneralService } from './services/general.service';
import { NegocioService } from '@app/services/NegocioService';
import { CompraService } from './services/CompraService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSpinner = false;
  title = 'client-inmueble-app';
  user$!: Observable<fromUser.UserResponse>;
  isAuthorized$!: Observable<boolean>;
  negocios: { id: number; nombre: string }[] = [];
  nombreNegocioUsuario: string | undefined;
  private loggedIn = true; // Variable para rastrear el estado de inicio de sesión
  private compraSubscription: Subscription | undefined;

  constructor(
    private fs: AngularFirestore,
    private notification: NotificationService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private compraService: CompraService,
    private negocioService: NegocioService
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;

    this.store.dispatch(new fromUser.Init());


    // Suscríbete al negocio actual del usuario
    this.negocioService.negocioActual$.subscribe((negocio) => {
      if (negocio) {
        this.negocios = [
          {
            id: negocio.id,
            nombre: negocio.nombre
          }
        ];
        console.log('Negocio cargado:', negocio.nombre);
      } else {
        // Si no hay negocio actual, borra los datos de negocios
        this.negocios = [];
      }
    });

  }

  ngOnDestroy() {
    // Al cerrar sesión, detén la suscripción
    if (this.compraSubscription) {
      this.compraSubscription.unsubscribe();
    }
    this.loggedIn = false;
  }

  onToggleSpinner(): void {
    this.showSpinner = !this.showSpinner;
  }

  onFilesChanged(urls: string | string[]): void {
    console.log(urls);
  }

  onSuccess(): void {
    this.notification.success("El procedimiento fue exitoso");
  }

  onError(): void {
    this.notification.error("Se encontraron errores en el proceso");
  }

  onSignOut() : void {

    localStorage.removeItem('token');
    this.store.dispatch(new fromUser.SignOut());
    this.router.navigate(['/auth/login']);
  }
}
