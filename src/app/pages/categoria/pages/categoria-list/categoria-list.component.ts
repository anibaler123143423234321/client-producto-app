import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CategoriaResponse } from '../../store/save';
import { CategoriaService } from '@app/services/CategoriaService';
import { GeneralService } from '@app/services/general.service'; // Importa el servicio GeneralService

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss'],
})
export class CategoriaListComponent implements OnInit {
  categorias$!: Observable<CategoriaResponse[]>;
  loading$: Observable<boolean | null> | undefined;

  constructor(
    private categoriaService: CategoriaService,
    private generalService: GeneralService // Inyecta el servicio GeneralService
  ) {}

  ngOnInit(): void {
    this.categorias$ = this.categoriaService.categorias$.pipe(
      // Filtra las categorías para mostrar solo las que pertenecen al negocioId del usuario
      map((categorias) => {
        const negocioIdUser = this.generalService.usuario$?.negocioId;
        return categorias.filter((categoria) => categoria.negocioId === negocioIdUser);
      })
    );
    this.categoriaService.cargarCategorias().subscribe();
  }
}
