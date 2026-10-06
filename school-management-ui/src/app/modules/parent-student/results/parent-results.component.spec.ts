import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ParentResultsComponent } from './parent-results.component';

describe('ParentResultsComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ParentResultsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ParentResultsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
