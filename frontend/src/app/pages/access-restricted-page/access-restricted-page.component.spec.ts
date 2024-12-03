import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRestrictedPageComponent } from './access-restricted-page.component';

describe('AccessRestrictedPageComponent', () => {
  let component: AccessRestrictedPageComponent;
  let fixture: ComponentFixture<AccessRestrictedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRestrictedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRestrictedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
