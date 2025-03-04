import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders table skeleton with correct number of rows', () => {
    const count = 3;
    render(<SkeletonLoader type="table" count={count} />);
    // Header + count rows
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(count + 1);
  });

  it('renders card skeleton with correct number of cards', () => {
    const count = 2;
    render(<SkeletonLoader type="card" count={count} />);
    const skeletons = screen.getAllByTestId('skeleton');
    // Each card has 3 skeletons (image, title, subtitle)
    expect(skeletons).toHaveLength(count * 3);
  });

  it('renders profile skeleton with all elements', () => {
    render(<SkeletonLoader type="profile" />);
    const skeletons = screen.getAllByTestId('skeleton');
    // Avatar + 2 text lines + 3 form fields
    expect(skeletons).toHaveLength(6);
  });

  it('renders form skeleton with correct number of fields', () => {
    const count = 4;
    render(<SkeletonLoader type="form" count={count} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(count);
  });

  it('returns null for invalid type', () => {
    // @ts-expect-error Testing invalid type
    const { container } = render(<SkeletonLoader type="invalid" />);
    expect(container.firstChild).toBeNull();
  });

  it('uses default count of 1 when not specified', () => {
    render(<SkeletonLoader type="table" />);
    // Header + 1 row
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(2);
  });
}); 