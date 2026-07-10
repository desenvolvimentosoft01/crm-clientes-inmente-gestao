import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? "admin@inmente.com.br";
  const senha = process.env.SEED_USER_SENHA ?? "mudar123";
  const nome = process.env.SEED_USER_NOME ?? "Administrador";

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: { nome, email, senhaHash },
  });

  console.log(`Usuário pronto: ${usuario.email} (senha: ${senha} se recém-criado)`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
