import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalSocietyMainPageComponent } from './psychological-society-main-page.component';

describe('PsychologicalSocietyMainPageComponent', () => {
  let component: PsychologicalSocietyMainPageComponent;
  let fixture: ComponentFixture<PsychologicalSocietyMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologicalSocietyMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsychologicalSocietyMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
