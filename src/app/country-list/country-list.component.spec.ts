import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryListComponent } from './country-list.component';
import { CountryService } from '../country.service';
import { of } from 'rxjs';

describe('CountryListComponent', () => {
  let component: CountryListComponent;
  let fixture: ComponentFixture<CountryListComponent>;
  let mockCountryService: jasmine.SpyObj<CountryService>;

  beforeEach(async () => {
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountryData']);
    mockCountryService.getCountryData.and.returnValue(of({
      Countries: [
        { name: 'India', states: [{ name: 'Karnataka', cities: ['Bangalore', 'Mysore'] }] }
      ],
      documentTypes: ['Aadhar Card', 'Passport']
    }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CountryListComponent],
      providers: [{ provide: CountryService, useValue: mockCountryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch country data on initialization', () => {
    expect(component.countries.length).toBe(1);
    expect(component.countries[0].name).toBe('India');
    expect(component.documentTypes).toEqual(['Aadhar Card', 'Passport']);
  });

  it('should filter countries based on input', () => {
    component.filterCountries('Ind');
    expect(component.filteredCountries).toEqual(['India']);
  });

  it('should filter states based on selected country and input', () => {
    component.dropdownSelectedCountry = 'India';
    component.filterStates('Kar');
    expect(component.filteredStates).toEqual(['Karnataka']);
  });

  it('should filter cities based on selected state and input', () => {
    component.dropdownSelectedCountry = 'India';
    component.dropdownSelectedState = 'Karnataka';
    component.filterCities('Bang');
    expect(component.filteredCities).toEqual(['Bangalore']);
  });

  it('should filter home types based on input', () => {
    component.dropdownSelectedCountry = 'India';
    component.dropdownSelectedState = 'Karnataka';
    component.dropdownSelectedCity = 'Bangalore';
    component.filterHomeTypes('Apart');
    expect(component.filteredHomeTypes).toEqual(['Apartment']);
  });

  it('should filter document types based on input', () => {
    component.dropdownSelectedCountry = 'India';
    component.dropdownSelectedState = 'Karnataka';
    component.dropdownSelectedCity = 'Bangalore';
    component.filterDocumentTypes('Aadhar');
    expect(component.filteredDocumentTypes).toEqual(['Aadhar Card']);
  });

  it('should reset state, city, home type, and document type on country change', () => {
    component.onDropdownCountryChange();
    expect(component.dropdownSelectedState).toBeNull();
    expect(component.dropdownSelectedCity).toBe('');
    expect(component.dropdownSelectedHomeType).toBe('');
    expect(component.dropdownSelectedDocumentType).toBe('');
  });

  it('should reset city, home type, and document type on state change', () => {
    component.onDropdownStateChange();
    expect(component.dropdownSelectedCity).toBe('');
    expect(component.dropdownSelectedHomeType).toBe('');
    expect(component.dropdownSelectedDocumentType).toBe('');
  });

  it('should reset home type and document type on city change', () => {
    component.onDropdownCityChange();
    expect(component.dropdownSelectedHomeType).toBe('');
    expect(component.dropdownSelectedDocumentType).toBe('');
  });

  it('should collect form data on submit', () => {
    component.countryControl.setValue('India');
    component.stateControl.setValue('Karnataka');
    component.cityControl.setValue('Bangalore');
    component.homeTypeControl.setValue('Apartment');
    component.documentTypeControl.setValue('Aadhar Card');

    const formData = component.onSubmit();
    expect(formData).toEqual({
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      homeType: 'Apartment',
      documentType: 'Aadhar Card',
    });
  });
});
