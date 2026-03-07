use crate::controllers::validadores::{Sanitize, Texto};
use crate::{controllers::utils::random_public_id, schema::maquinas};
use chrono::NaiveDateTime;
use diesel::prelude::Identifiable;
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable, QueryableByName},
    result::Error,
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
#[diesel(table_name = maquinas)]
pub struct Maquina {
    pub id: Uuid,
    pub id_publico: i32,
    pub id_usuario: Option<Uuid>,
    pub id_empresa: Option<Uuid>,
    pub nome: String,
    pub descricao: String,
    pub numero_serie: String,
    pub ativo: bool,
    pub data_cadastro: NaiveDateTime,
    pub data_atualizacao: NaiveDateTime,
    pub data_delecao: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize, ToSchema, Validate)]
pub struct CadastrarMaquina {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    pub descricao: Texto,
    #[validate(length(min = 1, message = "Número de série não pode ser vazio"))]
    pub numero_serie: Texto,
    pub id_empresa: Option<Uuid>,
}

impl Sanitize for CadastrarMaquina {
    fn sanitize(&mut self) {
        self.nome = Texto(self.nome.trim().to_string());
        self.descricao = Texto(self.descricao.trim().to_string());
        self.numero_serie = Texto(self.numero_serie.trim().to_string());
    }
}

#[derive(Serialize, Deserialize, Validate, ToSchema)]
pub struct AtualizarMaquinaDto {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    pub descricao: Texto,
    #[validate(length(min = 1, message = "Número de série não pode ser vazio"))]
    pub numero_serie: Texto,
    pub id_empresa: Option<Uuid>,
    pub ativo: bool,
}

impl Sanitize for AtualizarMaquinaDto {
    fn sanitize(&mut self) {
        self.nome = Texto(self.nome.trim().to_string());
        self.descricao = Texto(self.descricao.trim().to_string());
        self.numero_serie = Texto(self.numero_serie.trim().to_string());
    }
}

pub struct AtualizarMaquina {
    pub id_maquina: Uuid,
    pub id_usuario: Uuid,
    pub nome: String,
    pub descricao: String,
    pub numero_serie: String,
    pub id_empresa: Option<Uuid>,
    pub ativo: bool,
}

impl AtualizarMaquina {
    pub fn new(id_maquina: Uuid, id_usuario: Uuid, dados: AtualizarMaquinaDto) -> Self {
        Self {
            id_maquina,
            id_usuario,
            nome: dados.nome.into(),
            descricao: dados.descricao.into(),
            numero_serie: dados.numero_serie.into(),
            id_empresa: dados.id_empresa,
            ativo: dados.ativo,
        }
    }
}

impl Maquina {
    pub fn novo(input: CadastrarMaquina, id_usuario_logado: Uuid) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_publico: random_public_id(),
            id_usuario: Some(id_usuario_logado),
            id_empresa: input.id_empresa,
            nome: input.nome.into(),
            descricao: input.descricao.into(),
            numero_serie: input.numero_serie.into(),
            ativo: true,
            data_cadastro: chrono::Utc::now().naive_utc(),
            data_atualizacao: chrono::Utc::now().naive_utc(),
            data_delecao: None,
        }
    }
}

pub async fn cadastrar_maquina(
    conn: &mut AsyncPgConnection,
    maquina: &Maquina,
) -> Result<(), String> {
    use crate::schema::maquinas::dsl::*;

    match diesel::insert_into(maquinas)
        .values(maquina)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_maquina_por_id(
    conn: &mut AsyncPgConnection,
    param: &Uuid,
) -> Result<Maquina, String> {
    use crate::schema::maquinas::dsl::*;

    match maquinas.filter(id.eq(param)).get_result(conn).await {
        Ok(maquina) => Ok(maquina),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn atualizar_maquina(
    conn: &mut AsyncPgConnection,
    maquina: &AtualizarMaquina,
) -> Result<(), String> {
    use crate::schema::maquinas::dsl::*;

    match diesel::update(maquinas)
        .filter(id.eq(maquina.id_maquina))
        .filter(id_usuario.eq(maquina.id_usuario))
        .set((
            nome.eq(&maquina.nome),
            descricao.eq(&maquina.descricao),
            numero_serie.eq(&maquina.numero_serie),
            id_empresa.eq(maquina.id_empresa),
            ativo.eq(maquina.ativo),
            data_atualizacao.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(conn)
        .await
    {
        Ok(0) => Err("Máquina não encontrada ou você não tem permissão para editá-la".to_string()),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
