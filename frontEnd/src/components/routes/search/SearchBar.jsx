import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchHook } from "@/components/hooks/searchHook";

export function SearchBar() {
  const { searchTerm, setSearchTerm, handleSubmit } = searchHook();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row mb-6">
      <Input
        className="mb-2 sm:mb-0 sm:mr-2"
        placeholder="Search job title or keyword"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Input
        className="mb-2 sm:mb-0 sm:mr-2"
        placeholder="City or municipality"
      />
      <Button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-hover"
      >
        Find Jobs
      </Button>
    </form>
  );
}
