import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMaterialsComponent } from './ta-materials.component';

describe('TaMaterialsComponent', () => {
  let component: TaMaterialsComponent;
  let fixture: ComponentFixture<TaMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
