import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  } else {
    redirect("/home");
  }

  return null; // Este código não será alcançado por causa do redirect
};

export default HomePage;
