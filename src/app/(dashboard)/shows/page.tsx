import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { ShowsViewSwitcher } from "@/features/shows/components/shows-view-switcher";

const ShowsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ShowsViewSwitcher />;
};

export default ShowsPage;
