"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { subscribeToNewsletter, NewsletterState } from "@/app/actions/newsletter";

const initialState: NewsletterState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-1.5 btn-3d-gold font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>جاري الإرسال...</span>
        </>
      ) : (
        <>
          <span>انضم الآن</span>
          <Send className="w-3.5 h-3.5 rotate-180" />
        </>
      )}
    </button>
  );
}

export function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  if (state.success) {
    return (
      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="leading-relaxed">{state.message}</span>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="contact"
            required
            disabled={isPending}
            placeholder="أدخل بريدك الإلكتروني أو رقم الواتساب..."
            className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 shadow-2xs"
          />
        </div>
        <SubmitButton />
      </div>

      {state.error && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1.5 pt-0.5" aria-live="polite">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{state.error}</span>
        </p>
      )}
    </form>
  );
}
