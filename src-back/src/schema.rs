// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "tipo_usuario"))]
    pub struct TipoUsuario;
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

diesel::joinable!(enderecos -> usuarios (id_usuario));

diesel::allow_tables_to_appear_in_same_query!(empresas, enderecos, maquinas, usuarios,);
