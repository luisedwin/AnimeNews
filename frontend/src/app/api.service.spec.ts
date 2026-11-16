import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses data from the backend when it is available', () => {
    const backendAnimes = [{ id: 20, titulo: 'Anime del backend' }];
    let result: unknown;

    api.getAnimes().subscribe((animes) => result = animes);
    http.expectOne('http://localhost:8080/api/animes').flush(backendAnimes);

    expect(result).toEqual(backendAnimes);
  });

  it('uses local sample data when the backend cannot be reached', () => {
    let titles: string[] = [];

    api.getAnimes().subscribe((animes) => titles = animes.map((anime) => anime.titulo));
    http.expectOne('http://localhost:8080/api/animes').error(new ProgressEvent('error'));

    expect(titles).toContain('Frieren: Más allá del final del viaje');
  });

  it('does not hide backend HTTP errors with sample data', () => {
    let error: unknown;

    api.getAnimes().subscribe({ error: (requestError: unknown) => error = requestError });
    http.expectOne('http://localhost:8080/api/animes').flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(error).toBeTruthy();
  });
});
