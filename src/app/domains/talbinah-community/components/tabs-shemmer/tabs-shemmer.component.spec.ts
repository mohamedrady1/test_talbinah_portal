import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsShemmerComponent } from './tabs-shemmer.component';

describe('TabsShemmerComponent', () => {
  let component: TabsShemmerComponent;
  let fixture: ComponentFixture<TabsShemmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsShemmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsShemmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
