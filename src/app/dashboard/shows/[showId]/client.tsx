"use client";

import DottedSeparator from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetShow } from "@/features/shows/api/use-get-show";
import { ShowOverview } from "@/features/shows/components/show-overview";
import { ShowsBreadCrumbs } from "@/features/shows/components/shows-breadcrumbs";
import { useShowId } from "@/features/shows/hooks/use-show-id";

export const ShowIdClient = () => {
  const showId = useShowId();
  const { data, isLoading } = useGetShow({ showId: showId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Show não encontrado." />;
  }

  return (
    <div className="flex flex-col">
      <ShowsBreadCrumbs show={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ShowOverview show={data} />
      </div>
    </div>
  );
};
