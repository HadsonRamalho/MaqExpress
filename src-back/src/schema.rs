pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "tipo_usuario"))]
    pub struct TipoUsuario;
}

diesel::table! {
    contratos (id) {
        id -> Uuid,
        id_solicitacao -> Uuid,
        #[max_length = 255]
        caminho_arquivo -> Varchar,
        data_geracao -> Timestamp,
    }
}

diesel::table! {
    empresas (id) {
        id -> Uuid,
        id_publico -> Int4,
        id_usuario -> Uuid,
        #[max_length = 128]
        nome -> Varchar,
        #[max_length = 32]
        cnpj -> Varchar,
        ativo -> Bool,
        data_cadastro -> Timestamp,
        data_atualizacao -> Timestamp,
        data_delecao -> Nullable<Timestamp>,
    }
}

diesel::table! {
    enderecos (id) {
        id -> Uuid,
        id_usuario -> Uuid,
        #[max_length = 2]
        uf -> Varchar,
        #[max_length = 16]
        cep -> Varchar,
        #[max_length = 128]
        logradouro -> Varchar,
        #[max_length = 64]
        bairro -> Varchar,
        #[max_length = 64]
        cidade -> Varchar,
        #[max_length = 16]
        numero -> Varchar,
        #[max_length = 64]
        complemento -> Nullable<Varchar>,
        data_cadastro -> Timestamp,
    }
}

diesel::table! {
    maquinas (id) {
        id -> Uuid,
        id_publico -> Int4,
        id_usuario -> Nullable<Uuid>,
        id_empresa -> Nullable<Uuid>,
        #[max_length = 128]
        nome -> Varchar,
        descricao -> Text,
        #[max_length = 128]
        numero_serie -> Varchar,
        ativo -> Bool,
        data_cadastro -> Timestamp,
        data_atualizacao -> Timestamp,
        data_delecao -> Nullable<Timestamp>,
    }
}

diesel::table! {
    solicitacoes_contrato (id) {
        id -> Uuid,
        id_publico -> Int4,
        id_maquina -> Uuid,
        id_usuario_solicitante -> Uuid,
        #[max_length = 32]
        status -> Varchar,
        data_inicio -> Timestamp,
        data_fim -> Timestamp,
        data_criacao -> Timestamp,
        data_atualizacao -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::TipoUsuario;

    usuarios (id) {
        id -> Uuid,
        id_publico -> Int4,
        #[max_length = 128]
        nome -> Varchar,
        #[max_length = 128]
        email -> Varchar,
        #[max_length = 32]
        cpf -> Varchar,
        #[max_length = 128]
        senha -> Varchar,
        #[max_length = 16]
        tipo_login -> Varchar,
        tipo_usuario -> TipoUsuario,
        ativo -> Bool,
        data_cadastro -> Timestamp,
        data_atualizacao -> Timestamp,
        data_delecao -> Nullable<Timestamp>,
    }
}

diesel::joinable!(contratos -> solicitacoes_contrato (id_solicitacao));
diesel::joinable!(enderecos -> usuarios (id_usuario));
diesel::joinable!(solicitacoes_contrato -> maquinas (id_maquina));
diesel::joinable!(solicitacoes_contrato -> usuarios (id_usuario_solicitante));
diesel::joinable!(maquinas -> empresas (id_empresa));

diesel::allow_tables_to_appear_in_same_query!(
    contratos,
    empresas,
    enderecos,
    maquinas,
    solicitacoes_contrato,
    usuarios,
);
