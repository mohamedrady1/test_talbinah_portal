import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalbinahCommunityLayoutComponent } from './talbinah-community-layout.component';

describe('TalbinahCommunityLayoutComponent', () => {
  let component: TalbinahCommunityLayoutComponent;
  let fixture: ComponentFixture<TalbinahCommunityLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalbinahCommunityLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalbinahCommunityLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
