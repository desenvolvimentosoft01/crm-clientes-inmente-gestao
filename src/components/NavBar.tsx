import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sair } from "@/app/login/actions";
import { AtivarNotificacoes } from "@/components/AtivarNotificacoes";
import { TIPOS_ERRO_CRITICO } from "@/lib/data";

export async function NavBar() {
  const session = await auth();

  if (!session?.user) return null;

  const totalErrosCriticos = await prisma.erroLog.count({
    where: { tipo: { in: [...TIPOS_ERRO_CRITICO] } },
  });

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-3 dark:border-white/10">
      <div className="flex items-center gap-6">
        <Link href="/clientes" className="font-semibold">
          CRM In Mente
        </Link>
        <Link href="/erros" className="flex items-center gap-1.5 text-sm font-medium">
          ⚠️ Erros críticos
          {totalErrosCriticos > 0 && (
            <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-xs text-red-600 dark:text-red-400">
              {totalErrosCriticos}
            </span>
          )}
        </Link>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <AtivarNotificacoes />
        <span className="text-black/60 dark:text-white/60">{session.user.email}</span>
        <form action={sair}>
          <button type="submit" className="underline underline-offset-2">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
