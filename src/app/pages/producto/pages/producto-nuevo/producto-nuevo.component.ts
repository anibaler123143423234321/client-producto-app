import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';
import { NegocioService } from '@app/services/NegocioService';
import { GeneralService } from '@app/services/general.service';
import { CategoriaService } from '@app/services/CategoriaService';

@Component({
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.component.html',
  styleUrls: ['./producto-nuevo.component.scss']
})
export class ProductoNuevoComponent implements OnInit {
  loading$!: Observable<boolean | null>;
  photoLoaded!: string;
  categorias: { id: string; nombre: string }[] = [];
  selectedCategoria: { id: string; nombre: string } | undefined;
  negocios: { id: number; nombre: string }[] = [];
  selectedNegocioId: number | undefined;
  idUser: number | undefined;
  idNegocio: number | undefined;
  idNegocioUser: string | undefined;
  nombreNegocioUsuario: string | undefined;
  stock: number | undefined;
  nombreAreaProducto: string | undefined;

  constructor(
    private store: Store<fromRoot.State>,
    private negocioService: NegocioService,
    private generalService: GeneralService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.idUser = this.generalService.usuario$?.id;
    this.idNegocioUser = this.generalService.usuario$?.negocioId;
    console.log('ID Usuario:', this.idUser);
    console.log('ID Negocio User:', this.idNegocioUser);

    if (this.idNegocioUser !== undefined) {
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

      // Carga las categorías específicas del negocio del usuario
      this.categoriaService.cargarCategorias().subscribe((categorias) => {
        this.categorias = categorias
          .filter((categoria) => categoria.negocioId === this.idNegocioUser)
          .map((categoria) => ({
            id: categoria.id.toString(),
            nombre: categoria.nombre
          }));
        console.log('Categorías cargadas:', this.categorias);
      });
    }
  }

  registrarProducto(form: NgForm): void {
    if (form.valid && this.photoLoaded) {
      this.loading$ = this.store.pipe(select(fromList.getLoading));

      const stockValue = this.stock !== undefined ? Number(this.stock) : 0;

      const productoCreateRequest: fromList.ProductoCreateRequest = {
        nombre: form.value.nombre,
        picture: this.photoLoaded,
        precio: Number(form.value.precio),
        categoriaId: this.selectedCategoria?.id, // Usar el ID de la categoría seleccionada
        negocioId: this.idNegocioUser,
        stock: stockValue,
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
