import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ParentNoticesComponent } from './parent-notices.component';

describe('ParentNoticesComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ParentNoticesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ParentNoticesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
