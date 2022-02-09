import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathComponent } from './death.component';

describe('DeathComponent', () => {
  let component: DeathComponent;
  let fixture: ComponentFixture<DeathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
