import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassPagesComponent } from './create-class-pages.component';

describe('CreateClassPagesComponent', () => {
  let component: CreateClassPagesComponent;
  let fixture: ComponentFixture<CreateClassPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClassPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClassPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
