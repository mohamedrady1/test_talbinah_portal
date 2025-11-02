import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablePackagesSelectionComponent } from './available-packages-selection.component';

describe('AvailablePackagesSelectionComponent', () => {
  let component: AvailablePackagesSelectionComponent;
  let fixture: ComponentFixture<AvailablePackagesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailablePackagesSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablePackagesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
