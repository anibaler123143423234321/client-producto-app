import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select } from '@ngrx/store';

@Component({
  selector: 'app-negocio-nuevo',
  templateUrl: './negocio-nuevo.component.html',
  styleUrls: ['./negocio-nuevo.component.scss'],
})
export class NegocioNuevoComponent {
  loading$!: Observable<boolean | null>;

  constructor(private store: Store<fromRoot.State>) {}

  registrarNegocio(form: NgForm): void {
    if (form.valid) {
      this.loading$ = this.store.select(fromList.getLoading);

      const negocioCreateRequest: fromList.NegocioCreateRequest = {
        nombre: form.value.nombre,
        direccion: form.value.direccion,
        ruc: form.value.direccion,
        tipoRuc: form.value.direccion,
        // Agrega otros campos según tus necesidades
      };

      // Envía la acción para crear un negocio directamente con el objeto negocioCreateRequest
      this.store.dispatch(new fromList.Create(negocioCreateRequest));
    }
  }


}
