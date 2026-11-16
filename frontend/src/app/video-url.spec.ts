import { toYouTubeEmbedUrl } from './video-url';

describe('toYouTubeEmbedUrl', () => {
  it('converts a YouTube watch URL from the API to an embeddable URL', () => {
    expect(toYouTubeEmbedUrl('https://www.youtube.com/watch?v=U_rWZK_8vUY&list=PL123'))
      .toBe('https://www.youtube-nocookie.com/embed/U_rWZK_8vUY?autoplay=1');
  });

  it('supports direct embed and short YouTube links', () => {
    expect(toYouTubeEmbedUrl('https://www.youtube.com/embed/IV0-SYn3YuM'))
      .toBe('https://www.youtube-nocookie.com/embed/IV0-SYn3YuM?autoplay=1');
    expect(toYouTubeEmbedUrl('https://youtu.be/IV0-SYn3YuM'))
      .toBe('https://www.youtube-nocookie.com/embed/IV0-SYn3YuM?autoplay=1');
  });

  it('rejects non-YouTube, non-HTTPS, and malformed video links', () => {
    expect(toYouTubeEmbedUrl('https://example.com/watch?v=IV0-SYn3YuM')).toBeNull();
    expect(toYouTubeEmbedUrl('http://www.youtube.com/watch?v=IV0-SYn3YuM')).toBeNull();
    expect(toYouTubeEmbedUrl('https://www.youtube.com/watch?v=invalid')).toBeNull();
  });
});
