// categoria-nuevo.component.ts
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

  negocios: { id: number; nombre: string }[] = [];
  selectedNegocioId: number | undefined;
  idUser: number | undefined;
  idNegocio: number | undefined;
  idNegocioUser: string | undefined;
  nombreNegocioUsuario: string | undefined;

  constructor(
    private store: Store<fromRoot.State>,
    private negocioService: NegocioService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.idUser = this.generalService.usuario$?.id;
    this.idNegocioUser = this.generalService.usuario$?.negocioId;
    console.log('ID Usuario:', this.idUser);
    console.log('ID Negocio User:', this.idNegocioUser);

    // Carga los datos de negocios una vez en la inicialización del componente
    this.negocioService.cargarDatosDeNegocios().subscribe((negocios) => {
      this.negocios = negocios.map((negocio) => ({
        id: negocio.id,
        nombre: negocio.nombre
      }));
      console.log('Negocios cargados:', this.negocios);

      const negocioUsuario = negocios.find(
        (negocio) => negocio.id === parseInt(this.idNegocioUser!)
      );
      if (negocioUsuario) {
        this.nombreNegocioUsuario = negocioUsuario.nombre;
      }
    });

    // ...

    // Suscríbete al negocio actual del usuario
    this.negocioService.negocioActual$.subscribe((negocio) => {
      if (negocio) {
        this.nombreNegocioUsuario = negocio.nombre;
      }
    });

    // ...
  }

  registrarCategoria(form: NgForm): void {
    if (form.valid) {
      this.loading$ = this.store.pipe(select(fromList.getLoading));

      const categoriaCreateRequest: fromList.CategoriaCreateRequest = {
        nombre: form.value.nombre,
        negocioId: this.idNegocioUser
      };
      this.store.dispatch(new fromList.Create(categoriaCreateRequest));
    }
  }
}
