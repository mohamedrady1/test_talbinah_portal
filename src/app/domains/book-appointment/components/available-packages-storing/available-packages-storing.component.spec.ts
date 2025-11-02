import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablePackagesStoringComponent } from './available-packages-storing.component';

describe('AvailablePackagesStoringComponent', () => {
  let component: AvailablePackagesStoringComponent;
  let fixture: ComponentFixture<AvailablePackagesStoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailablePackagesStoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablePackagesStoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
