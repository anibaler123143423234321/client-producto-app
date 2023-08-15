import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.component.html',
  styleUrls: ['./producto-nuevo.component.scss']
})
export class ProductoNuevoComponent implements OnInit {
  loading$!: Observable<boolean | null>;
  photoLoaded!: string;
  direccions: string[] = ['bebidas', 'golosinas', 'ropa', 'rrhh', 'helados'];
  selectedDireccion: string = '';

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {}

  registrarProducto(form: NgForm): void {
    if (form.valid) {
      this.loading$ = this.store.pipe(select(fromList.getLoading));

      const productoCreateRequest: fromList.ProductoCreateRequest = {
        nombre: form.value.nombre,
        picture: this.photoLoaded,
        precio: Number(form.value.precio),
        direccion: this.selectedDireccion // Usar la categoría seleccionada
      };
      this.store.dispatch(new fromList.Create(productoCreateRequest));
    }
  }

  onFilesChanged(url: any): void {
    if (url) {
      this.photoLoaded = url;
    }
  }
}
