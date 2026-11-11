export type GalleryPage<T> = {
  items: T[];
  showMore: boolean;
  showPrevious: boolean;
  slots: number;
};

// More than nine pictures use eight photos plus a navigation card.
// Nine or fewer use every slot for a picture.
export function galleryPages<T>(items: T[]): GalleryPage<T>[] {
  if (items.length <= 9) {
    return [{ items, showMore: false, showPrevious: false, slots: items.length }];
  }

  const pages: GalleryPage<T>[] = [];
  let index = 0;

  while (index < items.length) {
    const remaining = items.length - index;
    if (remaining <= 9) {
      pages.push({
        items: items.slice(index),
        showMore: false,
        showPrevious: true,
        slots: 9,
      });
      break;
    }

    pages.push({
      items: items.slice(index, index + 8),
      showMore: true,
      showPrevious: pages.length > 0,
      slots: 9,
    });
    index += 8;
  }

  return pages;
}
