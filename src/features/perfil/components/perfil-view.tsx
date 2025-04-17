"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdatePerfilEmail } from "@/features/perfil/api/use-update-email";
import { useUpdatePerfilName } from "@/features/perfil/api/use-update-name";
import { useUpdatePerfilPassword } from "@/features/perfil/api/use-update-password";
import { useUpdatePerfilPhone } from "@/features/perfil/api/use-update-phone";
import { PerfilCard } from "@/features/perfil/components/perfil-card";
import { Usuarios } from "@/features/usuarios/types";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { useConnectGoogleCalendar } from "../api/use-connect-google-calendar";
import { useDisconnectGoogleCalendar } from "../api/use-disconnect-google-calendar";

interface PerfilClientPageProps {
  user: Usuarios;
}

type PerfilFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export const PerfilView = ({ user }: PerfilClientPageProps) => {
  const { mutate: mutateName, isPending: isPendingName } =
    useUpdatePerfilName();
  const { mutate: mutateEmail, isPending: isPendingEmail } =
    useUpdatePerfilEmail();
  const { mutate: mutatePhone, isPending: isPendingPhone } =
    useUpdatePerfilPhone();
  const { mutate: mutatePassword, isPending: isPendingPassword } =
    useUpdatePerfilPassword();
  const {
    mutate: connectGoogleCalendar,
    isPending: isPendingConnectGoogleCalendar,
  } = useConnectGoogleCalendar();
  const { mutate: disconnectGoogleCalendar, isPending: isPendingDisconnect } =
    useDisconnectGoogleCalendar();

  const form = useForm<PerfilFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
    },
  });

  const handleUpdateName = (data: PerfilFormData) => {
    mutateName({ json: { userId: user.$id, name: data.name } });
  };

  const handleUpdateEmail = (data: PerfilFormData) => {
    mutateEmail(
      { json: { userId: user.$id, email: data.email } },
      {
        onSuccess: (data) => {
          if (!data.success) {
            if (data.error?.code === 409) {
              form.setError("email", {
                message: "Já existe um alvo com o mesmo ID.",
              });
            }
          }
        },
      }
    );
  };

  const handleUpdatePhone = (data: PerfilFormData) => {
    mutatePhone(
      { json: { userId: user.$id, phone: data.phone.trim() } },
      {
        onSuccess: (data) => {
          console.log(data);
          if (!data.success) {
            if (data.error?.code === 400) {
              form.setError("phone", {
                message:
                  "O número de telefone deve começar com '+' e pode ter no máximo quinze dígitos.",
              });
            }
            if (data.error?.code === 409) {
              form.setError("phone", {
                message: "Já existe um alvo com o mesmo ID.",
              });
            }
          }
        },
      }
    );
  };

  const handleUpdatePassword = (data: PerfilFormData) => {
    mutatePassword(
      { json: { userId: user.$id, password: data.password } },
      {
        onSuccess: (data) => {
          if (!data.success) {
            console.log(data);
            if (data.error?.code === 400) {
              form.setError("password", {
                message:
                  "A senha deve ter entre 8 e 265 caracteres e não deve ser uma das senhas comumente usadas.",
              });
            }
          } else {
            form.setValue("password", "");
          }
        },
      }
    );
  };

  const handleConnectGoogleCalendar = () => {
    if (!user.prefs.googleAccessToken) {
      connectGoogleCalendar();
    } else {
      disconnectGoogleCalendar();
    }
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6">
        <Card className="w-full">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex col-span-2 lg:col-span-1 items-center gap-2">
                <Avatar className="size-14 lg:size-16">
                  <AvatarFallback>
                    <span className="text-xl font-semibold truncate">
                      {getInitials(user.name)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <h1 className="font-semibold text-md lg:text:lg">
                  {user.name}
                </h1>
              </div>
              <div className="flex col-span-2 lg:col-span-1">
                <div className="flex flex-row justify-between items-center lg:items-start w-full">
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                    <p>
                      {`Ingressou: ${format(
                        new Date(user.$createdAt),
                        "dd, MMM, yyyy, HH:mm"
                      )}`}
                    </p>
                    <p>
                      {`Última atividade: ${format(
                        new Date(user.accessedAt),
                        "dd, MMM, yyyy"
                      )}`}
                    </p>
                  </div>
                  <div>
                    <Badge>não verificado</Badge>
                  </div>
                </div>
              </div>
            </div>
            <DottedSeparator className="py-4" />
            <div className="flex justify-end gap-4">
              <Button>Verificar</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-5">
            <CardHeader className="p-0">
              <CardTitle>Google Calendar</CardTitle>
              <CardDescription>
                Conectar ao Google Calendar para vincular os shows salvos ao seu
                calendário do google.
              </CardDescription>
            </CardHeader>
            <DottedSeparator className="py-4" />
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleConnectGoogleCalendar}
                variant={
                  user.prefs.googleAccessToken ? "destructive" : "default"
                }
                disabled={isPendingConnectGoogleCalendar || isPendingDisconnect}
              >
                {user.prefs.googleAccessToken ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <PerfilCard<PerfilFormData>
          formField="name"
          title="Nome"
          disabled={form.getValues("name") === user.name}
          onSubmit={handleUpdateName}
          isLoading={isPendingName}
        />

        <PerfilCard<PerfilFormData>
          formField="email"
          title="Email"
          description="Atualizar e-mail do usuário. Um e-mail deve ser formatado como: nome@exemplo.com."
          disabled={form.getValues("email") === user.email}
          onSubmit={handleUpdateEmail}
          isLoading={isPendingEmail}
        />

        <PerfilCard<PerfilFormData>
          formField="phone"
          title="Telefone"
          description="Atualizar telefone do usuário. O número de telefone deve começar com '+' e ter no máximo 15 dígitos, por exemplo: +5548912345678."
          disabled={form.getValues("phone") === user.phone}
          onSubmit={handleUpdatePhone}
          isLoading={isPendingPhone}
        />

        <PerfilCard<PerfilFormData>
          formField="password"
          title="Nova senha"
          description="Insira uma nova senha. Uma senha deve conter pelo menos 8 caracteres."
          disabled={form.getValues("password") === user.password}
          onSubmit={handleUpdatePassword}
          isLoading={isPendingPassword}
        />
      </div>
    </FormProvider>
  );
};
