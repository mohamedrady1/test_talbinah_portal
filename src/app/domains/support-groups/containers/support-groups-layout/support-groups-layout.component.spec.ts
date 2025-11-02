import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupsLayoutComponent } from './support-groups-layout.component';

describe('SupportGroupsLayoutComponent', () => {
  let component: SupportGroupsLayoutComponent;
  let fixture: ComponentFixture<SupportGroupsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportGroupsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportGroupsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
