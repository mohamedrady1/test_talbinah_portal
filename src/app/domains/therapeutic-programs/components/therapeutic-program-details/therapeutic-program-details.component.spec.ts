import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticProgramDetailsComponent } from './therapeutic-program-details.component';

describe('TherapeuticProgramDetailsComponent', () => {
  let component: TherapeuticProgramDetailsComponent;
  let fixture: ComponentFixture<TherapeuticProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
