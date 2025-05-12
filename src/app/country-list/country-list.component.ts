import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../country.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';  // Import Autocomplete Module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule  
  ],
  templateUrl: './country-list.component.html',
})
export class CountryListComponent implements OnInit {
  countryControl = new FormControl('');
  stateControl = new FormControl('');
  cityControl = new FormControl('');
  homeTypeControl = new FormControl(''); 
  documentTypeControl=new FormControl('');

  filteredCountries: string[] = [];
  filteredStates: string[] = [];
  filteredCities: string[] = [];
  filteredHomeTypes: string[] = [];  
  filteredDocumentTypes: string[]=[];

  countries: any[] = [];
  homeTypes: any[] = [
    { name: 'Apartment' },
    { name: 'Villa' },
    { name: 'Condo' },
    { name: 'Townhouse' },
    { name: 'Detached House' },
    { name: 'Bungalow' }
  ];  
  documentTypes: any[]=[];
  loading: boolean = true;
  error: string = '';

  dropdownSelectedCountry: any = null;
  dropdownSelectedState: any = null;
  dropdownSelectedCity: string = '';
  dropdownSelectedHomeType: string = '';  
  dropdownSelectedDocumentType: string = '';

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    
    this.countryService.getCountryData().subscribe({
      next: (data) => {
        if (data?.Countries) {
          this.countries = data.Countries;
          this.filteredCountries = this.countries.map(country => country.name);
        } else {
          this.error = 'No countries data found';
        }

        
        if (data?.documentTypes) {
          this.documentTypes = data.documentTypes;
        } else {
          this.error = 'No document types data found';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.error = 'Failed to load countries data';
        this.loading = false;
      }
    });

   
    this.countryControl.valueChanges.subscribe(value => {
      this.filterCountries(value || '');
    });

    this.stateControl.valueChanges.subscribe(value => {
      this.filterStates(value || '');
    });

    this.cityControl.valueChanges.subscribe(value => {
      this.filterCities(value || '');
    });

    this.homeTypeControl.valueChanges.subscribe(value => {
      this.filterHomeTypes(value || '');
    });

    this.documentTypeControl.valueChanges.subscribe(value => {
      this.filterDocumentTypes(value || '');
    });
  }

  
  filterCountries(value: string) {
    this.filteredCountries = this.countries
      .map(country => country.name)
      .filter(name => name.toLowerCase().includes(value.toLowerCase()));
  }

  
  filterStates(value: string) {
    if (this.dropdownSelectedCountry) {
      const states = this.getStates(this.dropdownSelectedCountry);
      this.filteredStates = states
        .map((s: { name: string }) => s.name)
        .filter((name: string) => name.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.filteredStates = [];
    }
  }

  
  filterCities(value: string) {
    if (this.dropdownSelectedCountry && this.dropdownSelectedState) {
      const cities = this.getCities(this.dropdownSelectedCountry, this.dropdownSelectedState);
      this.filteredCities = cities.filter((city: string) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredCities = [];
    }
  }

  
  filterHomeTypes(value: string) {
    if (this.dropdownSelectedCountry && this.dropdownSelectedState && this.dropdownSelectedCity) {
      this.filteredHomeTypes = this.homeTypes
        .map(type => type.name)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.filteredHomeTypes = [];
    }
  }

  
  filterDocumentTypes(value: string) {
    if (this.dropdownSelectedCountry && this.dropdownSelectedState && this.dropdownSelectedCity) {
      this.filteredDocumentTypes = this.documentTypes
        .filter((docType: string) => docType.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.filteredDocumentTypes = [];
    }
  }

  
  onDropdownCountryChange() {
    this.dropdownSelectedState = null;
    this.dropdownSelectedCity = '';
    this.dropdownSelectedHomeType = '';
    this.dropdownSelectedDocumentType = '';
    this.stateControl.setValue('');
    this.cityControl.setValue('');
    this.homeTypeControl.setValue('');
    this.documentTypeControl.setValue('');
    this.filterStates('');
    this.filterCities('');
    this.filterHomeTypes('');
    this.filterDocumentTypes('');
  }

  
  onDropdownStateChange() {
    this.dropdownSelectedCity = '';
    this.dropdownSelectedHomeType = '';
    this.dropdownSelectedDocumentType = '';
    this.cityControl.setValue('');
    this.homeTypeControl.setValue('');
    this.documentTypeControl.setValue('');
    this.filterCities('');
    this.filterHomeTypes('');
    this.filterDocumentTypes('');
  }

  
  onDropdownCityChange() {
    this.dropdownSelectedHomeType = '';
    this.dropdownSelectedDocumentType = '';
    this.homeTypeControl.setValue('');
    this.documentTypeControl.setValue('');
    this.filterHomeTypes('');
    this.filterDocumentTypes('');
  }

  
  getStates(countryName: string) {
    const country = this.countries.find(c => c.name === countryName);
    return country ? country.states : [];
  }

  
  getCities(countryName: string, stateName: string) {
    const country = this.countries.find(c => c.name === countryName);
    const state = country?.states.find((s: { name: string }) => s.name === stateName);
    return state ? state.cities : [];
  }

  
  selectCountry(country: string) {
    this.countryControl.setValue(country);
    this.dropdownSelectedCountry = country;
    this.onDropdownCountryChange(); 
  }

  
  selectState(state: string) {
    this.stateControl.setValue(state);
    this.dropdownSelectedState = state;
    this.onDropdownStateChange(); 
  }

  
  selectCity(city: string) {
    this.cityControl.setValue(city);
    this.dropdownSelectedCity = city;
    this.onDropdownCityChange(); 
  }

  
  selectHomeType(homeType: string) {
    this.homeTypeControl.setValue(homeType);
    this.dropdownSelectedHomeType = homeType;
  }
  
  
  selectDocumentType(documentType: string) {
    this.documentTypeControl.setValue(documentType);
    this.dropdownSelectedDocumentType = documentType;
  }

  onSubmit() {
    const formData = {
      country: this.countryControl.value,
      state: this.stateControl.value,
      city: this.cityControl.value,
      homeType: this.homeTypeControl.value,
      documentType: this.documentTypeControl.value,
    };

    console.log('Form Data:', formData);

    return formData;
  }
}
