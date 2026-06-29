import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPage } from './label-page';

describe('LabelPage', () => {
  let component: LabelPage;
  let fixture: ComponentFixture<LabelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
