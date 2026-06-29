import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSmall } from './header-small';

describe('HeaderSmall', () => {
  let component: HeaderSmall;
  let fixture: ComponentFixture<HeaderSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSmall],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSmall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
