import React from 'react';

const Loader = () => {
  return <div>Loading...</div>;
};

export default Loader;


export const SkeletonLoader = ({
  width = 'unset',
  length = 3,
}: {
  width?: string;
  length?: number;
}) => {
  const skeletons = Array.from({ length }, (_, idx) => (
    <div className="skeleton-shape" style={{ width }} key={idx}></div>
  ));
  return (
    <div className="skeleton-loader">
      {skeletons}
    </div>
  );
};
