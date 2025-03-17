import { useParams } from "next/navigation";

export const useShowId = () => {
  const params = useParams();
  return params.showId as string;
};
