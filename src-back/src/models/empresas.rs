use crate::controllers::validadores::{Sanitize, Texto};
use crate::{
    controllers::utils::{random_public_id, validar_cnpj},
    schema::empresas,
};
use chrono::NaiveDateTime;
use diesel::prelude::Identifiable;
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable, QueryableByName},
    result::{DatabaseErrorKind, Error},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

#[derive(
    Queryable,
    Insertable,
    AsChangeset,
    Identifiable,
    Serialize,
    Deserialize,
    Debug,
    Clone,
    QueryableByName,
)]
#[diesel(table_name = empresas)]
pub struct Empresa {
    pub id: Uuid,
    pub id_publico: i32,
    pub id_usuario: Uuid,
    pub nome: String,
    pub cnpj: String,
    pub ativo: bool,
    pub data_cadastro: NaiveDateTime,
    pub data_atualizacao: NaiveDateTime,
    pub data_delecao: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize, ToSchema, Validate)]
pub struct CadastrarEmpresa {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    #[validate(length(min = 14, max = 18), custom(function = "validar_cnpj"))]
    pub cnpj: Texto,
}

impl Sanitize for CadastrarEmpresa {
    fn sanitize(&mut self) {
        self.nome = Texto(self.nome.trim().to_string());
        self.cnpj = Texto(self.cnpj.trim().to_string());
    }
}

#[derive(Serialize, Deserialize, Validate, ToSchema)]
pub struct AtualizarEmpresaDto {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    #[validate(length(min = 14, max = 18), custom(function = "validar_cnpj"))]
    pub cnpj: Texto,
    pub ativo: bool,
}

impl Sanitize for AtualizarEmpresaDto {
    fn sanitize(&mut self) {
        self.nome = Texto(self.nome.trim().to_string());
        self.cnpj = Texto(self.cnpj.trim().to_string());
    }
}

pub struct AtualizarEmpresa {
    pub id_empresa: Uuid,
    pub id_usuario: Uuid,
    pub nome: String,
    pub cnpj: String,
    pub ativo: bool,
}

impl AtualizarEmpresa {
    pub fn new(id_empresa: Uuid, id_usuario: Uuid, dados: AtualizarEmpresaDto) -> Self {
        Self {
            id_empresa,
            id_usuario,
            nome: dados.nome.into(),
            cnpj: dados.cnpj.into(),
            ativo: dados.ativo,
        }
    }
}

impl Empresa {
    pub fn novo(input: CadastrarEmpresa, id_usuario: Uuid) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_publico: random_public_id(),
            id_usuario,
            nome: input.nome.into(),
            cnpj: input.cnpj.into(),
            ativo: true,
            data_cadastro: chrono::Utc::now().naive_utc(),
            data_atualizacao: chrono::Utc::now().naive_utc(),
            data_delecao: None,
        }
    }
}

pub async fn cadastrar_empresa(
    conn: &mut AsyncPgConnection,
    empresa: &Empresa,
) -> Result<(), String> {
    use crate::schema::empresas::dsl::*;

    match diesel::insert_into(empresas)
        .values(empresa)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(Error::DatabaseError(DatabaseErrorKind::UniqueViolation, info)) => {
            if let Some(constraint_name) = info.constraint_name() {
                if constraint_name == "empresas_cnpj_unique" {
                    return Err("Este CNPJ já está cadastrado.".to_string());
                }
            }
            Err("Erro de duplicidade no banco de dados".to_string())
        }
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_empresa_por_id(
    conn: &mut AsyncPgConnection,
    param: &Uuid,
) -> Result<Empresa, String> {
    use crate::schema::empresas::dsl::*;

    match empresas.filter(id.eq(param)).get_result(conn).await {
        Ok(empresa) => Ok(empresa),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn atualizar_empresa(
    conn: &mut AsyncPgConnection,
    empresa: &AtualizarEmpresa,
) -> Result<(), String> {
    use crate::schema::empresas::dsl::*;

    match diesel::update(empresas)
        .filter(id.eq(empresa.id_empresa))
        .filter(id_usuario.eq(empresa.id_usuario))
        .set((
            nome.eq(&empresa.nome),
            cnpj.eq(&empresa.cnpj),
            ativo.eq(empresa.ativo),
            data_atualizacao.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(conn)
        .await
    {
        Ok(0) => Err("Empresa não encontrada ou você não tem permissão para editá-la".to_string()),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
