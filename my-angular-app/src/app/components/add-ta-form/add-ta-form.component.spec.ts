import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaFormComponent } from './add-ta-form.component';

describe('AddTaComponent', () => {
  let component: AddTaFormComponent;
  let fixture: ComponentFixture<AddTaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
