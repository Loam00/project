import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { first, catchError, lastValueFrom } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { Files } from '../models/Files';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  private url = "http://localhost:3000/archive"

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  async uploadFile(Data: Pick<Files, "name" | "file" >, userId: Pick<User, "id_user">): Promise<{}> {
    const fileData = new FormData();
    fileData.append("name", Data.name);
    fileData.append("id_user", userId.toString());
    fileData.append("file", Data.file);
    for (const value of fileData.entries()) {
      console.log(value);
    }

    return await lastValueFrom(this.http.post<{}>(this.url, fileData).pipe(
      catchError(this.errorHandlerService.handleError<{}>("uploadImage"))
      ))
  }

  async getFile(userId: number | Pick<User, "id_user">, folder: string): Promise<Files[]> {
    return await lastValueFrom(this.http.get<Files[]>(`${this.url}/${folder}/${userId}`, { responseType: "json"} )
    .pipe(
      catchError(this.errorHandlerService.handleError<Files[]>("getFile", []))
      ))
  }

  async delete(fileId: number | Pick<Files, "id_file">, type: string): Promise<{}>{
    return await lastValueFrom(this.http.delete<{}>( `${this.url}/${type}/${fileId}`, this.httpOptions ).pipe(
      catchError(this.errorHandlerService.handleError<{}>("delete"))
    ))
  }

}
