import { paginasVisibles } from '@utils/tabla/paginas-visibles';

describe('paginasVisibles', () => {
  it('shows every page of a short list', () => {
    expect(paginasVisibles(1, 1)).toEqual([1]);
    expect(paginasVisibles(2, 3)).toEqual([1, 2, 3]);
  });

  it('collapses far gaps into an ellipsis', () => {
    expect(paginasVisibles(1, 20)).toEqual([1, 2, null, 20]);
    expect(paginasVisibles(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(paginasVisibles(20, 20)).toEqual([1, null, 19, 20]);
  });

  it('fills a one-page gap instead of an ellipsis', () => {
    expect(paginasVisibles(4, 20)).toEqual([1, 2, 3, 4, 5, null, 20]);
  });
});
