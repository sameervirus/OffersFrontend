import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Offer } from '../_models/Offer';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>('offers');
  }

  addOffer(model: Offer, status: boolean): Observable<Offer> {
    if (status === true) {
      return this.http.put<Offer>(`offers/${model.id}`, { model });
    } else {
      return this.http.post<Offer>('offers', { model });
    }
  }

  deleteOffer(model: Offer): Observable<Offer> {
    return this.http.delete<Offer>(`offers/${model.id}`);
  }

  getCode(code: string, id: number): Observable<Offer> {
    return this.http.post<Offer>(`offers/update-last`, { code, id });
  }
}
