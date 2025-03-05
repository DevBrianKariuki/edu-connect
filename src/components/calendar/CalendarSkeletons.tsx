
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="border rounded-lg p-3">
      <Skeleton className="h-5 w-36 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function UpcomingEventsSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CalendarSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-md" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingEventsSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
