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

  constructor(
    private fs: AngularFirestore,
    private notification: NotificationService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private GeneralService: GeneralService,
    private negocioService: NegocioService
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;

    this.store.dispatch(new fromUser.Init());

    // Carga los datos de negocios una vez en la inicialización del componente
    this.negocioService.cargarDatosDeNegocios();

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

  onSignOut(): void {
    this.negocios = [];
    this.negocioService.userId = 0;
    this.nombreNegocioUsuario = undefined;

    localStorage.removeItem('token');
    this.store.dispatch(new fromUser.SignOut());
    this.router.navigate(['/auth/login']);
  }
}
