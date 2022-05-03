import type { AppLoadContext } from "@remix-run/node";
import { json as rawJson } from "@remix-run/node";
import type { Params } from "react-router";

export interface TypedRequest<TFormData = unknown>
  extends Omit<Request, "formData"> {
  formData(): Promise<TypedFormData<TFormData>>;
}

export interface TypedResponse<TAppData = unknown>
  extends Omit<Response, "json"> {
  json(): Promise<TAppData>;
}

export interface DataFunctionArgs<TFormData = unknown> {
  request: TypedRequest<TFormData>;
  context: AppLoadContext;
  params: Params;
}

export interface ActionFunction<TFormData, TAppData = unknown> {
  (args: DataFunctionArgs<TFormData>):
    | Promise<TypedResponse<TAppData>>
    | TypedResponse<TAppData>
    | Promise<TAppData>
    | TAppData;
}

export function json<TAppData>(
  data: TAppData,
  init?: number | ResponseInit | undefined
): TypedResponse<TAppData> {
  return rawJson<TAppData>(data, init);
}

export type Unarray<T> = T extends (infer U)[] ? U : T;

export interface TypedFormData<TFormData>
  extends Omit<
    FormData,
    "append" | "delete" | "get" | "getAll" | "has" | "set" | "forEach"
  > {
  append<TField extends keyof TFormData>(
    name: TField,
    value: TFormData[TField] | Blob,
    fileName?: string
  ): void;
  delete(name: keyof TFormData): void;
  get<TField extends keyof TFormData>(
    name: keyof TFormData
  ): TFormData[TField] | null;
  getAll<TField extends keyof TFormData>(
    name: keyof TFormData
  ): TFormData[TField][];
  has(name: keyof TFormData): boolean;
  set<TField extends keyof TFormData>(
    name: TField,
    value: TFormData[TField] | Blob,
    fileName?: string
  ): void;
  forEach(
    callbackfn: (
      value: FormDataEntryValue,
      key: string,
      parent: FormData
    ) => void,
    thisArg?: unknown
  ): void;
}
