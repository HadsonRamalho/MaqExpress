use axum::{Json, extract::State};
use diesel::prelude::*;
use diesel_async::{AsyncPgConnection, RunQueryDsl, pooled_connection::deadpool::Pool};
use hyper::StatusCode;
use serde::Serialize;
use crate::controllers::utils::get_conn;
use crate::schema::contratos;

#[derive(Serialize)]
pub struct PerformanceReport {
    pub tempo_medio_geracao_ms: f64,
    pub tempo_manual_estimado_ms: i64,
    pub ganho_eficiencia_percentual: f64,
    pub total_contratos_gerados: i64,
}

#[utoipa::path(
    get,
    path = "/relatorios/performance",
    responses(
        (status = 200, body = PerformanceReport),
        (status = 500, body = String)
    )
)]
pub async fn api_performance_report(
    State(pool): State<Pool<AsyncPgConnection>>,
) -> Result<(StatusCode, Json<PerformanceReport>), (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let results: Vec<i64> = contratos::table
        .select(contratos::tempo_geracao_ms)
        .load::<i64>(conn)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    let total = results.len() as i64;
    if total == 0 {
        return Ok((StatusCode::OK, Json(PerformanceReport {
            tempo_medio_geracao_ms: 0.0,
            tempo_manual_estimado_ms: 600_000, // 10 minutos
            ganho_eficiencia_percentual: 0.0,
            total_contratos_gerados: 0,
        })));
    }

    let soma: i64 = results.iter().sum();
    let media = soma as f64 / total as f64;
    
    let tempo_manual_ms = 600_000; // 10 minutos em ms
    let ganho = ((tempo_manual_ms as f64 - media) / tempo_manual_ms as f64) * 100.0;

    Ok((StatusCode::OK, Json(PerformanceReport {
        tempo_medio_geracao_ms: media,
        tempo_manual_estimado_ms: tempo_manual_ms,
        ganho_eficiencia_percentual: ganho,
        total_contratos_gerados: total,
    })))
}
