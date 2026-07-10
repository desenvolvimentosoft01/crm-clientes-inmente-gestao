import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const VARIANTES = {
  primario:
    "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
  secundario:
    "border border-black/15 text-foreground hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10",
  fantasma: "text-black/60 hover:text-foreground dark:text-white/60 dark:hover:text-white",
  perigo: "border border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400",
} as const;

type Variante = keyof typeof VARIANTES;

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Botao({
  variante = "secundario",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button className={`${BASE} ${VARIANTES[variante]} ${className}`} {...props} />;
}

export function LinkBotao({
  href,
  variante = "secundario",
  className = "",
  children,
}: {
  href: string;
  variante?: Variante;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTES[variante]} ${className}`}>
      {children}
    </Link>
  );
}
