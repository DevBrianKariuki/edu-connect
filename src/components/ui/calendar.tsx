
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 pointer-events-auto"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Caption: CustomCaption
      }}
      onDayClick={(day, modifiers, e) => {
        if (props.onDayClick) {
          props.onDayClick(day, modifiers, e);
        }
        
        if (props.mode === 'single' && props.onSelect && !modifiers.disabled) {
          props.onSelect(day, undefined, undefined, undefined);
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CustomCaption(props: CaptionProps) {
  const { displayMonth: month } = props;
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  
  const [selectedYear, setSelectedYear] = React.useState(month.getFullYear().toString());
  
  const years = Array.from({ length: 121 }, (_, i) => new Date().getFullYear() - 100 + i);
  
  const handleMonthChange = (increment: number) => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + increment);
    setSelectedYear(newMonth.getFullYear().toString());
    
    if (increment > 0 && nextMonth) {
      goToMonth(nextMonth);
    } else if (increment < 0 && previousMonth) {
      goToMonth(previousMonth);
    }
  };
  
  const handleYearChange = (year: string) => {
    const newMonth = new Date(month);
    newMonth.setFullYear(parseInt(year));
    setSelectedYear(year);
    
    goToMonth(newMonth);
  };
  
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        )}
        onClick={() => handleMonthChange(-1)}
        disabled={!previousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div className="flex items-center">
        <span className="text-sm font-medium mr-1">
          {month.toLocaleString("default", { month: "long" })}
        </span>
        
        <Select
          value={selectedYear}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="h-7 w-[70px] px-2 text-xs">
            <SelectValue placeholder={selectedYear} />
          </SelectTrigger>
          <SelectContent className="h-[200px] overflow-y-auto">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-xs">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        )}
        onClick={() => handleMonthChange(1)}
        disabled={!nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export { Calendar };
