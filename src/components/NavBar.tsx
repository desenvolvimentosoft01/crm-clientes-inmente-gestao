import Link from "next/link";
import { auth } from "@/auth";
import { sair } from "@/app/login/actions";

export async function NavBar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-3 dark:border-white/10">
      <Link href="/clientes" className="font-semibold">
        CRM In Mente
      </Link>
      <div className="flex items-center gap-4 text-sm">
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
