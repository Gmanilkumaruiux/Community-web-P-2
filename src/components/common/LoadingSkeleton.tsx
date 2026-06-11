import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'details' | 'list';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded-sm w-1/3" />
          <div className="h-3 bg-slate-200 rounded-sm w-1/4" />
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-5 bg-slate-200 rounded-sm w-3/4" />
        <div className="h-4 bg-slate-200 rounded-sm w-full" />
        <div className="h-4 bg-slate-200 rounded-sm w-5/6" />
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="h-4 bg-slate-200 rounded-sm w-1/4" />
        <div className="h-4 bg-slate-200 rounded-sm w-1/4" />
        <div className="ml-auto h-8 bg-slate-200 rounded-lg w-24" />
      </div>
    </div>
  );

  const renderDetailsSkeleton = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 animate-pulse space-y-6">
      <div className="h-64 bg-slate-200 rounded-xl w-full" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded-sm w-32" />
            <div className="h-3 bg-slate-200 rounded-sm w-24" />
          </div>
        </div>
        <div className="h-8 bg-slate-200 rounded-full w-28" />
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded-sm w-1/2" />
        <div className="h-4 bg-slate-200 rounded-sm w-full" />
        <div className="h-4 bg-slate-200 rounded-sm w-full" />
        <div className="h-4 bg-slate-200 rounded-sm w-2/3" />
      </div>
      <div className="pt-6 border-t border-slate-100 flex gap-4">
        <div className="h-10 bg-slate-200 rounded-xl w-32" />
        <div className="h-10 bg-slate-200 rounded-xl w-32" />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
    </div>
  );

  return (
    <div className={type === 'card' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {type === 'card' && renderCardSkeleton()}
          {type === 'details' && renderDetailsSkeleton()}
          {type === 'list' && renderListSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
