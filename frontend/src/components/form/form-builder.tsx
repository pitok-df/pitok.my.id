"use client";

import {
  useForm,
  useWatch,
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type {
  FormBuilderProps,
  FormFieldConfig,
  WizardStep,
  DialogProps,
} from "./types";
import { COL_SPAN_CLASS, GRID_COLS_CLASS } from "./types";
import { objectToFormData, applyApiErrors, scrollToField } from "./utils";
import { FieldInputSwitch } from "./field-renderer";
import { ArrayFieldRenderer } from "./array-field-renderer";

interface RenderFieldProps<T extends FieldValues> {
  fieldConfig: FormFieldConfig<T>;
  values: Partial<T>;
  form: UseFormReturn<T>;
}

function RenderFieldInner<T extends FieldValues>({
  fieldConfig,
  values,
  form,
}: RenderFieldProps<T>) {
  // Resolve dependsOn
  let finalField = fieldConfig;
  if (fieldConfig.dependsOn) {
    const depValue = values[fieldConfig.dependsOn.field];
    if (fieldConfig.dependsOn.condition(depValue, values)) {
      const thenResult = fieldConfig.dependsOn.then?.(fieldConfig) ?? {};
      finalField = {
        ...fieldConfig,
        ...thenResult,
        type: thenResult.type ?? fieldConfig.type,
      } as FormFieldConfig<T>;
    }
  }

  // Resolve typeResolver
  const resolvedType = finalField.typeResolver?.(values) ?? finalField.type;

  // Get col span class
  const colSpanClass = finalField.colSpan
    ? COL_SPAN_CLASS[finalField.colSpan]
    : undefined;

  // Handle array type - must be a separate component due to Rules of Hooks
  if (finalField.type === "array") {
    return (
      <ArrayFieldRenderer
        field={finalField as never}
        form={form}
        values={values}
        onRenderField={(subField, subValues, subForm) => (
          <RenderFieldInner
            fieldConfig={subField}
            values={subValues}
            form={subForm}
          />
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={finalField.name as Path<T>}
      render={({ field: formField }) => (
        <FormItem
          className={cn(
            "col-span-1",
            colSpanClass,
            finalField.type === "dual-option-switch" &&
              "flex flex-row items-center gap-3",
          )}
        >
          <FormLabel htmlFor={finalField.name}>{finalField.label}</FormLabel>
          {/* {finalField.type !== "dual-option-switch" && (
          )} */}
          <FormControl>
            <FieldInputSwitch
              field={
                { ...finalField, type: resolvedType } as FormFieldConfig<T>
              }
              formField={formField}
              values={values}
              form={form}
            />
          </FormControl>
          {finalField.description && (
            <FormDescription className="text-xs">
              {finalField.description}
            </FormDescription>
          )}
          <FormMessage className="text-sm" />
        </FormItem>
      )}
    />
  );
}

const RenderField = memo(RenderFieldInner) as <T extends FieldValues>(
  props: RenderFieldProps<T>,
) => React.JSX.Element;

interface ErrorSummaryProps {
  errors: Record<string, { message?: string }>;
  onScrollToField: (name: string) => void;
}

const ErrorSummary = memo(function ErrorSummary({
  errors,
  onScrollToField,
}: ErrorSummaryProps) {
  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <p className="font-semibold">Terdapat kesalahan:</p>
      <ul className="mt-1 space-y-1 list-disc pl-5">
        {errorEntries.map(([name, error]) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => onScrollToField(name)}
              className="text-left hover:underline cursor-pointer"
            >
              {error?.message?.toString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

interface WizardHeaderProps {
  title: string;
  description?: string;
}

const WizardHeader = memo(function WizardHeader({
  title,
  description,
}: WizardHeaderProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
});

export function FormBuilder<T extends FieldValues>({
  form: externalForm,
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  loadingText = "Submitting...",
  isLoading = false,
  submitDisabled = false,
  gridCols = 1,
  children,
  header,
  renderFooter,
  onValuesChange,
  hideSubmitButton = false,
  id,
  className,
  errorSummary = false,
  autoSave,
  steps,
  ...rest
}: FormBuilderProps<T>) {
  const isDialog = rest.withDialog === true;
  const dialogProps = isDialog ? (rest as unknown as DialogProps) : null;
  const useFormData = "useFormData" in rest && rest.useFormData === true;

  const [submitting, setSubmitting] = useState(false);
  const wasOpenRef = useRef(false);
  const prevDefaultValuesStrRef = useRef<string>("");
  const [currentStep, setCurrentStep] = useState(0);

  const internalForm = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as ZodType<FieldValues, any, any>),
    defaultValues,
  });

  const form = (externalForm ?? internalForm) as UseFormReturn<T>;

  useEffect(() => {
    if (defaultValues === undefined) return;
    const defaultValuesStr = JSON.stringify(defaultValues);
    const hasChanged = defaultValuesStr !== prevDefaultValuesStrRef.current;

    if (dialogProps) {
      if (dialogProps.isDialogOpen && (!wasOpenRef.current || hasChanged)) {
        form.reset(defaultValues);
      }
      wasOpenRef.current = dialogProps.isDialogOpen;
    } else if (hasChanged) {
      form.reset(defaultValues);
    }

    prevDefaultValuesStrRef.current = defaultValuesStr;
  }, [dialogProps?.isDialogOpen, defaultValues, form]); // eslint-disable-line react-hooks/exhaustive-deps

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onValuesChange?.(watchedValues);
  }, [watchedValues, onValuesChange]);

  const autoSaveOnSaveRef = useRef(autoSave?.onSave);
  autoSaveOnSaveRef.current = autoSave?.onSave;

  useEffect(() => {
    if (!autoSave?.enabled) return;
    const delay = autoSave.delay ?? 1000;
    const timeoutId = setTimeout(() => {
      if (autoSaveOnSaveRef.current) {
        autoSaveOnSaveRef.current(watchedValues);
      } else if (autoSave.storageKey) {
        localStorage.setItem(
          autoSave.storageKey,
          JSON.stringify(watchedValues),
        );
      }
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, autoSave?.enabled, autoSave?.delay, autoSave?.storageKey]);

  useEffect(() => {
    if (!autoSave?.storageKey) return;
    const saved = localStorage.getItem(autoSave.storageKey);
    if (!saved) return;
    try {
      form.reset(JSON.parse(saved));
    } catch {
      // malformed storage data, ignore
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isWizard = !!steps?.length;
  const currentStepFields: Path<T>[] = isWizard
    ? (steps![currentStep].fields as Path<T>[])
    : (fields.map((f) => f.name) as Path<T>[]);

  const goToNextStep = useCallback(async () => {
    const isValid = await form.trigger(currentStepFields);
    if (isValid && currentStep < steps!.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [form, currentStep, currentStepFields, steps]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const canClose = useCallback((): boolean => {
    if (!dialogProps) return true;
    if (dialogProps.preventClose) return false;
    if ((dialogProps.confirmClose ?? true) && form.formState.isDirty) {
      const message =
        dialogProps.confirmCloseMessage ??
        "Perubahan belum disimpan. Tutup form?";
      return typeof window !== "undefined" && window.confirm(message);
    }
    return true;
  }, [dialogProps, form.formState.isDirty]);

  const handleClose = useCallback(() => {
    if (!canClose() || !dialogProps) return;
    dialogProps.onDialogOpenChange(false);
    if (dialogProps.resetFormOnClose ?? true) {
      form.reset(defaultValues);
    }
  }, [canClose, dialogProps, form, defaultValues]);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (open) dialogProps?.onDialogOpenChange(true);
      else handleClose();
    },
    [dialogProps, handleClose],
  );

  const handleFormSubmit = useCallback(
    async (values: T) => {
      form.clearErrors("root");
      setSubmitting(true);
      try {
        const hasFileField = fields.some((f) => f.type === "file");
        if (useFormData || hasFileField) {
          const formData = objectToFormData(values as Record<string, unknown>);
          await (onSubmit as (v: FormData) => void | Promise<void>)(formData);
        } else {
          await (onSubmit as (v: T) => void | Promise<void>)(values);
        }
      } catch (error) {
        const handled = applyApiErrors(error, form);
        if (!handled) {
          form.setError("root", {
            type: "server",
            message: "Terjadi kesalahan pada server",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [fields, form, onSubmit, useFormData],
  );

  const busy = isLoading || submitting;

  const visibleFields = useMemo(() => {
    if (isWizard) {
      const currentStepFieldNames = steps![currentStep].fields;
      return fields.filter((f) =>
        (currentStepFieldNames as string[]).includes(f.name as string),
      );
    }
    return fields;
  }, [isWizard, currentStep, fields, steps]);

  const gridClass = GRID_COLS_CLASS[gridCols] ?? "md:grid-cols-1";

  const submitButton = (
    <Button type="submit" disabled={busy || submitDisabled}>
      {busy ? loadingText : submitText}
    </Button>
  );

  const footer = useMemo(() => {
    if (hideSubmitButton) return null;
    if (renderFooter !== undefined) return renderFooter;

    if (isWizard) {
      return (
        <div className="flex justify-between gap-2">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={busy}
            >
              Kembali
            </Button>
          )}
          {currentStep < steps!.length - 1 ? (
            <Button type="button" onClick={goToNextStep} disabled={busy}>
              Selanjutnya
            </Button>
          ) : (
            submitButton
          )}
        </div>
      );
    }

    if (dialogProps) {
      return (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={busy}
          >
            {dialogProps.cancelText ?? "Batal"}
          </Button>
          {submitButton}
        </DialogFooter>
      );
    }

    return <div className="w-full">{submitButton}</div>;
  }, [
    hideSubmitButton,
    renderFooter,
    isWizard,
    currentStep,
    goToPrevStep,
    goToNextStep,
    busy,
    steps,
    dialogProps,
    handleClose,
    submitButton,
  ]);

  const fieldGrid = useMemo(
    () => (
      <>
        {header}

        {children ?? (
          <>
            {errorSummary && (
              <ErrorSummary
                errors={
                  form.formState.errors as Record<string, { message?: string }>
                }
                onScrollToField={scrollToField}
              />
            )}

            {isWizard && steps && (
              <WizardHeader
                title={steps[currentStep].title}
                description={steps[currentStep].description}
              />
            )}

            <div className={cn("grid grid-cols-1 gap-4", gridClass)}>
              {visibleFields.map((fieldConfig) => {
                if (
                  fieldConfig.condition &&
                  !fieldConfig.condition(watchedValues)
                ) {
                  return null;
                }
                return (
                  <RenderField
                    key={fieldConfig.name}
                    fieldConfig={fieldConfig}
                    values={watchedValues}
                    form={form}
                  />
                );
              })}
            </div>
          </>
        )}
      </>
    ),
    [
      header,
      children,
      errorSummary,
      form.formState.errors,
      isWizard,
      steps,
      currentStep,
      gridClass,
      visibleFields,
      watchedValues,
      form,
    ],
  );

  const formContent = (
    <form
      id={id}
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {form.formState.errors.root && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}
      {fieldGrid}
      {footer}
    </form>
  );

  if (dialogProps) {
    return (
      <Dialog
        open={dialogProps.isDialogOpen}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent
          className={cn(
            "h-dvh min-w-full md:min-w-150 md:h-auto rounded-none md:max-h-[99dvh] overflow-x-auto",
            className,
          )}
        >
          <DialogHeader>
            <DialogTitle>{dialogProps.dialogTitle}</DialogTitle>
            {dialogProps.dialogDescription && (
              <DialogDescription className="leading-relaxed">
                {dialogProps.dialogDescription}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...form}>{formContent}</Form>
        </DialogContent>
      </Dialog>
    );
  }

  return <Form {...form}>{formContent}</Form>;
}
