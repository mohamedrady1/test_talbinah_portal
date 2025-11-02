import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPointsComponent } from './settings-points.component';

describe('SettingsPointsComponent', () => {
  let component: SettingsPointsComponent;
  let fixture: ComponentFixture<SettingsPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
