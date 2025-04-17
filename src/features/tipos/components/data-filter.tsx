import { Input } from "@/components/ui/input";
import { useTiposFilter } from "../hooks/use-tipos-filters";

export const DataFilters = () => {
  const [{ search }, setFilters] = useTiposFilter();

  const onSearchChange = (value: string) => {
    setFilters({ search: value === "" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
      <div className="flex gap-2">
        <Input
          className="h-8"
          placeholder="Procurar por nome"
          value={search || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          clearable
          onClear={() => {
            setFilters({ search: "" });
          }}
        />
      </div>
    </div>
  );
};
