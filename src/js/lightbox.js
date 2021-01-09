import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

export default function openLightbox(imageUrl) {
  const instance = basicLightbox.create(`<img src="${imageUrl}">`);

  instance.show();
}
