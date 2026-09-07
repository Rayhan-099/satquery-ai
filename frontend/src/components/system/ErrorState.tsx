"use client";

export default function ErrorState({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      style={{
        padding: "0.625rem 0.75rem",
        background: "var(--color-error-muted)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "0.5rem",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--color-error)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-error)",
            cursor: "pointer",
            fontSize: "0.875rem",
            lineHeight: 1,
            padding: 0,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
