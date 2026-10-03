---
name: catcher
description: >
  Complete usage guide for the Catcher library for error handling with the Result pattern (Ok/Err) in TypeScript.
  Use this skill ALWAYS whenever the user mentions catchError, catchErrorSync, catchErrorAll, catchGenerator, catchAsyncGenerator, Result, ok(), err(), combine, fromNullable, fromThrowable, fromPromise, or asks to handle errors without try/catch in TypeScript.
  Also trigger when the user wants to convert Promises or generator streams to Result, chain operations that can fail, combine multiple results, or use the Railway-Oriented Programming (ROP) pattern in the project.
---

# Catcher - Usage Guide

TypeScript library for functional error handling using the Result<T, E> type.
Eliminates try/catch blocks scattered throughout the code and makes the error flow explicit and composable.

## Imports

```ts
import {
  catchError, catchErrorSync, catchErrorWithTimeout,
  catchErrorAll, catchErrorAllSync,
  catchGenerator, catchAsyncGenerator,
  combine, combineAll, partition,
  fromNullable, fromThrowable, fromPromise,
  ok, err,
  Result, AsyncResult,
} from "@catcherjs/core";
```

---

## 1. Fundamental Types

| Type                | Description                                       |
| ------------------- | ------------------------------------------------- |
| Result<T, E>        | Success (ok) or failure (err) [E, undefined] | [undefined, T] |
| AsyncResult<T, E>   | Promise<Result<T, E>>                             |
| ResultSuccess<T, E> | Success result (type guard)                       |
| ResultFailure<T, E> | Failure result (type guard)                       |

```ts
const success = ok(42);
const failure = err(new Error("Oops"));
```

---

## 2. Catching Errors

### catchError - Promise or Function → Result

```ts
const result = await catchError(fetch("/api/data"));

const result2 = await catchError(() => fetchUser(id), [NetworkError, TimeoutError]);
```

### catchErrorWithTimeout - with timeout

```ts
const result = await catchErrorWithTimeout(() => longOperation(), 5000);
```

### catchErrorSync - synchronous function → Result

```ts
const result = catchErrorSync(() => JSON.parse(rawJson));
const result2 = catchErrorSync(() => riskyOp(), [TypeError]);
```

---

## 3. Generator Streams

```ts
for (const result of catchGenerator(readRows, [RowError, TypeError])) {
  if (result.isErr()) break;
  console.log(result.data);
}

for await (const result of catchAsyncGenerator(streamPages())) {
  if (result.isErr()) break;
  console.log(result.data);
}
```

---

## 4. Checking and Extracting the Result

```ts
const result = await catchError(getUser(id));

if (result.isOk()) console.log(result.data);
if (result.isErr()) console.log(result.error);

if (result.isErr()) {
  console.log(result.error.message);
} else {
  console.log(result.data.status);
}

result.data;
result.error;

const data = result.unwrap();
const error = result.unwrapErr();

const value = result.getOrElse(0);
```

---

## 5. Chaining (Fluent API)

```ts
const result = await catchError(getUser(id))
  .then(r => r
    .map(user => user.name.toUpperCase())
    .mapErr(e => new AppError("User not found"))
    .andThen(name => validateName(name))
    .tap(name => console.log("Name:", name))
    .tapErr(e => logger.error(e))
    .getOrElse("Anonymous")
  );
```

| Method                      | When to use                               |
| --------------------------- | ----------------------------------------- |
| .map(fn)                    | Transform the success value               |
| .mapErr(fn)                 | Transform the error                       |
| .andThen(fn) / .flatMap(fn) | Chain operation that returns Result       |
| .orElse(fn)                 | Recover from an error with a new Result   |
| .tap(fn)                    | Side-effect on success (log, cache, etc.) |
| .tapErr(fn)                 | Side-effect on error                      |
| .toPromise()                | Convert back to Promise (rejects if err)  |

---

## 6. Batch Operations

### catchErrorAll - multiple Promises in parallel

```ts
const [r1, r2] = await catchErrorAll([
  fetchUser(1),
  fetchPosts(1),
]);

const results = await catchErrorAll([
  fetchUser(1),
  [fetchProfile(1), [NetworkError]],
  [fetchSettings(1), [DBError], (e) => defaultSettings],
  {
    promise: longQuery(),
    timeoutMs: 3000,
    errorsToCatch: [TimeoutError],
    handler: (e) => [],
  },
]);
```

