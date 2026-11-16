import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.setTheme(event.urlAfterRedirects));
  }

  private setTheme(url: string): void {
    document.body.classList.remove('noticias-theme', 'estrenos-theme', 'anime-theme', 'manga-theme');
    const path = url.split('?')[0];
    const stylesheet = document.getElementById('page-stylesheet');

    if (path.startsWith('/noticias') || path.startsWith('/detalle-noticias')) {
      document.body.classList.add('noticias-theme');
      this.setStylesheet(stylesheet, 'main.css');
    } else if (path.startsWith('/estrenos')) {
      document.body.classList.add('estrenos-theme');
      this.setStylesheet(stylesheet, 'main.css');
    } else if (path.startsWith('/anime')) {
      document.body.classList.add('anime-theme');
      this.setStylesheet(stylesheet, 'anime.css');
    } else if (path.startsWith('/manga')) {
      document.body.classList.add('manga-theme');
      this.setStylesheet(stylesheet, 'manga.css');
    } else {
      this.setStylesheet(stylesheet, 'main.css');
    }
  }

  private setStylesheet(link: HTMLElement | null, stylesheet: string): void {
    if (link instanceof HTMLLinkElement && !link.href.endsWith(`/css/${stylesheet}`)) {
      link.href = `/css/${stylesheet}`;
    }
  }
}
