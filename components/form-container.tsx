/* eslint-disable @typescript-eslint/no-explicit-any */

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import FormModal from "./form-modal";
import { db } from "@/lib/firebaseconfig";

export type FormContainerProps = {
  table:
    | "show"
    | "musico"
    | "contratante"
    | "faturamento"
    | "usuario"
    | "notificacao";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "show":
        const contratanteQuery = query(
          collection(db, "contratantes"),
          orderBy("nome")
        );
        const contratantesQuerySnapshot = await getDocs(contratanteQuery);
        const contratantes = contratantesQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const musicosQuery = query(collection(db, "musicos"), orderBy("nome"));
        const musicosQuerySnapshot = await getDocs(musicosQuery);
        const musicos = musicosQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        relatedData = { contratantes: contratantes, musicos: musicos };

        break;

      case "faturamento":
        const showQuery = query(collection(db, "shows"), where("id", "==", id));
        const showsQuerySnapshot = await getDocs(showQuery);
        const shows = showsQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        relatedData = shows[0];
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
