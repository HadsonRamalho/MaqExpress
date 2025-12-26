use std::ops::Deref;

use axum::{
    Json,
    extract::{FromRequest, Request},
};
use hyper::StatusCode;
use serde::{Deserialize, Deserializer, Serialize, de::DeserializeOwned};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, PartialEq, Serialize, ToSchema)]
#[schema(example = "Texto sem espaços extras")]
pub struct Texto(pub String);

impl<'de> Deserialize<'de> for Texto {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(Texto(s.trim().to_string()))
    }
}

impl Deref for Texto {
    type Target = String;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl From<Texto> for String {
    fn from(value: Texto) -> Self {
        value.0
    }
}

pub trait Sanitize {
    fn sanitize(&mut self);
}

pub struct JsonValidado<T>(pub T);

impl<T, S> FromRequest<S> for JsonValidado<T>
where
    T: DeserializeOwned + Validate + Sanitize + Send + Sync + 'static,
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Json(mut payload) = Json::<T>::from_request(req, state)
            .await
            .map_err(|err| (StatusCode::BAD_REQUEST, err.to_string()))?;

        payload.sanitize();

        if let Err(erros) = payload.validate() {
            return Err((StatusCode::BAD_REQUEST, erros.to_string()));
        }

        Ok(JsonValidado(payload))
    }
}
