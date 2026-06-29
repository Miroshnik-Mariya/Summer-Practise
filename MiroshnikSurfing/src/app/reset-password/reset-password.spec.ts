import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPAssword } from './reset-password';

describe('ResetPAssword', () => {
  let component: ResetPAssword;
  let fixture: ComponentFixture<ResetPAssword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPAssword],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPAssword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
