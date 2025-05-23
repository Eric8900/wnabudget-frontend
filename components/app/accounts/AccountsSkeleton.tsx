import { Skeleton } from "@/components/ui/skeleton";

export function AccountsSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[1, 2].map((index) => (
                <Skeleton
                    key={index}
                    className="flex justify-between px-2 py-4 rounded-xl bg-neutral-300 transition-all"
                />
            ))}
        </div>
    );
}