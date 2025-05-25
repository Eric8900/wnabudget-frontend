'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const MIN_YEAR = 2023;
const MIN_MONTH = 1;

export function MonthNavigator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const year = parseInt(searchParams.get('year') || `${new Date().getFullYear()}`);
  const month = parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`);

  const today = new Date();

  const prevDate = new Date(year, month - 2);
  const nextDate = new Date(year, month);

  const canGoPrev = prevDate >= new Date(MIN_YEAR, MIN_MONTH - 1);
  const canGoNext = nextDate <= today;

  const updateParams = (newMonth: number, newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', `${newMonth}`);
    params.set('year', `${newYear}`);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!canGoPrev) return;
          if (month === 1) {
            updateParams(12, year - 1);
          } else {
            updateParams(month - 1, year);
          }
        }}
        disabled={!canGoPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="mx-2 text-2xl text-center font-bold">
        <span className='text-muted-foreground text-sm'>Month of</span><br/>
        {month} / {year}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!canGoNext) return;
          if (month === 12) {
            updateParams(1, year + 1);
          } else {
            updateParams(month + 1, year);
          }
        }}
        disabled={!canGoNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}