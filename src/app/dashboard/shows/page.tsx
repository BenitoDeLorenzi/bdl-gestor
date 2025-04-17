import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { ShowsView } from "@/features/shows/components/shows-view";

const ShowsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <ShowsView />;
};

export default ShowsPage;
