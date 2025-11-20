import React from "react";
import styles from "./Pagination.module.scss";

interface Props {
  current: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblings?: number;
}

const Pagination: React.FC<Props> = ({
  current,
  totalPages,
  onChange,
  siblings = 1,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const left = Math.max(1, current - siblings);
  const right = Math.min(totalPages, current + siblings);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("...");
  }

  for (let p = left; p <= right; p++) pages.push(p);

  if (right < totalPages) {
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div
      className={styles.pagination}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        className={styles.control}
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className={styles.dots}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.page} ${p === current ? styles.active : ""}`}
            onClick={() => onChange(p as number)}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={styles.control}
        onClick={() => onChange(Math.min(totalPages, current + 1))}
        disabled={current === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
