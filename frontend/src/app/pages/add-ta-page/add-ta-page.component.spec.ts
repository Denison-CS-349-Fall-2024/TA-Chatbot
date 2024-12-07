import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaPageComponent } from './add-ta-page.component';

describe('AddTaPageComponent', () => {
  let component: AddTaPageComponent;
  let fixture: ComponentFixture<AddTaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
