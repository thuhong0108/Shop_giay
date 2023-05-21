import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL = 'http://localhost:8000/api/product'

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.BASE_URL)
  }

  getProduct(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`)
  }

  formatVND(price: number): string {
    return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
  }

  displayMessage(detail: string,summary?: string, severity: string = 'success'): void {
    this.messageService.add({ severity, summary, detail })
  }

  // ADMIN ROLE
  addProduct(data: Product): Observable<any> {
    return this.http.post<any>(this.BASE_URL, data)
  }

  editProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${product._id}`, product)
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`)
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'instagramimages')
    return this.http.post<any>('https://api.cloudinary.com/v1_1/ddwurilrw/image/upload', formData)
  }
}
