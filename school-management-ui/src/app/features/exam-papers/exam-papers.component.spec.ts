import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ExamPapersComponent } from './exam-papers.component';

describe('ExamPapersComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ExamPapersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ExamPapersComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
