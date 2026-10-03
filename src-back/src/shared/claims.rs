use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::usuarios::model::TipoUsuario;
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Claims {
    pub id: Uuid,
    pub id_publico: i32,
    pub tipo_usuario: TipoUsuario,
    pub email: String,
    pub exp: usize,
}
