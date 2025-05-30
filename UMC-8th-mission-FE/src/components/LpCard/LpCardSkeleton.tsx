const LPCardSkeleton = () => {
  return (
    <div className="relative animate-pulse rounded overflow-hidden">
      <div className="w-full aspect-square bg-gray-700 rounded" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-600 rounded w-1/3" />
      </div>
    </div>
  );
};

export default LPCardSkeleton;
