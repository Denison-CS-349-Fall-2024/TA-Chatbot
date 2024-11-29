import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationArchiveModalComponent } from './confirmation-archive-modal.component';

describe('ConfirmationArchiveModalComponent', () => {
  let component: ConfirmationArchiveModalComponent;
  let fixture: ComponentFixture<ConfirmationArchiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationArchiveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationArchiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
