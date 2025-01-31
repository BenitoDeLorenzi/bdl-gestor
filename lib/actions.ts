"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ContratanteSchema,
  FaturamentoSchema,
  MusicoSchema,
  ShowSchema,
} from "./formValidationSchema";
import { db } from "./firebaseconfig";
import { Musicos } from "@/app/(dashboard)/musicos/page";

type CurrentState = {
  success: boolean;
  error: boolean;
};

// MUSICO

export const getMusicoById = async (id: string): Promise<Musicos | null> => {
  try {
    const docRef = doc(db, "musicos", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("Músico não encontrado");
      return null;
    }

    return { ...docSnap.data(), id: docSnap.id } as Musicos;
  } catch (error) {
    console.error("Erro ao buscar músico:", error);
    return null;
  }
};

export const createMusico = async (
  currentState: CurrentState,
  data: MusicoSchema
) => {
  try {
    await addDoc(collection(db, "musicos"), {
      ...data,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateMusico = async (
  currentState: CurrentState,
  data: MusicoSchema
) => {
  try {
    if (!data.id) {
      throw new Error("O ID do contratante é obrigatório para atualizar.");
    }

    await updateDoc(doc(db, "contratantes", data.id), {
      ...data,
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Erro ao atualizar contratante:", error);
    return { success: false, error: true };
  }
};

export const deleteMusico = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    if (!id) {
      throw new Error("O ID do músico é obrigatório para atualizar.");
    }

    await deleteDoc(doc(db, "musicos", id));

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

// CONTRATANTE

export const createContratante = async (
  currentState: CurrentState,
  data: ContratanteSchema
) => {
  try {
    await addDoc(collection(db, "contratantes"), {
      ...data,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateContratante = async (
  currentState: CurrentState,
  data: ContratanteSchema
) => {
  try {
    if (!data.id) {
      throw new Error("O ID do contratante é obrigatório para atualizar.");
    }

    await updateDoc(doc(db, "contratantes", data.id), {
      ...data,
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Erro ao atualizar contratante:", error);
    return { success: false, error: true };
  }
};

export const deleteContratante = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    if (!id) {
      throw new Error("O ID do contratante é obrigatório para atualizar.");
    }

    await deleteDoc(doc(db, "contratantes", id));

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createShow = async (
  currentState: CurrentState,
  data: ShowSchema
) => {
  try {
    await addDoc(collection(db, "shows"), {
      ...data,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateShow = async (
  currentState: CurrentState,
  data: ShowSchema
) => {
  try {
    if (!data.id) {
      throw new Error("O ID do show é obrigatório para atualizar.");
    }

    await updateDoc(doc(db, "shows", data.id), {
      ...data,
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Erro ao atualizar show:", error);
    return { success: false, error: true };
  }
};

export const deleteShow = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    if (!id) {
      throw new Error("O ID do show é obrigatório para atualizar.");
    }

    await deleteDoc(doc(db, "shows", id));

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createFaturamento = async (
  currentState: CurrentState,
  data: FaturamentoSchema
) => {
  try {
    await addDoc(collection(db, "faturamentos"), {
      ...data,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await updateDoc(doc(db, "shows", data.show_id), { finalizado: true });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateFaturamento = async (
  currentState: CurrentState,
  data: FaturamentoSchema
) => {
  try {
    if (!data.id) {
      throw new Error("O ID do faturamento é obrigatório para atualizar.");
    }

    await updateDoc(doc(db, "faturamentos", data.id), {
      ...data,
      data_atualizacao: new Date().toISOString(),
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Erro ao atualizar show:", error);
    return { success: false, error: true };
  }
};

export const deleteFaturamento = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    if (!id) {
      throw new Error("O ID do faturamento é obrigatório para deletar.");
    }

    const faturamentoRef = doc(db, "faturamentos", id);
    const faturamentoSnap = await getDoc(faturamentoRef);

    if (!faturamentoSnap.exists()) {
      throw new Error("Faturamento não encontrado.");
    }

    const faturamentoData = faturamentoSnap.data();
    const showId = faturamentoData.show_id;

    if (showId) {
      const showRef = doc(db, "shows", showId);
      await updateDoc(showRef, { finalizado: false });
    }

    await deleteDoc(faturamentoRef);

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
