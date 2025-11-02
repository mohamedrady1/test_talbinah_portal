import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikActivitesComponent } from './khawiik-activites.component';

describe('KhawiikActivitesComponent', () => {
  let component: KhawiikActivitesComponent;
  let fixture: ComponentFixture<KhawiikActivitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikActivitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
