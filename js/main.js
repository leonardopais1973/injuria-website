document.addEventListener('DOMContentLoaded', () => {
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
