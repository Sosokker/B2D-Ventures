import { Button } from "@/components/ui/button";
import { FilterParams } from "@/lib/data/projectQuery";

export const ShowFilter = ({ filterParams, clearAll }: { filterParams: FilterParams; clearAll: () => void }) => {
  const { searchTerm, tagFilter, projectStatusFilter, businessTypeFilter } = filterParams;

  if (!searchTerm && !tagFilter && !projectStatusFilter && !businessTypeFilter) {
    return <div></div>;
  }

  if (projectStatusFilter === "all" && businessTypeFilter === "all" && tagFilter === "all") {
    return <div></div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {searchTerm && (
        <Button key={searchTerm} variant="secondary">
          {searchTerm}
        </Button>
      )}

      {tagFilter && tagFilter !== "all" && (
        <Button key={tagFilter} variant="secondary">
          {tagFilter}
        </Button>
      )}

      {projectStatusFilter && projectStatusFilter !== "all" && (
        <Button key={projectStatusFilter} variant="secondary">
          {projectStatusFilter}
        </Button>
      )}

      {businessTypeFilter && businessTypeFilter !== "all" && (
        <Button key={businessTypeFilter} variant="secondary">
          {businessTypeFilter}
        </Button>
      )}

      {/* {sortByTimeFilter && sortByTimeFilter !== "all" && (
        <Button key={sortByTimeFilter} variant="secondary">
          {sortByTimeFilter}
        </Button>
      )} */}

      {/* Clear All button */}
      <Button variant="destructive" onClick={clearAll}>
        Clear All
      </Button>
    </div>
  );
};
