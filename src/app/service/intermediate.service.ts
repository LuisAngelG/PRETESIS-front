import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Intermediate {
  private datosSubject = new Subject<any>();
  datos$ = this.datosSubject.asObservable();

  enviarDatos(datos: any) {
    this.datosSubject.next(datos);
  }
}
