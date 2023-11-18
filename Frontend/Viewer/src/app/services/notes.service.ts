import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Observable, catchError, first } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models/User';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private url = "http://localhost:3000/notes"

  isEdit: boolean;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  childToParent(openEditValue: boolean) {
    this.isEdit = openEditValue;
  }

  async createNote(
    noteData: Partial<Note>,
    userId: Pick<User, "id_user">): Promise<Note> {
   return await lastValueFrom(this.http.post<Note>( this.url, {title: noteData.title, text: noteData.text, id_user: userId}, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Note>("createNote"))
    ))
  }

  async fetchNotes(userId: number | Pick<User, "id_user">): Promise<Note[]> {
    return await lastValueFrom(this.http
    .get<Note[]>( `${this.url}/${userId}`, { responseType: "json"} )
    .pipe(
      catchError(this.errorHandlerService.handleError<Note[]>("fetchNotes", []))
      ))
  }

  async delete(noteId: number | Pick<Note, "id_notes">): Promise<{}>{
    return await lastValueFrom(this.http.delete<{}>( `${this.url}/${noteId}`, this.httpOptions ).pipe(
      catchError(this.errorHandlerService.handleError<{}>("delete"))
    ))
  }

  async edit(noteData: Pick<Note, "title" | "text" | "id_notes">): Promise<Note>{
    console.log(noteData.title, noteData.text, noteData.id_notes)
    return await lastValueFrom(this.http.put<Note>( `${this.url}/${noteData.id_notes}`, {title: noteData.title, text: noteData.text, id_notes: noteData.id_notes}, this.httpOptions ).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Note>("edit"))
    ))
  }
}
