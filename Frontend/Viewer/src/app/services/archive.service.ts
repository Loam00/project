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

  private url = "http://localhost:3000/archive";

  blob: Blob;

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  async uploadFile(Data: Pick<Files, "name" | "file" >, userId: Pick<User, "id_user">): Promise<{}> {
    console.log(Data)
    const fileData = new FormData();
    fileData.append("name", Data.name);
    fileData.append("id_user", userId.toString());
    fileData.append("file", Data.file);
    for (const value of fileData.entries()) {
      console.log(value);
    }

    return await lastValueFrom(this.http.post<{}>(this.url, fileData).pipe(
      catchError(this.errorHandlerService.handleError<{}>("uploadFile"))
      ))
  }

  async getFileObject(userId: number | Pick<User, "id_user">, type: string): Promise<Files[]> {
    return await lastValueFrom(this.http.get<Files[]>(`${this.url}/fileObject/${type}/${userId}`, { responseType: "json" } )
    .pipe(
      catchError(this.errorHandlerService.handleError<Files[]>("getFileObject", []))
      ))
  }

  async getFile(id_file: number): Promise<ArrayBuffer> {
    let response = await lastValueFrom(this.http.get(`${this.url}/${id_file}`, { responseType: "arraybuffer" })
    .pipe(
      catchError(this.errorHandlerService.handleError<ArrayBuffer>("getFile"))
      ))
      return response;
  }

  async delete(fileId: number | Pick<Files, "id_file">, folder: string): Promise<{}>{
    return await lastValueFrom(this.http.delete<{}>( `${this.url}/${folder}/${fileId}`, this.httpOptions ).pipe(
      catchError(this.errorHandlerService.handleError<{}>("delete"))
    ))
  }
}
