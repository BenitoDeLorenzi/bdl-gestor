import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ShowIdClient } from "./client";

const ShowIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ShowIdClient />;
};

export default ShowIdPage;
