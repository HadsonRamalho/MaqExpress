use crate::controllers::validadores::Sanitize;
use crate::models::enderecos::{Endereco, buscar_endereco_usuario};
use crate::models::usuarios;
use crate::{
    controllers::utils::random_public_id,
    schema::{contratos, solicitacoes_contrato},
};
use chrono::NaiveDateTime;
use diesel::alias;
use diesel::prelude::Identifiable;
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable, QueryableByName},
};
use diesel::{JoinOnDsl, Table};
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
#[diesel(table_name = solicitacoes_contrato)]
pub struct SolicitacaoContrato {
    pub id: Uuid,
    pub id_publico: i32,
    pub id_maquina: Uuid,
    pub id_usuario_solicitante: Uuid,
    pub status: String,
    pub data_inicio: NaiveDateTime,
    pub data_fim: NaiveDateTime,
    pub data_criacao: NaiveDateTime,
    pub data_atualizacao: NaiveDateTime,
}

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
#[diesel(table_name = contratos)]
pub struct Contrato {
    pub id: Uuid,
    pub id_solicitacao: Uuid,
    pub caminho_arquivo: String,
    pub data_geracao: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CriarSolicitacaoDto {
    pub id_maquina: Uuid,
    pub data_inicio: NaiveDateTime,
    pub data_fim: NaiveDateTime,
}

impl Sanitize for CriarSolicitacaoDto {
    fn sanitize(&mut self) {}
}

#[derive(Serialize, Deserialize, ToSchema, Validate)]
pub struct AtualizarStatusSolicitacaoDto {
    pub status: String,
}

impl Sanitize for AtualizarStatusSolicitacaoDto {
    fn sanitize(&mut self) {
        self.status = self.status.trim().to_string();
    }
}

impl SolicitacaoContrato {
    pub fn novo(input: CriarSolicitacaoDto, id_usuario_solicitante: Uuid) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_publico: random_public_id(),
            id_maquina: input.id_maquina,
            id_usuario_solicitante,
            status: String::from("Pendente"),
            data_inicio: input.data_inicio,
            data_fim: input.data_fim,
            data_criacao: chrono::Utc::now().naive_utc(),
            data_atualizacao: chrono::Utc::now().naive_utc(),
        }
    }
}

