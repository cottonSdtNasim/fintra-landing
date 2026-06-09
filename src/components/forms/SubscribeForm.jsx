"use client";

import { useForm } from "react-hook-form";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { Button } from "../common/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeForm() {
  const t = useLanguageStore((s) => s.t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = (data) => {
    console.info("Subscribe:", data.email);
    reset();
  };

  if (isSubmitSuccessful) {
    return (
      <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
        {t.form_success}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      noValidate
    >
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="email" className="sr-only">
          {t.form_email_label}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t.form_email_placeholder}
          className="h-11 w-full rounded-md border border-border bg-card px-4 text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          {...register("email", {
            required: t.form_error_required,
            pattern: {
              value: EMAIL_PATTERN,
              message: t.form_error_email,
            },
          })}
        />

        {errors.email && (
          <span className="text-left text-xs text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>
      <Button type="submit" size="lg" className="shrink-0 px-6">
        {t.form_submit}
      </Button>
    </form>
  );
}
