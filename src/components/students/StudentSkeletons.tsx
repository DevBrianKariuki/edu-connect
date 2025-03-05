
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function StudentClassCardSkeleton() {
  return (
    <Card className="dark:bg-secondary/30">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-28" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

export function StudentFilterSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function StudentTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
    </TableRow>
  );
}

export function StudentTableSkeleton() {
  return (
    <>
      {Array(5).fill(0).map((_, i) => (
        <StudentTableRowSkeleton key={i} />
      ))}
    </>
  );
}

export function ClassCardsSkeleton() {
  return (
    <>
      {Array(3).fill(0).map((_, i) => (
        <StudentClassCardSkeleton key={i} />
      ))}
    </>
  );
}