pub async fn criar_solicitacao(
    conn: &mut AsyncPgConnection,
    solicitacao: &SolicitacaoContrato,
) -> Result<(), String> {
    use crate::schema::solicitacoes_contrato::dsl::*;

    match diesel::insert_into(solicitacoes_contrato)
        .values(solicitacao)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_solicitacao_por_id(
    conn: &mut AsyncPgConnection,
    param_id: &Uuid,
) -> Result<SolicitacaoContrato, String> {
    use crate::schema::solicitacoes_contrato::dsl::*;

    match solicitacoes_contrato
        .filter(id.eq(param_id))
        .get_result(conn)
        .await
    {
        Ok(solicitacao) => Ok(solicitacao),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn deletar_solicitacao(
    conn: &mut AsyncPgConnection,
    param_id: &Uuid,
    param_id_usuario: &Uuid,
) -> Result<(), String> {
    use crate::schema::solicitacoes_contrato::dsl::*;

    match diesel::delete(
        solicitacoes_contrato
            .filter(id.eq(param_id))
            .filter(id_usuario_solicitante.eq(param_id_usuario)),
    )
    .execute(conn)
    .await
    {
        Ok(0) => Err(String::from("Erro")),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn atualizar_status_solicitacao(
    conn: &mut AsyncPgConnection,
    param_id: &Uuid,
    novo_status: &str,
) -> Result<(), String> {
    use crate::schema::solicitacoes_contrato::dsl::*;

    match diesel::update(solicitacoes_contrato.filter(id.eq(param_id)))
        .set((
            status.eq(novo_status),
            data_atualizacao.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(conn)
        .await
    {
        Ok(0) => Err(String::from("Erro")),
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn gerar_e_salvar_contrato_pdf(
    conn: &mut AsyncPgConnection,
    solicitacao: &SolicitacaoContrato,
) -> Result<(), String> {
    let file_name = format!("contrato_{}.pdf", solicitacao.id);
    let mut file = match std::fs::File::create(&file_name) {
        Ok(f) => f,
        Err(e) => return Err(e.to_string()),
    };

    let content = format!(
        "Contrato de Locacao\nMaquina ID: {}\nLocatario ID: {}\nInicio: {}\nFim: {}",
        solicitacao.id_maquina,
        solicitacao.id_usuario_solicitante,
        solicitacao.data_inicio,
        solicitacao.data_fim
    );

    if let Err(e) = std::io::Write::write_all(&mut file, content.as_bytes()) {
        return Err(e.to_string());
    }

    let novo_contrato = Contrato {
        id: Uuid::new_v4(),
        id_solicitacao: solicitacao.id,
        caminho_arquivo: file_name.clone(),
        data_geracao: chrono::Utc::now().naive_utc(),
    };

    use crate::schema::contratos::dsl::*;

    match diesel::insert_into(contratos)
        .values(&novo_contrato)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_todas_solicitacoes_usuario(
    conn: &mut AsyncPgConnection,
    id_usr: &Uuid,
) -> Result<Vec<SolicitacaoContrato>, String> {
    use crate::schema::solicitacoes_contrato::dsl::*;

    match solicitacoes_contrato
        .filter(id_usuario_solicitante.eq(id_usr))
        .load::<SolicitacaoContrato>(conn)
        .await
    {
        Ok(lista) => Ok(lista),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_meus_contratos(
    conn: &mut AsyncPgConnection,
    id_usr: &Uuid,
) -> Result<Vec<Contrato>, String> {
    use crate::schema::contratos::dsl as c_dsl;
    use crate::schema::solicitacoes_contrato::dsl as s_dsl;

    match s_dsl::solicitacoes_contrato
        .inner_join(c_dsl::contratos.on(c_dsl::id_solicitacao.eq(s_dsl::id)))
        .filter(s_dsl::id_usuario_solicitante.eq(id_usr))
        .select(c_dsl::contratos::all_columns())
        .load::<Contrato>(conn)
        .await
    {
        Ok(lista) => Ok(lista),
        Err(e) => Err(e.to_string()),
    }
}

alias!(crate::schema::enderecos as endereco_locatario: EnderecoLocatario);
alias!(crate::schema::enderecos as endereco_locador: EnderecoLocador);

#[derive(Serialize, Debug)]
pub struct DadosContratoCompleto {
    pub maquina: crate::models::maquinas::Maquina,
    pub locatario: usuarios::Usuario,
    pub locador: super::empresas::Empresa,
    pub solicitacao: SolicitacaoContrato,
    pub endereco_locatario: Endereco,
    pub endereco_locador: Endereco,
}

pub async fn buscar_dados_contrato(
    conn: &mut AsyncPgConnection,
    id_sol: &Uuid,
) -> Result<DadosContratoCompleto, String> {
    let sol = solicitacoes_contrato::table
        .filter(solicitacoes_contrato::id.eq(id_sol))
        .get_result::<SolicitacaoContrato>(conn)
        .await
        .map_err(|e| e.to_string())?;

    let maq = crate::schema::maquinas::table
        .filter(crate::schema::maquinas::id.eq(sol.id_maquina))
        .get_result::<crate::models::maquinas::Maquina>(conn)
        .await
        .map_err(|e| e.to_string())?;

    let locatario = crate::schema::usuarios::table
        .filter(crate::schema::usuarios::id.eq(sol.id_usuario_solicitante))
        .get_result::<crate::models::usuarios::Usuario>(conn)
        .await
        .map_err(|e| e.to_string())?;

    let id_emp = maq.id_empresa.ok_or("Máquina sem empresa")?;
    let locador = crate::schema::empresas::table
        .filter(crate::schema::empresas::id.eq(id_emp))
        .get_result::<crate::models::empresas::Empresa>(conn)
        .await
        .map_err(|e| e.to_string())?;

    let usuario_locador = crate::schema::usuarios::table
        .filter(crate::schema::usuarios::id.eq(locador.id_usuario))
        .get_result::<crate::models::usuarios::Usuario>(conn)
        .await
        .map_err(|e| e.to_string())?;

    let end_locatario = buscar_endereco_usuario(conn, &locatario).await?;
    let end_locador = buscar_endereco_usuario(conn, &usuario_locador).await?;

    Ok(DadosContratoCompleto {
        maquina: maq,
        locatario,
        locador,
        solicitacao: sol,
        endereco_locatario: end_locatario,
        endereco_locador: end_locador,
    })
}
