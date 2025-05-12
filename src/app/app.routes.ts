import { Routes } from '@angular/router';
import { CountryListComponent } from './country-list/country-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

export const routes: Routes = [
  { path: '', redirectTo: 'country-list', pathMatch: 'full' },
  { path: 'country-list', component: CountryListComponent },
];

export const appModules = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule
];
