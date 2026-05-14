type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-zinc-200 ${className}`.trim()} aria-hidden="true" />;
}
