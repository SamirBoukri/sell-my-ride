import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotingPageComponent } from './quoting-page.component';

describe('QuotingPageComponent', () => {
  let component: QuotingPageComponent;
  let fixture: ComponentFixture<QuotingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuotingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