### catchErrorAllSync - multiple synchronous functions

```ts
const [r1, r2, r3] = catchErrorAllSync([
  () => JSON.parse(a),
  [() => JSON.parse(b), [SyntaxError]],
  { fn: () => riskyOp(), handler: (e) => fallback },
]);
```

---

## 7. Combinators

### combine - stops at the first error

```ts
const result = combine([r1, r2, r3]);
```

### combineAll - collects all errors

```ts
const result = combineAll([r1, r2, r3]);
```

### partition - separates ok and err

```ts
const { ok: users, err: failures } = partition(results);
```

---

## 8. Utilities (Helpers)

### fromNullable - null/undefined → Result

```ts
const result = fromNullable(cache.get(key), new CacheError("miss"));
```

### fromThrowable - wraps function that might throw

```ts
const safeParseJSON = fromThrowable(JSON.parse, [SyntaxError]);
const result = safeParseJSON('{"ok": true}');
```

### fromPromise - readable alias for catchError

```ts
const result = await fromPromise(axios.get("/api"), [AxiosError]);
```

---

## 9. Common Patterns

### Sequential Chaining (Railway)

```ts
async function registerUser(dto: RegisterDTO): AsyncResult<User, AppError> {
  const emailResult = await catchError(checkEmailAvailable(dto.email));
  if (emailResult.isErr()) return err(new AppError("Email in use"));

  const hashResult = catchErrorSync(() => bcrypt.hashSync(dto.password, 10));
  if (hashResult.isErr()) return err(new AppError("Error generating hash"));

  return catchError(db.user.create({ ...dto, password: hashResult.data }));
}
```

### Parallel operations with fallback

```ts
const [userResult, prefsResult] = await catchErrorAll([
  fetchUser(id),
  { promise: fetchPrefs(id), handler: () => defaultPrefs },
]);

if (userResult.isErr()) return handleError(userResult.error);
const user = userResult.data;
const prefs = prefsResult.getOrElse(defaultPrefs);
```

### Validation accumulating errors

```ts
const results = catchErrorAllSync([
  [() => validateName(dto.name), [ValidationError]],
  [() => validateEmail(dto.email), [ValidationError]],
  [() => validateAge(dto.age), [ValidationError]],
]);

const { err: errors } = partition(results);
if (errors.length > 0) return err(errors);
```

---

## 10. Signature Reference

# API Reference - Catcher

```ts
type CaughtError<C extends readonly ErrorClass[]> =
  C extends readonly [] ? unknown :
  number extends C['length'] ? unknown :
  InstanceType<C[number]>
```

## catchError

```ts
async function catchError<T>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
): Promise<Result<T, unknown>>

async function catchError<T, const C extends readonly ErrorClass[]>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch: C
): Promise<Result<T, CaughtError<C>>>
```

## catchErrorWithTimeout

```ts
async function catchErrorWithTimeout<T, E extends ErrorClass>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  timeoutMs: number,
  errorsToCatch?: E[]
): Promise<Result<T, InstanceType<E> | Error>>
```

## catchErrorSync

```ts
function catchErrorSync<T>(
  fn: () => T,
): Result<T, unknown>
```

## catchGenerator / catchAsyncGenerator

```ts
function catchGenerator<Y, R, N>(
  source: Generator<Y, R, N> | (() => Generator<Y, R, N>)
): Generator<Result<Y, unknown>, Result<R, unknown> | undefined, N>

function catchGenerator<Y, R, N, const C extends readonly ErrorClass[]>(
  source: Generator<Y, R, N> | (() => Generator<Y, R, N>),
  errorsToCatch: C
): Generator<Result<Y, CaughtError<C>>, Result<R, CaughtError<C>> | undefined, N>

function catchAsyncGenerator<Y, R, N>(
  source: AsyncGenerator<Y, R, N> | (() => AsyncGenerator<Y, R, N>)
): AsyncGenerator<Result<Y, unknown>, Result<R, unknown> | undefined, N>

function catchAsyncGenerator<Y, R, N, const C extends readonly ErrorClass[]>(
  source: AsyncGenerator<Y, R, N> | (() => AsyncGenerator<Y, R, N>),
  errorsToCatch: C
): AsyncGenerator<Result<Y, CaughtError<C>>, Result<R, CaughtError<C>> | undefined, N>
```

