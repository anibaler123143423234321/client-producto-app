import { Component, OnInit } from '@angular/core';
import { NegocioService } from '@app/services/NegocioService';
import { NegocioResponse } from '@app/pages/negocio/store/save';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '@app/services/general.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  negocios: { id: number; nombre: string }[] = []; // Arreglo con el ID y el nombre de los negocios
  idUser: number | undefined;
  idNegocio: number | undefined;

  idNegocioUser: string | undefined;
  nombreNegocioUsuario: string | undefined; // Variable para almacenar el nombre del negocio

  constructor(
    private negocioService: NegocioService,
    private route: ActivatedRoute,
    private GeneralService: GeneralService
  ) {}

  ngOnInit(): void {
    this.idUser = this.GeneralService.usuario$?.id;
    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;
    console.log('ID Usuario:', this.idUser);
    console.log('ID Negocio User:', this.idNegocioUser);

    if (this.idNegocioUser !== undefined) {
      // Verifica si idNegocioUser tiene un valor
      this.negocioService.cargarDatosDeNegocios().subscribe((negocios) => {
        this.negocios = negocios.map((negocio) => ({
          id: negocio.id,
          nombre: negocio.nombre
        }));
        console.log('Negocios cargados:', this.negocios);

        // Buscar el nombre del negocio del usuario si el ID coincide
        const negocioUsuario = negocios.find(
          (negocio) => negocio.id === parseInt(this.idNegocioUser!)
        ); // Añade el operador "!" para indicar a TypeScript que estás seguro de que no es nulo
        if (negocioUsuario) {
          this.nombreNegocioUsuario = negocioUsuario.nombre;
        }
      });
    }
  }
}
