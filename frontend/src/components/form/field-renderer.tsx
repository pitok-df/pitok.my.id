"use client";

import { memo, useMemo } from "react";
import type {
  ControllerRenderProps,
  UseFormReturn,
  Path,
  FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PasswordInput } from "./password-input";
import InputCurrency from "./input-currency";
import { DatePicker } from "./date-picker";
import { DateTimePicker } from "./datetime-picker";
import { FileUploader } from "./image-uploader";
import { InputPercentage } from "./input-percentage";
import { SelectOption } from "../shared/select-option";
import { MultiSelect } from "./multi-select";
import { SegmentedControl } from "./segmented-control";
import { DualOptionSwitch } from "./dual-option-switch";

import type {
  FormFieldConfig,
  TextFieldConfig,
  SelectFieldConfig,
  MultiSelectFieldConfig,
  ToggleFieldConfig,
  DualSwitchFieldConfig,
  FileFieldConfig,
  CustomFieldConfig,
  PlaceholderResolver,
} from "./types";
import { resolvePlaceholder } from "./utils";


interface FieldInputSwitchProps<T extends FieldValues> {
  field: FormFieldConfig<T>;
  formField: ControllerRenderProps<T, Path<T>>;
  values: Partial<T>;
  form: UseFormReturn<T>;
}

function FieldInputSwitchInner<T extends FieldValues>({
  field,
  formField,
  values,
  form,
}: FieldInputSwitchProps<T>) {
  // Handle array type early (should be handled by ArrayFieldRenderer)
  if (field.type === "array") {
    return null;
  }

  const placeholder = resolvePlaceholder(field.placeholder, values);
  const Icon = field.icon;
  const baseClass = cn("text-sm", field.className);

  const withIcon = (input: React.ReactNode) =>
    Icon ? (
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        {input}
      </div>
    ) : (
      input
    );

  if (field.type === "file") {
    const fileField = field as FileFieldConfig<T>;
    return (
      <FileUploader
        variant={fileField.variant}
        onValueChange={formField.onChange}
        helperText={placeholder}
        disabled={formField.disabled}
        maxSize={fileField.maxSizes}
        key={formField.name + (formField.value ? "loaded" : "empty")}
        accept={fileField.accept}
        value={formField.value}
        className={field.className}
      />
    );
  }

  if (field.type === "select") {
    const selectField = field as SelectFieldConfig<T>;
    return (
      <SelectOption
        {...formField}
        id={formField.name}
        onValueChange={formField.onChange}
        disabled={field.disabled}
        options={selectField.options}
        value={formField.value as string}
        placeholder={placeholder}
        className={baseClass}
      />
    );
  }

  if (field.type === "multi-select") {
    const multiSelectField = field as MultiSelectFieldConfig<T>;
    return (
      <MultiSelect
        id={formField.name}
        name={formField.name}
        onValueChange={formField.onChange}
        onBlur={formField.onBlur}
        disabled={field.disabled}
        options={multiSelectField.options}
        value={(formField.value as string[]) ?? []}
        placeholder={placeholder}
        className={baseClass}
        maxItems={multiSelectField.maxItems}
      />
    );
  }

  if (field.type === "toggle") {
    const toggleField = field as ToggleFieldConfig<T>;
    return (
      <SegmentedControl
        {...formField}
        size="sm"
        id={formField.name}
        onChange={formField.onChange}
        options={toggleField.options}
        value={formField.value as string}
      />
    );
  }

  if (field.type === "dual-option-switch") {
    const dualField = field as DualSwitchFieldConfig<T>;
    return (
      <DualOptionSwitch
        {...formField}
        className={field.className}
        id={formField.name}
        onValueChange={formField.onChange}
        disabled={field.disabled}
        options={dualField.switchOptions}
        value={formField.value}
      />
    );
  }

  if (field.type === "datetime-local") {
    return (
      <DateTimePicker
        {...formField}
        id={formField.name}
        onChange={formField.onChange}
        disabled={field.disabled}
        value={formField.value}
        className={field.className}
      />
    );
  }

  if (field.type === "percentage") {
    return withIcon(
      <InputPercentage
        {...formField}
        id={formField.name}
        onValueChange={formField.onChange}
        disabled={field.disabled}
        value={formField.value as number}
        className={baseClass}
        placeholder={placeholder}
      />,
    );
  }

  if (field.type === "textarea") {
    return withIcon(
      <Textarea
        id={formField.name}
        placeholder={placeholder}
        disabled={field.disabled}
        className={baseClass}
        {...formField}
      />,
    );
  }

  if (field.type === "password") {
    return withIcon(
      <PasswordInput
        id={formField.name}
        placeholder={placeholder}
        disabled={field.disabled}
        className={baseClass}
        {...formField}
      />,
    );
  }

  if (field.type === "custom") {
    const customField = field as CustomFieldConfig<T>;
    return <>{customField.renderCustom({ field: formField, values, form })}</>;
  }

  if (field.type === "date") {
    const rawValue = formField.value;
    const value =
      typeof rawValue === "string" && !isNaN(Date.parse(rawValue))
        ? rawValue
        : "";
    return (
      <DatePicker
        id={formField.name}
        onValueChange={formField.onChange}
        value={value}
        placeholder={placeholder}
        className={cn("w-full", field.className)}
      />
    );
  }

  if (field.type === "currency") {
    return withIcon(
      <InputCurrency
        {...formField}
        id={formField.name}
        placeholder={placeholder}
        disabled={field.disabled}
        value={formField.value as number}
        onValueChange={(val) => formField.onChange(val ?? 0)}
        className={baseClass}
        name={formField.name}
        onBlur={formField.onBlur}
      />,
    );
  }

  if (field.type === "number") {
    return withIcon(
      <Input
        id={formField.name}
        type="number"
        placeholder={placeholder}
        disabled={field.disabled}
        className={baseClass}
        {...formField}
        onChange={(e) =>
          formField.onChange(
            e.target.value === "" ? undefined : Number(e.target.value),
          )
        }
      />,
    );
  }

  return withIcon(
    <Input
      id={formField.name}
      type={field.type ?? "text"}
      placeholder={placeholder}
      disabled={field.disabled}
      className={baseClass}
      {...formField}
      onChange={(e) => {
        const value = field.valueToUpperCase
          ? e.target.value.toUpperCase()
          : e.target.value;
        formField.onChange(value);
      }}
    />,
  );
}

export const FieldInputSwitch = memo(FieldInputSwitchInner) as <
  T extends FieldValues,
>(
  props: FieldInputSwitchProps<T>,
) => React.JSX.Element;
