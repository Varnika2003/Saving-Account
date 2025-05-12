import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeTypeService {
  private jsonUrl = 'assets/countries.json';

  constructor(private http: HttpClient) {}

  getHomeTypes(): Observable<string[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data: { homeTypes: any; }) => data.homeTypes)
    );
  }

  // Optional: fetch everything
  getAllData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
