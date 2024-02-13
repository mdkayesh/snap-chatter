import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';

describe('InboxMessageComponent', () => {
  let component: InboxMessageComponent;
  let fixture: ComponentFixture<InboxMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InboxMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
