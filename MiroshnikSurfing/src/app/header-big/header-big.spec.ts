import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBig } from './header-big';

describe('HeaderBig', () => {
  let component: HeaderBig;
  let fixture: ComponentFixture<HeaderBig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBig],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderBig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
