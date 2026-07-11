"use client";

import { useState } from "react";

export function SenhaVisivel({ senha }: { senha: string }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono">{visivel ? senha : "•".repeat(Math.min(senha.length, 12))}</span>
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="text-xs font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
      >
        {visivel ? "ocultar" : "mostrar"}
      </button>
    </span>
  );
}
