import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        senha: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const senha = String(credentials?.senha ?? "");
        if (!email || !senha) return null;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) return null;

        return { id: String(usuario.id), name: usuario.nome, email: usuario.email };
      },
    }),
  ],
});