## catchErrorAll

```ts
type CatchErrorAllInput<T> =
  | Promise<T>
  | (() => T | Promise<T>)
  | readonly [Promise<T> | (() => T | Promise<T>)]
  | readonly [Promise<T> | (() => T | Promise<T>), ErrorClass[]]
  | readonly [Promise<T> | (() => T | Promise<T>), readonly ErrorClass[], (error: unknown) => T | void]
  | { promise: Promise<T> | (() => T | Promise<T>); timeoutMs?: number; errorsToCatch?: readonly ErrorClass[]; handler?: (error: unknown) => T | void }

function catchErrorAll<const T extends readonly CatchErrorAllInput<any>[]>(
  inputs: T
): Promise<{ -readonly [K in keyof T]: Result<InferInput<T[K]>, InferInputError<T[K]>> }>
```

## catchErrorAllSync

```ts
type CatchErrorAllSyncInput<T> =
  | (() => T)
  | readonly [() => T]
  | readonly [() => T, ErrorClass[]]
  | readonly [() => T, readonly ErrorClass[], (error: unknown) => T | void]
  | { fn: () => T; errorsToCatch?: readonly ErrorClass[]; handler?: (error: unknown) => T | void }

function catchErrorAllSync<const T extends readonly CatchErrorAllSyncInput<any>[]>(
  inputs: T
): { -readonly [K in keyof T]: Result<InferInputSync<T[K]>, InferInputSyncError<T[K]>> }
```

## combine

```ts
function combine<T extends readonly Result<any, any>[]>(
  results: [...T]
): Result<{ [K in keyof T]: UnwrapOk<T[K]> }, UnwrapErr<T[number]>>
```

## combineAll

```ts
function combineAll<T extends readonly Result<any, any>[]>(
  results: [...T]
): Result<{ [K in keyof T]: UnwrapOk<T[K]> }, UnwrapErr<T[number]>[]>
```

## partition

```ts
function partition<T, E>(results: Result<T, E>[]): { ok: T[]; err: E[] }
```

## fromNullable

```ts
function fromNullable<T, E>(value: T | null | undefined, error: E): Result<T, E>
```

## fromThrowable

```ts
function fromThrowable<T, E extends ErrorClass, Args extends any[]>(
  fn: (...args: Args) => T,
  errorsToCatch?: E[]
): (...args: Args) => Result<T, InstanceType<E>>
```

## fromPromise

```ts
async function fromPromise<T, E extends ErrorClass>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch?: E[]
): Promise<Result<T, InstanceType<E>>>
```

## ok / err

```ts
function ok<T>(data: T): Result<T, never>
function err<E>(error: E): Result<never, E>
```

## ResultMethods (methods on the Result object)

```ts
interface ResultMethods<T, E> {
  isOk(): this is ResultSuccess<T, E>
  isErr(): this is ResultFailure<T, E>
  unwrap(): T
  unwrapErr(): E
  getOrElse<D>(defaultValue: D): T | D
  map<U>(fn: (data: T) => U): Result<U, E>
  mapErr<F>(fn: (error: E) => F): Result<T, F>
  andThen<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>
  flatMap<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>
  orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>
  tap(fn: (data: T) => void): Result<T, E>
  tapErr(fn: (error: E) => void): Result<T, E>
  toPromise(): Promise<T>
}
```

---

## MaqExpress — convenções do projeto

Padrão **único** de erro no frontend (ADR `docs/decisions/0006-tratamento-de-erro-frontend-catcher.md`,
adaptado do Q109 do Zeile):

- **`services/` é a fronteira HTTP** (`services/BaseApi.ts` + por domínio): envolva as chamadas
  `axios` com `catchError` e devolva `Result<T, E>` em vez de deixar a exceção vazar. Quem chama
  (hook/componente) consome o `Result`.
- **Código novo nasce com `Result`** — sem `try/catch` cru nem `throw` solto; o legado
  (`hooks/use-auth.tsx`, `services/*`) migra incrementalmente.
- **Erro sempre tipado** (nunca `any`) — casa com `docs/architecture/contracts.md` (fronteira de
  erro) e `docs/architecture/rust-rules.md` (contraparte do "sem throw cru").
- Na UI: desestruture `[erro, dados]`, mostre o erro com `toast` (sonner) e faça early-return.
