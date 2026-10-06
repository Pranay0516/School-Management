import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnnouncementsComponent } from './announcements.component';

describe('AnnouncementsComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AnnouncementsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
