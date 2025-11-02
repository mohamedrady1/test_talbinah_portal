import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticProgramsLayoutComponent } from './therapeutic-programs-layout.component';

describe('TherapeuticProgramsLayoutComponent', () => {
  let component: TherapeuticProgramsLayoutComponent;
  let fixture: ComponentFixture<TherapeuticProgramsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticProgramsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticProgramsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
