import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';
import { NegocioService } from '@app/services/NegocioService';

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

  negocios: { id: number; nombre: string }[] = [];
  selectedNegocioId: number | undefined;

  constructor(private store: Store<fromRoot.State>,
    private negocioService: NegocioService // Inyecta NegocioService
    ) {}

 ngOnInit(): void {
    // Carga los datos de negocios y suscríbete
    this.negocioService.cargarDatosDeNegocios().subscribe((negocios) => {
      this.negocios = negocios.map((negocio) => ({
        id: negocio.id,
        nombre: negocio.nombre
      }));
      console.log('Negocios cargados:', this.negocios);

      // Inicializar selectedNegocioId con el primer negocio de la lista
      if (this.negocios.length > 0) {
        this.selectedNegocioId = this.negocios[0].id;
      }
    });

    this.loading$ = this.store.pipe(select(fromList.getLoading));
  }


  registrarProducto(form: NgForm): void {
    if (form.valid) {
      this.loading$ = this.store.pipe(select(fromList.getLoading));

      const productoCreateRequest: fromList.ProductoCreateRequest = {
        nombre: form.value.nombre,
        picture: this.photoLoaded,
        precio: Number(form.value.precio),
        direccion: this.selectedDireccion, // Usar la categoría seleccionada
        negocioId: this.selectedNegocioId?.toString() // Asigna el ID del negocio seleccionado
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
