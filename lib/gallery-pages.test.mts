import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { galleryPages } from "./gallery-pages.ts";

describe("gallery pages", () => {
  it("uses every slot for pictures when there are nine or fewer", () => {
    const pages = galleryPages([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.equal(pages.length, 1);
    assert.deepEqual(pages[0], {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      showMore: false,
      showPrevious: false,
      slots: 9,
    });
  });

  it("reserves the ninth slot once there is another page", () => {
    const pages = galleryPages(Array.from({ length: 10 }, (_, index) => index));
    assert.equal(pages.length, 2);
    assert.equal(pages[0].items.length, 8);
    assert.equal(pages[0].showMore, true);
    assert.equal(pages[0].slots, 9);
    assert.deepEqual(pages[1].items, [8, 9]);
    assert.equal(pages[1].showPrevious, true);
    assert.equal(pages[1].showMore, false);
    assert.equal(pages[1].slots, 9);
  });

  it("keeps a full last page of nine inside the same nine slots", () => {
    const pages = galleryPages(Array.from({ length: 17 }, (_, index) => index));
    assert.equal(pages.length, 2);
    assert.equal(pages[1].items.length, 9);
    assert.equal(pages[1].showPrevious, true);
    assert.equal(pages[1].showMore, false);
    assert.equal(pages[1].slots, 9);
  });
});
