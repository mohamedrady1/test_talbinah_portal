import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupDetailsComponent } from './support-group-details.component';

describe('SupportGroupDetailsComponent', () => {
  let component: SupportGroupDetailsComponent;
  let fixture: ComponentFixture<SupportGroupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportGroupDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
