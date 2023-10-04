import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaResponse } from '../../store/save';
import { CategoriaService } from '@app/services/CategoriaService';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss'],
})
export class CategoriaListComponent implements OnInit {
  categorias$!: Observable<CategoriaResponse[]>;
  loading$: Observable<boolean | null> | undefined; // Agrega esta línea para el estado de carga

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categorias$ = this.categoriaService.categorias$;
    this.categoriaService.cargarCategorias().subscribe();
  }
}
