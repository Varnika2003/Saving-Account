import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CountryService } from '../country.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css'],
})
export class CountryListComponent implements OnInit {
  // Form Controls with Validators
  firstNameControl = new FormControl('', Validators.required);
  middleNameControl = new FormControl('');
  lastNameControl = new FormControl('', Validators.required);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  phoneControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{4}-\d{6}$/), // Format: xxxx-nnnnnn
  ]);
  homeTypeControl = new FormControl('Select', Validators.required); // Default value is "Select"
  addressLine1Control = new FormControl('', Validators.required);
  addressLine2Control = new FormControl('', Validators.required);
  addressLine3Control = new FormControl('');
  cityControl = new FormControl('', Validators.required);
  stateControl = new FormControl('', Validators.required);
  countryControl = new FormControl('', Validators.required);
  pincodeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(7),
  ]);
  documentTypeControl = new FormControl('Select', Validators.required); // Default value is "Select"
  documentNumberControl = new FormControl('', Validators.required);
  aadharNumberControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{12}$/), // Ensure it's a 12-digit number
  ]);
  panNumberControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/), // PAN format: ABCDE1234F
  ]);

  // Dropdown Data
  filteredCountries: string[] = [];
  filteredStates: string[] = [];
  filteredCities: string[] = [];
  filteredHomeTypes: string[] = [];
  filteredDocumentTypes: string[] = [];

  countries: any[] = [];
  homeTypes: string[] = [];
  documentTypes: string[] = [];
  customerList: any[] = [];

  constructor(private countryService: CountryService, private snackbar: MatSnackBar) {}

  ngOnInit() {
    // Fetch country and document data
    this.countryService.getCountryData().subscribe((data) => {
      this.countries = data.Countries;
      this.homeTypes = data.homeTypes;
      this.documentTypes = data.documentTypes;

      this.filteredCountries = this.countries.map((c) => c.name);
      this.filteredHomeTypes = this.homeTypes;
      this.filteredDocumentTypes = this.documentTypes;
    });

    // Filter logic for dropdowns
    this.countryControl.valueChanges.subscribe((value) => this.filterCountries(value || ''));
    this.stateControl.valueChanges.subscribe((value) => this.filterStates(value || ''));
    this.cityControl.valueChanges.subscribe((value) => this.filterCities(value || ''));
    this.homeTypeControl.valueChanges.subscribe((value) => this.filterHomeTypes(value || ''));
    this.documentTypeControl.valueChanges.subscribe((value) => this.filterDocumentTypes(value || ''));
  }

  filterCountries(value: string) {
    this.filteredCountries = this.countries
      .map((c) => c.name)
      .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
  }

  filterStates(value: string) {
    const selectedCountry = this.countries.find((c) => c.name === this.countryControl.value);
    this.filteredStates = selectedCountry?.states
      .map((s: any) => s.name)
      .filter((name: string) => name.toLowerCase().includes(value.toLowerCase())) || [];
  }

  filterCities(value: string) {
    const selectedCountry = this.countries.find((c) => c.name === this.countryControl.value);
    const selectedState = selectedCountry?.states.find((s: any) => s.name === this.stateControl.value);
    this.filteredCities = selectedState?.cities.filter((city: string) =>
      city.toLowerCase().includes(value.toLowerCase())
    ) || [];
  }

  filterHomeTypes(value: string) {
    this.filteredHomeTypes = this.homeTypes.filter((type) =>
      type.toLowerCase().includes(value.toLowerCase())
    );
  }

  filterDocumentTypes(value: string) {
    this.filteredDocumentTypes = this.documentTypes.filter((type) =>
      type.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectCountry(country: string) {
    this.countryControl.setValue(country);
    this.stateControl.setValue('');
    this.cityControl.setValue('');
    this.filterStates('');
    this.filterCities('');
  }

  selectState(state: string) {
    this.stateControl.setValue(state);
    this.cityControl.setValue('');
    this.filterCities('');
  }

  selectCity(city: string) {
    this.cityControl.setValue(city);
  }

  selectHomeType(homeType: string) {
    this.homeTypeControl.setValue(homeType);
  }

  selectDocumentType(documentType: string) {
    this.documentTypeControl.setValue(documentType);
  }

  // Mask Aadhar and PAN numbers to show only the last 4 digits
  getMaskedAadhar(): string {
    const aadhar = this.aadharNumberControl.value || '';
    return aadhar.replace(/\d(?=\d{4})/g, '*'); // Mask all but the last 4 digits
  }

  getMaskedPAN(): string {
    const pan = this.panNumberControl.value || '';
    return pan.replace(/.(?=.{4})/g, '*'); // Mask all but the last 4 characters
  }

  onSave() {
    if (
      this.firstNameControl.invalid ||
      this.lastNameControl.invalid ||
      this.emailControl.invalid ||
      this.phoneControl.invalid ||
      this.homeTypeControl.invalid ||
      this.addressLine1Control.invalid ||
      this.addressLine2Control.invalid ||
      this.cityControl.invalid ||
      this.stateControl.invalid ||
      this.countryControl.invalid ||
      this.pincodeControl.invalid ||
      this.documentTypeControl.invalid ||
      this.documentNumberControl.invalid ||
      this.aadharNumberControl.invalid ||
      this.panNumberControl.invalid
    ) {
      console.log('Form is invalid');
      return;
    }

    const customerData = {
      firstName: this.firstNameControl.value,
      middleName: this.middleNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value,
      phone: this.phoneControl.value,
      address: {
        homeType: this.homeTypeControl.value,
        line1: this.addressLine1Control.value,
        line2: this.addressLine2Control.value,
        line3: this.addressLine3Control.value,
        city: this.cityControl.value,
        state: this.stateControl.value,
        country: this.countryControl.value,
        pincode: this.pincodeControl.value,
      },
      addressProof: {
        documentType: this.documentTypeControl.value,
        documentNumber: this.documentNumberControl.value,
        aadharNumber: this.getMaskedAadhar(),
        panNumber: this.getMaskedPAN(),
      },
    };

    this.countryService.saveCustomerData(customerData).subscribe({
      next: (response) => {
        console.log('Customer data saved successfully:', response);
        this.snackbar.open('Form saved successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.resetForm(); // Reset the form after saving
      },
      error: (error) => {
        console.error('Error saving customer data:', error);
        this.snackbar.open('Failed to save form. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  onCancel() {
    const confirmation = confirm('Are you sure you want to reset the form?');
    if (confirmation) {
      this.resetForm();
    }
  }

  resetForm() {
    this.firstNameControl.reset();
    this.middleNameControl.reset();
    this.lastNameControl.reset();
    this.emailControl.reset();
    this.phoneControl.reset();
    this.homeTypeControl.setValue('Select');
    this.addressLine1Control.reset();
    this.addressLine2Control.reset();
    this.addressLine3Control.reset();
    this.cityControl.reset();
    this.stateControl.reset();
    this.countryControl.reset();
    this.pincodeControl.reset();
    this.documentTypeControl.setValue('Select');
    this.documentNumberControl.reset();
    this.aadharNumberControl.reset();
    this.panNumberControl.reset();

    // Clear filtered lists
    this.filteredCountries = [];
    this.filteredStates = [];
    this.filteredCities = [];
  }
}
