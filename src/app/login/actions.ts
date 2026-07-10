"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function entrar(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  try {
    await signIn("credentials", { email, senha, redirectTo: "/clientes" });
  } catch (erro) {
    if (erro instanceof AuthError) {
      redirect(`/login?erro=${encodeURIComponent("E-mail ou senha inválidos")}`);
    }
    throw erro;
  }
}

export async function sair() {
  await signOut({ redirectTo: "/login" });
}
