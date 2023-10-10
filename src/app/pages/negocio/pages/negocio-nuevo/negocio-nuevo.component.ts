import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
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

  loading$: Observable<boolean | null> = of(false); // Inicializa loading$ como un Observable de 'false'
  photoLoaded!: string;
  photoLoadedQr!: string;

  constructor(private store: Store<fromRoot.State>) {}

  registrarNegocio(form: NgForm): void {
    if (form.valid) {
      this.loading$ = of(true); // Establece loading$ en 'true' al comenzar la carga

      const negocioCreateRequest: fromList.NegocioCreateRequest = {
        nombre: form.value.nombre,
        direccion: form.value.direccion,
        ruc: form.value.ruc,
        tipoRuc: form.value.tipoRuc,
        picture: this.photoLoaded,
        pictureQr: this.photoLoadedQr,
        // Agrega otros campos según tus necesidades
      };

  // Envía la acción para crear un negocio directamente con el objeto negocioCreateRequest
  this.store.dispatch(new fromList.Create(negocioCreateRequest));

  // Cuando la acción se complete, establece loading$ en 'false'
  this.loading$ = of(false);
    }
  }

  onFilesChanged(url: any): void {
    if (url) {
      this.photoLoaded = url;
    }
  }
}
