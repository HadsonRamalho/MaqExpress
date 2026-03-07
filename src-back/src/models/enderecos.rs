use crate::{
    controllers::validadores::{Sanitize, Texto},
    models::usuarios::Usuario,
    schema::enderecos,
};
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::{
    Selectable,
    prelude::{Associations, Identifiable, Insertable, Queryable},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

#[derive(
    Queryable, Serialize, Selectable, Insertable, Identifiable, Associations, Debug, Clone,
)]
#[diesel(table_name = enderecos)]
#[diesel(belongs_to(Usuario, foreign_key = id_usuario))]
pub struct Endereco {
    pub id: Uuid,
    pub id_usuario: Uuid,
    pub uf: String,
    pub cep: String,
    pub logradouro: String,
    pub bairro: String,
    pub cidade: String,
    pub numero: String,
    pub complemento: Option<String>,
    pub data_cadastro: NaiveDateTime,
}

#[derive(ToSchema, PartialEq, Debug, Validate, Deserialize)]
pub struct CadastrarEnderecoDto {
    #[validate(length(min = 1, message = "O CEP não pode ser vazio"))]
    pub cep: Texto,
    #[validate(length(min = 2, max = 2, message = "A UF é inválida"))]
    pub uf: Texto,
    #[validate(length(min = 1, message = "O Logradouro não pode ser vazio"))]
    pub logradouro: Texto,
    #[validate(length(min = 1, message = "O Bairro não pode ser vazio"))]
    pub bairro: Texto,
    #[validate(length(min = 1, message = "A Cidade não pode ser vazia"))]
    pub cidade: Texto,
    #[validate(length(min = 1, message = "O Número não pode ser vazio"))]
    pub numero: Texto,
    #[validate(length(max = 120, message = "O Complemento é muito longo"))]
    pub complemento: Option<Texto>,
}

impl Sanitize for CadastrarEnderecoDto {
    fn sanitize(&mut self) {
        self.uf = Texto(self.uf.trim().to_uppercase());
    }
}

pub async fn cadastrar_endereco(
    conn: &mut AsyncPgConnection,
    endereco: Endereco,
) -> Result<(), String> {
    use crate::schema::enderecos::dsl::*;
    match diesel::insert_into(enderecos)
        .values(endereco)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_endereco_usuario(
    conn: &mut AsyncPgConnection,
    usuario: &Usuario,
) -> Result<Endereco, String> {
    let endereco = Endereco::belonging_to(usuario)
        .first::<Endereco>(conn)
        .await
        .map_err(|e| e.to_string())?;

    Ok(endereco)
}
