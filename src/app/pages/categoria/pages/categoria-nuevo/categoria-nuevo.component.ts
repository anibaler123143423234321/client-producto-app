// En CategoriaNuevoComponent
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';
import { NegocioService } from '@app/services/NegocioService';
import { GeneralService } from '@app/services/general.service';

@Component({
  selector: 'app-categoria-nuevo',
  templateUrl: './categoria-nuevo.component.html',
  styleUrls: ['./categoria-nuevo.component.scss']
})
export class CategoriaNuevoComponent implements OnInit {
  loading$!: Observable<boolean | null>;
  idUser: number | undefined;
  nombreNegocioUsuario: string | undefined;
  idNegocioUser: string | undefined;

  constructor(
    private store: Store<fromRoot.State>,
    private negocioService: NegocioService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.idUser = this.generalService.usuario$?.id;

    // Suscribirse al negocio actual del usuario
    this.negocioService.negocioActual$.subscribe((negocio) => {
      if (negocio) {
        this.nombreNegocioUsuario = negocio.nombre;
      }
    });

    // Cargar los datos de negocios
    if (this.idUser !== undefined) {
      this.negocioService.userId = this.idUser;
      this.negocioService.cargarDatosDeNegocios().subscribe();
    }
  }

  registrarCategoria(form: NgForm): void {
    if (form.valid) {
      this.loading$ = this.store.pipe(select(fromList.getLoading));

      const categoriaCreateRequest: fromList.CategoriaCreateRequest = {
        nombre: form.value.nombre,
        negocioId: this.negocioService.userId.toString()
      };
      this.store.dispatch(new fromList.Create(categoriaCreateRequest));
    }
  }
}
