import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countriesData: any;

  constructor(private http: HttpClient) {}

  getCountryData(): Observable<any> {
    return this.http.get<any>('assets/countries.json').pipe(
      map((data) => {
        this.countriesData = data; // Cache the data for updates
        return data;
      })
    );
  }

  saveCustomerData(customerData: any): Observable<any> {
    // Send the customer data to the backend API
    return this.http.post<any>('http://localhost:3000/customerList', customerData);
  }
}
