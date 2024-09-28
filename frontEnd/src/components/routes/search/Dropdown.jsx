import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Dropdown({ label, options, selectedValue, onSelect }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* Ensure DropdownMenuTrigger has exactly one child */}
        <Button variant="outline" className='p-6'>{selectedValue || label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option, index) => (
          <DropdownMenuItem key={index} onSelect={() => onSelect(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
