import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Articles } from '../models/articles';
import { Insert } from '../models/article';

const API_URL = 'http://localhost:8080/api/test/'
const API_URL2 = 'http://localhost:8080/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private storageService: StorageService) { }

  getPublicContent(): Observable<any>{
    return this.http.get(API_URL + 'all', {responseType: 'text'})
  }

  getUserBoard(): Observable<any>{
    return this.http.get(API_URL + 'user', {responseType: 'text'})
  }

  getAdminBoard(): Observable<any>{
    return this.http.get(API_URL + 'admin', {responseType: 'text'})
  }

  getElements(): Observable<any[]>{
    return this.http.get<any[]>(API_URL + 'articles')
  }

  updateElement(id: number, updatedElement: any): Observable<any> {
    return this.http.put<any>(`${API_URL}articles/${id}`, updatedElement);
  }

  deleteElement(id: number): Observable<any> {
      return this.http.delete<any>(`${API_URL}articles/${id}`);
  }

  postArticlesToUser(articles: Articles): Observable<any> {
    return this.http.post(API_URL + 'articles', articles);
  }

  getArticlesToUser(id: number): Observable<any>{
    return this.http.get(API_URL + "articles/" +id + "/all")
  }

  postOrderToUser(articles: Insert): Observable<any> {
    return this.http.post(API_URL2 + "create-order", {articles});
  }
  
  getResponseOrder(params: any): Observable<any>{
    // Construye un objeto HttpParams con los parámetros recibidos
    const httpParams = new HttpParams({ fromObject: params });

    // Realiza la solicitud HTTP para obtener la respuesta
    return this.http.get(API_URL2 + 'success', { params: httpParams });
  }
}
