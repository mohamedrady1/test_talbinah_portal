export class LocationsCollections {
  // static ModuleName: string = 'locations-management';
  static ModuleName: string = 'api';

  // static Lookups: string = `${LocationsCollections.ModuleName}/lookups`;
  static Lookups: string = `${LocationsCollections.ModuleName}`;

  static Countries(): string {
    return `${LocationsCollections.Lookups}/geocodes/countries`;
  }

  static Cities(countryCode: string): string {
    return `${LocationsCollections.Lookups}/${countryCode}/cities`;
  }
}
