import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ParentFeesComponent } from './parent-fees.component';

describe('ParentFeesComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ParentFeesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ParentFeesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
