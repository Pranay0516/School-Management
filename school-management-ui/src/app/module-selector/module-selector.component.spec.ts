import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ModuleSelectorComponent } from './module-selector.component';

describe('ModuleSelectorComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleSelectorComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ModuleSelectorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
