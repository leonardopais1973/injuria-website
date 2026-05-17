document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-thumb-wrap img').forEach(img => {
    img.addEventListener('error', () => {
      const id = img.src.match(/\/vi\/([^/]+)\//)?.[1];
      if (id) img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }, { once: true });
  });

  document.querySelectorAll('.video-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const id = cell.dataset.videoId;
      if (!id) return;
      const wrap = cell.querySelector('.video-thumb-wrap');
      if (!wrap) return;
      wrap.outerHTML = `<iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>`;
      cell.style.cursor = 'default';
    }, { once: true });
  });
});
