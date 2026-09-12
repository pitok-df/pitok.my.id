import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import type { ApiErrorResponse, FormFieldConfig } from "./types";


export function objectToFormData(
  obj: Record<string, unknown>,
  form: FormData = new FormData(),
  namespace?: string,
): FormData {
  for (const [property, value] of Object.entries(obj)) {
    const key = namespace ? `${namespace}[${property}]` : property;
    if (value == null) continue;

    if (value instanceof Date) {
      form.append(key, value.toISOString());
    } else if (value instanceof File) {
      form.append(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        const arrayKey = `${key}[]`;
        if (item instanceof File) {
          form.append(arrayKey, item);
        } else {
          form.append(arrayKey, String(item));
        }
      }
    } else if (typeof value === "object") {
      objectToFormData(value as Record<string, unknown>, form, key);
    } else {
      form.append(key, String(value));
    }
  }
  return form;
}


export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>,
): boolean {
  let apiResponse: ApiErrorResponse | undefined;

  if (
    error &&
    typeof error === "object" &&
    "success" in error &&
    error.success === false
  ) {
    apiResponse = error as ApiErrorResponse;
  } else if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "data" in error
  ) {
    apiResponse = (error as { data: ApiErrorResponse }).data;
  } else if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const resp = (error as { response?: { data?: ApiErrorResponse } }).response;
    apiResponse = resp?.data;
  }

  if (!apiResponse || apiResponse.success !== false) {
    return false;
  }

  if (Array.isArray(apiResponse.details)) {
    for (const detail of apiResponse.details) {
      if (detail.field && detail.message) {
        form.setError(detail.field as Path<T>, {
          type: "server",
          message: detail.message,
        });
      }
    }
    return true;
  }

  if (apiResponse.message) {
    form.setError("root" as Path<T>, {
      type: "server",
      message: apiResponse.message,
    });
    return true;
  }

  return false;
}

export function getServerErrorMessage(error: unknown): string {
  const apiError = error as { data?: ApiErrorResponse };
  return apiError?.data?.message ?? "Terjadi kesalahan pada server";
}


export function resolvePlaceholder<T extends FieldValues>(
  placeholder: string | ((values: Partial<T>) => string) | undefined,
  values: Partial<T>,
): string | undefined {
  return typeof placeholder === "function" ? placeholder(values) : placeholder;
}


export function getEmptyItem<
  T extends FieldValues,
  N extends string = string,
>(): Record<string, never> {
  return {} as Record<string, never>;
}


export function adaptNestedField<T extends FieldValues>(
  subField: FormFieldConfig<T>,
  newName: string,
  itemIndex?: number,
  arrayFieldName?: string,
): FormFieldConfig<T> {
  const cloned = { ...subField, name: newName as Path<T> };

  if (cloned.type === "array") {
    console.warn(
      "Nested array fields are not supported, converting to text field",
    );
    (cloned as unknown as { type: string }).type = "text";
  }

  // Wrap dependsOn for array sub-fields to resolve against item-level data first
  if (cloned.dependsOn && itemIndex !== undefined && arrayFieldName) {
    const originalDependsOn = cloned.dependsOn;
    const itemPrefix = `${arrayFieldName}.${itemIndex}.`;

    cloned.dependsOn = {
      ...originalDependsOn,
      condition: (value: unknown, allValues: Partial<T>) => {
        // Check item-level data first
        const itemKey = `${itemPrefix}${originalDependsOn.field}` as Path<T>;
        const itemValue = (
          allValues as Record<string, unknown>
        )[itemKey as string];
        if (itemValue !== undefined) {
          return originalDependsOn.condition(itemValue, allValues);
        }
        // Fall back to form-level
        return originalDependsOn.condition(value, allValues);
      },
    };
  }

  return cloned as FormFieldConfig<T>;
}


export function scrollToField(fieldName: string): void {
  const element = document.querySelector<HTMLElement>(
    `[name="${fieldName}"]`,
  );
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus();
  }
}
