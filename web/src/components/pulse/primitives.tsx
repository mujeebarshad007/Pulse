"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { initials } from "@/features/pulse/model";

export function Logo() {
  return (
    <Link className="p-logo" href="/" aria-label="Pulse home">
      <span>
        <Icon name="cross" size={21} />
      </span>
      Pulse<b>.</b>
    </Link>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="p-page-title">
      <div>
        {eyebrow && <p className="p-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`p-panel ${className}`}>{children}</section>;
}
export function Avatar({
  name,
  color = "blue",
  large = false,
}: {
  name: string;
  color?: string;
  large?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`p-avatar ${color} ${large ? "large" : ""}`}
    >
      {initials(name)}
    </span>
  );
}
export function Status({ children }: { children: string }) {
  return (
    <span className={`p-status status-${children.toLowerCase()}`}>
      {children}
    </span>
  );
}
export function EmptyState({
  icon = "search",
  title,
  children,
  action,
}: {
  icon?: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="p-empty">
      <span className="p-empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      className="p-modal"
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="p-modal-heading">
        <h2>{title}</h2>
        <button
          className="p-icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
      </div>
      {open && children}
    </dialog>
  );
}
export function FormNote({ children }: { children: ReactNode }) {
  return (
    <p className="p-form-note">
      <Icon name="shield" size={16} />
      <span>{children}</span>
    </p>
  );
}
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="p-section-title">
      <h2>{title}</h2>
      {action}
    </div>
  );
}
export function InputError({ children }: { children: ReactNode }) {
  return children ? (
    <p className="p-inline-error" role="alert">
      {children}
    </p>
  ) : null;
}
