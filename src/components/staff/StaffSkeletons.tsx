
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function StaffStatCardSkeleton() {
  return (
    <Card className="dark:bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-lg">
          <Skeleton className="h-5 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          <Skeleton className="h-8 w-16" />
        </p>
        <p className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-28 mt-1" />
        </p>
      </CardContent>
    </Card>
  );
}

export function StaffTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
    </TableRow>
  );
}

export function StaffTableSkeleton() {
  return (
    <>
      {Array(5).fill(0).map((_, i) => (
        <StaffTableRowSkeleton key={i} />
      ))}
    </>
  );
}
