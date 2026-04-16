"use client";

import { useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import {
  normalizePotluck,
  POTLUCK_LABELS,
  type PotluckSlot,
  type PotluckState,
  suggestBalancedAssignments,
} from "@/lib/potluck";

type Props = {
  mealId: string;
  potluckRaw: unknown;
  hostId: string;
  guestId: string;
  currentUserId: string;
  revision: string;
  onSaved: () => void;
};

const SLOTS: PotluckSlot[] = ["entree", "plat", "dessert", "boissons", "rien"];

export function MealPotluckPanel({
  mealId,
  potluckRaw,
  hostId,
  guestId,
  currentUserId,
  revision,
  onSaved,
}: Props) {
  const [state, setState] = useState<PotluckState>(() => normalizePotluck(potluckRaw));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setState(normalizePotluck(potluckRaw));
  }, [potluckRaw, revision]);

  const ids = [hostId, guestId].sort();

  function labelFor(id: string) {
    if (id === currentUserId) return "Toi";
    if (id === hostId) return "Hôte";
    return "Invité·e";
  }

  async function save(next: PotluckState) {
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/meals/${mealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ potluck: next }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await readApiError(res)).message);
      return;
    }
    setState(next);
    onSaved();
  }

  function setMySlot(slot: PotluckSlot) {
    const next: PotluckState = {
      ...state,
      mode: "free",
      assignments: { ...state.assignments, [currentUserId]: slot },
    };
    void save(next);
  }

  function applyBalanced(mode: "balanced" | "auto") {
    const next: PotluckState = {
      mode,
      assignments: suggestBalancedAssignments(ids),
    };
    void save(next);
  }

  return (
    <section className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }} aria-labelledby="potluck-h">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          font: "inherit",
          textAlign: "left",
        }}
        aria-expanded={open}
        id="potluck-h"
      >
        <span style={{ fontWeight: 700 }}>Organisation : qui ramène quoi ?</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      <p
        className="ptg-type-body"
        style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}
      >
        Repas groupe : quatre rôles simples, ou « je ne ramène rien ». Pas de listes infinies, moins de friction
        sociale.
      </p>
      {open && (
        <>
          {err && (
            <p className="ptg-banner ptg-banner-warn" style={{ marginTop: "0.75rem" }} role="alert">
              {err}
            </p>
          )}
          <div style={{ marginTop: "0.85rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>Ta contribution</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {SLOTS.map((s) => {
                const active = state.assignments[currentUserId] === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => setMySlot(s)}
                    style={{
                      fontSize: "var(--ptg-text-sm)",
                      padding: "0.4rem 0.65rem",
                      borderRadius: "999px",
                      border: active ? "1px solid var(--ptg-accent)" : "1px solid var(--ptg-line)",
                      background: active ? "rgba(213, 110, 42, 0.12)" : "transparent",
                      cursor: busy ? "wait" : "pointer",
                      fontFamily: "inherit",
                      color: "var(--ptg-text)",
                    }}
                  >
                    {POTLUCK_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>Répartition</p>
            <ul className="ptg-prose-list" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
              {ids.map((id) => (
                <li key={id}>
                  {labelFor(id)} :{" "}
                  {state.assignments[id] ? POTLUCK_LABELS[state.assignments[id]!] : "… pas encore choisi"}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <button type="button" className="ptg-btn-ghost" disabled={busy} onClick={() => applyBalanced("balanced")}>
              Suggestion équilibrée
            </button>
            <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
              Un coup pour remplir les rôles, chacun ajuste ensuite si besoin.
            </span>
          </div>
        </>
      )}
    </section>
  );
}
