"use client";

import { useCallback, memo } from "react";
import {
  useFieldArray,
  type UseFormReturn,
  type FieldValues,
  type UseFieldArrayReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";

import type { ArrayFieldConfig, FormFieldConfig } from "./types";
import { adaptNestedField } from "./utils";


interface ArrayFieldRendererProps<T extends FieldValues> {
  field: ArrayFieldConfig<T>;
  form: UseFormReturn<T>;
  values: Partial<T>;
  onRenderField: (
    fieldConfig: FormFieldConfig<T>,
    values: Partial<T>,
    form: UseFormReturn<T>,
  ) => React.ReactNode;
}


function ArrayFieldRendererInner<T extends FieldValues>({
  field,
  form,
  values,
  onRenderField,
}: ArrayFieldRendererProps<T>) {
  const arrayHelpers = useFieldArray({
    control: form.control,
    name: field.name,
  });

  const { fields: arrayFields, append, remove } = arrayHelpers;

  const addButtonText = field.addButtonText ?? "Tambah Item";
  const removeButtonText = field.removeButtonText ?? "Hapus";

  const handleAddItem = useCallback(() => {
    if (field.defaultItem) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      append(field.defaultItem as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      append({} as any);
    }
  }, [append, field.defaultItem]);

  return (
    <div className="space-y-4">
      {arrayFields.map((item, index) => (
        <div key={item.id} className="relative rounded-md border p-4">
          {field.renderItem ? (
            field.renderItem(index, () => remove(index), arrayHelpers)
          ) : (
            <>
              <div className="space-y-4">
                {field.arrayFields.map((subField) => {
                  const newName = `${field.name}.${index}.${subField.name}`;
                  const adaptedField = adaptNestedField(
                    subField,
                    newName,
                    index,
                    field.name as string,
                  );

                  return (
                    <div key={subField.name}>
                      {onRenderField(
                        adaptedField as unknown as FormFieldConfig<T>,
                        values,
                        form,
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="absolute right-2 top-2"
              >
                {removeButtonText}
              </Button>
            </>
          )}
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddItem}
        variant="outline"
        size="sm"
      >
        {addButtonText}
      </Button>
    </div>
  );
}

export const ArrayFieldRenderer = memo(ArrayFieldRendererInner) as <
  T extends FieldValues,
>(
  props: ArrayFieldRendererProps<T>,
) => React.JSX.Element;
