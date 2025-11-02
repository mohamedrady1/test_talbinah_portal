# SEO Module

This module is responsible for managing SEO-related tasks in the Angular application.

## Directory Structure

```
/src
  /app
    /core
      /seo
        interfaces/
          meta-tags.interface.ts    # Meta tag structure
        services/
          metadata.service.ts       # Metadata management service
        constants/
          seo.constants.ts          # SEO-related constants (global meta tags, JSON-LD)
    /assets
      /seo/
        schema.json                # JSON-LD schema
  /shared
    /components
      /seo/
        seo.component.ts           # Component for setting SEO tags
        seo.component.html
    /features                      # Feature modules like Home, About, etc.
  index.html
```

## Description

- **interfaces/meta-tags.interface.ts**: Defines the structure for meta tags used in the application.
- **services/metadata.service.ts**: Provides methods to manage and update metadata for different routes.
- **constants/seo.constants.ts**: Contains global constants related to SEO, including default meta tags and JSON-LD schema.
- **assets/seo/schema.json**: JSON-LD schema for structured data.
- **shared/components/seo/seo.component.ts**: Angular component for setting SEO tags dynamically.
- **shared/components/seo/seo.component.html**: Template for the SEO component.

## Usage

1. **Meta Tags Interface**: Define the structure of meta tags to ensure consistency across the application.
2. **Metadata Service**: Use this service to update meta tags and structured data dynamically based on the current route.
3. **SEO Constants**: Utilize predefined constants for common meta tags and JSON-LD schema to maintain consistency.
4. **SEO Component**: Integrate the SEO component in your feature modules to manage SEO tags efficiently.

## Example

```typescript
// Example usage of MetadataService in a component
import { MetadataService } from 'src/app/core/seo/services/metadata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private metadataService: MetadataService) {}

  ngOnInit(): void {
    this.metadataService.updateMetaTags({
      title: 'Home Page',
      description: 'Welcome to the Home Page',
      keywords: 'home, angular, seo',
    });
  }
}
```

This README provides an overview of the SEO module, its structure, and how to use it effectively in your Angular application.
