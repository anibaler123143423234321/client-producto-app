import { Component, OnInit } from '@angular/core';
import { NegocioService } from '@app/services/NegocioService';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '@app/services/general.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  negocios: { id: number; nombre: string; picture: string }[] = [];
  idUser: number | undefined;
  idNegocio: number | undefined;
  picture: string | undefined;
  idNegocioUser: string | undefined;
  nombreNegocioUsuario: string | undefined;
  isUserAuthenticated = false;
  isLoading = true; // Agregar una bandera para controlar la carga inicial

  constructor(
    private negocioService: NegocioService,
    private route: ActivatedRoute,
    private GeneralService: GeneralService,
    private store: Store<fromRoot.State>,
  ) {}

  ngOnInit(): void {
    this.store.select(fromUser.getUser).subscribe((user) => {
      if (user) {
        this.isUserAuthenticated = true;
        this.idUser = user.id;
        this.idNegocioUser = user.negocioId;

        if (this.idNegocioUser !== undefined) {
          this.negocioService.getNegocioById(parseInt(this.idNegocioUser!)).subscribe((negocio) => {
            if (negocio) {
              this.negocios = [
                {
                  id: negocio.id,
                  nombre: negocio.nombre,
                  picture: negocio.picture || ''
                }
              ];
              this.nombreNegocioUsuario = negocio.nombre;
              this.picture = negocio.picture || '';

              if (this.isUserAuthenticated) {
                console.log('ID Usuario:', this.idUser);
                console.log('ID Negocio User:', this.idNegocioUser);
              }

              // Datos cargados exitosamente, establecer isLoading a falso
              this.isLoading = false;
            }
          });
        }
      } else {
        // Si el usuario no está autenticado, establecer isLoading a falso
        this.isLoading = false;
      }
    });
  }
}
