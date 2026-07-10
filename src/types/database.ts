export type StatusCliente = "ativo" | "em_implantacao" | "inadimplente" | "cancelado";

export type Cliente = {
  id: string;
  nome: string;
  link_site: string | null;
  contato_nome: string | null;
  contato_telefone: string | null;
  contato_email: string | null;
  plano: string | null;
  valor_mensal: number | null;
  status: StatusCliente;
  data_inicio: string | null;
  observacoes: string | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type ClienteInsert = {
  id?: string;
  nome: string;
  link_site?: string | null;
  contato_nome?: string | null;
  contato_telefone?: string | null;
  contato_email?: string | null;
  plano?: string | null;
  valor_mensal?: number | null;
  status?: StatusCliente;
  data_inicio?: string | null;
  observacoes?: string | null;
  criado_por?: string | null;
  criado_em?: string;
  atualizado_em?: string;
};

export type ClienteUpdate = Partial<ClienteInsert>;

export type Interacao = {
  id: string;
  cliente_id: string;
  descricao: string;
  autor_id: string | null;
  criado_em: string;
};

export type InteracaoInsert = {
  id?: string;
  cliente_id: string;
  descricao: string;
  autor_id?: string | null;
  criado_em?: string;
};

export type InteracaoUpdate = Partial<InteracaoInsert>;

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: Cliente;
        Insert: ClienteInsert;
        Update: ClienteUpdate;
        Relationships: [];
      };
      interacoes: {
        Row: Interacao;
        Insert: InteracaoInsert;
        Update: InteracaoUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
