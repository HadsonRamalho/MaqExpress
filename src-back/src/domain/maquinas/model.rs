use crate::shared::validadores::{Sanitize, Texto};
use crate::domain::empresas::model::Empresa;
use crate::domain::usuarios::model::Usuario;
use crate::schema::{maquina_imagens, maquinas};
use crate::shared::utils::random_public_id;
use chrono::NaiveDateTime;
use diesel::prelude::{Associations, Identifiable};
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable, QueryableByName},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(
    Queryable,
    Insertable,
    AsChangeset,
    Identifiable,
    Associations,
    Serialize,
    Deserialize,
    Debug,
    Clone,
    QueryableByName,
)]
#[diesel(table_name = maquinas)]
#[diesel(belongs_to(Usuario, foreign_key = id_usuario))]
#[diesel(belongs_to(Empresa, foreign_key = id_empresa))]
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
    /// Preços em centavos de BRL. Diária é obrigatória; semanal/mensal opcionais.
    pub preco_diaria: i64,
    pub preco_semanal: Option<i64>,
    pub preco_mensal: Option<i64>,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CadastrarMaquina {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    pub descricao: Texto,
    #[validate(length(min = 1, message = "Número de série não pode ser vazio"))]
    pub numero_serie: Texto,
    pub id_empresa: Option<Uuid>,
    /// Preços em centavos de BRL.
    #[validate(range(min = 1, message = "A diária deve ser maior que zero"))]
    pub preco_diaria: i64,
    #[validate(range(min = 1, message = "O preço semanal deve ser maior que zero"))]
    pub preco_semanal: Option<i64>,
    #[validate(range(min = 1, message = "O preço mensal deve ser maior que zero"))]
    pub preco_mensal: Option<i64>,
}

impl Sanitize for CadastrarMaquina {
    fn sanitize(&mut self) {
        self.nome = Texto(self.nome.trim().to_string());
        self.descricao = Texto(self.descricao.trim().to_string());
        self.numero_serie = Texto(self.numero_serie.trim().to_string());
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct AtualizarMaquinaDto {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    pub descricao: Texto,
    #[validate(length(min = 1, message = "Número de série não pode ser vazio"))]
    pub numero_serie: Texto,
    pub id_empresa: Option<Uuid>,
    pub ativo: bool,
    /// Preços em centavos de BRL.
    #[validate(range(min = 1, message = "A diária deve ser maior que zero"))]
    pub preco_diaria: i64,
    #[validate(range(min = 1, message = "O preço semanal deve ser maior que zero"))]
    pub preco_semanal: Option<i64>,
    #[validate(range(min = 1, message = "O preço mensal deve ser maior que zero"))]
    pub preco_mensal: Option<i64>,
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
    pub preco_diaria: i64,
    pub preco_semanal: Option<i64>,
    pub preco_mensal: Option<i64>,
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
            preco_diaria: dados.preco_diaria,
            preco_semanal: dados.preco_semanal,
            preco_mensal: dados.preco_mensal,
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
            preco_diaria: input.preco_diaria,
            preco_semanal: input.preco_semanal,
            preco_mensal: input.preco_mensal,
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
            preco_diaria.eq(maquina.preco_diaria),
            preco_semanal.eq(maquina.preco_semanal),
            preco_mensal.eq(maquina.preco_mensal),
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

pub async fn buscar_maquinas_usuario(
    conn: &mut AsyncPgConnection,
    id_usr: &Uuid,
) -> Result<Vec<Maquina>, String> {
    use crate::schema::maquinas::dsl::*;

    match maquinas
        .filter(id_usuario.eq(id_usr))
        .filter(data_delecao.is_null())
        .load::<Maquina>(conn)
        .await
    {
        Ok(lista) => Ok(lista),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn atualizar_status_ativo_maquina(
    conn: &mut AsyncPgConnection,
    id_maq: &Uuid,
    novo_status: bool,
) -> Result<(), String> {
    use crate::schema::maquinas::dsl::*;

    match diesel::update(maquinas.filter(id.eq(id_maq)))
        .set((
            ativo.eq(novo_status),
            data_atualizacao.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(conn)
        .await
    {
        Ok(0) => Err("Máquina não encontrada".to_string()),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn deletar_maquina(
    conn: &mut AsyncPgConnection,
    id_maq: &Uuid,
    id_usr: &Uuid,
) -> Result<(), String> {
    use crate::schema::maquinas::dsl::*;

    match diesel::update(maquinas)
        .filter(id.eq(id_maq))
        .filter(id_usuario.eq(id_usr))
        .set(data_delecao.eq(chrono::Utc::now().naive_utc()))
        .execute(conn)
        .await
    {
        Ok(0) => Err("Máquina não encontrada ou permissão negada".to_string()),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

// ---------------------------------------------------------------------------
// Imagens da máquina
// ---------------------------------------------------------------------------

#[derive(
    Queryable,
    Insertable,
    Identifiable,
    Associations,
    Serialize,
    Deserialize,
    Debug,
    Clone,
    QueryableByName,
)]
#[diesel(table_name = maquina_imagens)]
#[diesel(belongs_to(Maquina, foreign_key = id_maquina))]
pub struct MaquinaImagem {
    pub id: Uuid,
    pub id_maquina: Uuid,
    pub url: String,
    pub ordem: i32,
    pub principal: bool,
    pub data_cadastro: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct AdicionarImagemDto {
    #[validate(length(min = 1, message = "A URL da imagem não pode ser vazia"))]
    pub url: Texto,
    pub ordem: Option<i32>,
    pub principal: Option<bool>,
}

impl Sanitize for AdicionarImagemDto {
    fn sanitize(&mut self) {
        self.url = Texto(self.url.trim().to_string());
    }
}

impl MaquinaImagem {
    pub fn novo(input: AdicionarImagemDto, id_maquina: Uuid) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_maquina,
            url: input.url.into(),
            ordem: input.ordem.unwrap_or(0),
            principal: input.principal.unwrap_or(false),
            data_cadastro: chrono::Utc::now().naive_utc(),
        }
    }
}

pub async fn adicionar_imagem(
    conn: &mut AsyncPgConnection,
    imagem: &MaquinaImagem,
) -> Result<(), String> {
    use crate::schema::maquina_imagens::dsl::*;

    match diesel::insert_into(maquina_imagens)
        .values(imagem)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn listar_imagens_maquina(
    conn: &mut AsyncPgConnection,
    id_maq: &Uuid,
) -> Result<Vec<MaquinaImagem>, String> {
    use crate::schema::maquina_imagens::dsl::*;

    match maquina_imagens
        .filter(id_maquina.eq(id_maq))
        .order((principal.desc(), ordem.asc()))
        .load::<MaquinaImagem>(conn)
        .await
    {
        Ok(lista) => Ok(lista),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn remover_imagem(
    conn: &mut AsyncPgConnection,
    id_img: &Uuid,
) -> Result<(), String> {
    use crate::schema::maquina_imagens::dsl::*;

    match diesel::delete(maquina_imagens.filter(id.eq(id_img)))
        .execute(conn)
        .await
    {
        Ok(0) => Err("Imagem não encontrada".to_string()),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
