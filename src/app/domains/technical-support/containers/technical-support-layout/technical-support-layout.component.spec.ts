import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportLayoutComponent } from './technical-support-layout.component';

describe('TechnicalSupportLayoutComponent', () => {
  let component: TechnicalSupportLayoutComponent;
  let fixture: ComponentFixture<TechnicalSupportLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
