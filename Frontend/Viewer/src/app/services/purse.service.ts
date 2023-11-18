import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Observable, catchError, first } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models/User';
import { lastValueFrom } from 'rxjs';
import { Movement } from '../models/Movement';

@Injectable({
  providedIn: 'root'
})
export class PurseService {private url = "http://localhost:3000/purse"

constructor(
  private http: HttpClient,
  private errorHandlerService: ErrorHandlerService) { }

httpOptions: { headers: HttpHeaders } = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

addMovement(
  movementData: Partial<Movement>,
  userId: Pick<User, "id_user">): Observable<Movement> {
  return this.http
  .post<Movement>( this.url, {object: movementData.object, amount: movementData.amount, id_user: userId}, this.httpOptions)
  .pipe(
    first(),
    catchError(this.errorHandlerService.handleError<Movement>("addMovement"))
  );
}

async fetchMovements(userId: number | Pick<User, "id_user">): Promise<Movement[]> {
  return await lastValueFrom(this.http
  .get<Movement[]>( `${this.url}/${userId}`, { responseType: "json"} )
  .pipe(
    catchError(this.errorHandlerService.handleError<Movement[]>("fetchNotes", []))
    ))
}

async delete(movementId: number | Pick<Movement, "id_movement">): Promise<{}>{
  return await lastValueFrom(this.http.delete<{}>( `${this.url}/${movementId}`, this.httpOptions ).pipe(
    catchError(this.errorHandlerService.handleError<{}>("delete"))
  ))
}

async edit(movementData: Partial<Movement>, movementId: number | Pick<Movement, "id_movement">): Promise<Movement>{
  console.log(movementData.object, movementData.amount, movementId)
  return await lastValueFrom(this.http.put<Movement>( `${this.url}/${movementId}`, {object: movementData.object, amount: movementData.amount, id_movement: movementId}, this.httpOptions ).pipe(
    first(),
    catchError(this.errorHandlerService.handleError<Movement>("edit"))
  ))
}
}
