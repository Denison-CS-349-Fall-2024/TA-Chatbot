import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessRestrictedPageComponent } from './access-restricted-page.component';

/**
 * Unit tests for AccessRestrictedPageComponent.
 */
describe('AccessRestrictedPageComponent', () => {
  let component: AccessRestrictedPageComponent;
  let fixture: ComponentFixture<AccessRestrictedPageComponent>;

  /**
   * Setup the testing module and component.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRestrictedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRestrictedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the component is created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});