"use client";

import { siteConfig } from "@/lib/site";
import type { PropertyFilters } from "@/lib/types";

interface Props {
  value: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
}

export function PropertyFiltersBar({ value, onChange }: Props) {
  function set<K extends keyof PropertyFilters>(key: K, v: PropertyFilters[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <form
      className="grid gap-3 rounded border border-border bg-bg-elevated p-4 sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={(e) => e.preventDefault()}
      aria-label="סינון נכסים"
    >
      <div className="field">
        <label htmlFor="dealType">סוג עסקה</label>
        <select
          id="dealType"
          value={value.dealType ?? ""}
          onChange={(e) =>
            set("dealType", e.target.value as PropertyFilters["dealType"])
          }
        >
          <option value="">הכל</option>
          <option value="sale">מכירה</option>
          <option value="rent">שכירות</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="neighborhood">שכונה</label>
        <select
          id="neighborhood"
          value={value.neighborhood ?? ""}
          onChange={(e) => set("neighborhood", e.target.value)}
        >
          <option value="">כל השכונות</option>
          {siteConfig.neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="minRooms">מינימום חדרים</label>
        <select
          id="minRooms"
          value={value.minRooms ?? ""}
          onChange={(e) =>
            set(
              "minRooms",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
        >
          <option value="">הכל</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="maxPrice">מחיר מקסימלי</label>
        <input
          id="maxPrice"
          type="number"
          inputMode="numeric"
          placeholder="ללא הגבלה"
          value={value.maxPrice ?? ""}
          onChange={(e) =>
            set(
              "maxPrice",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
        />
      </div>

      <fieldset className="flex flex-wrap gap-4 sm:col-span-2 lg:col-span-4">
        <legend className="sr-only">תגיות ותכונות</legend>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.opportunity)}
            onChange={(e) => set("opportunity", e.target.checked || undefined)}
          />
          בהזדמנות
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.exclusive)}
            onChange={(e) => set("exclusive", e.target.checked || undefined)}
          />
          בלעדיות
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.hasElevator)}
            onChange={(e) => set("hasElevator", e.target.checked || undefined)}
          />
          מעלית
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.hasParking)}
            onChange={(e) => set("hasParking", e.target.checked || undefined)}
          />
          חניה
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value.hasBalcony)}
            onChange={(e) => set("hasBalcony", e.target.checked || undefined)}
          />
          מרפסת
        </label>
      </fieldset>
    </form>
  );
}

export function applyFilters<
  T extends {
    dealType: string;
    neighborhood: string;
    rooms: number;
    price: number | null;
    isOpportunity: boolean;
    isExclusive: boolean;
    hasElevator: boolean;
    hasParking: boolean;
    hasBalcony: boolean;
  },
>(items: T[], filters: PropertyFilters): T[] {
  return items.filter((p) => {
    if (filters.dealType && p.dealType !== filters.dealType) return false;
    if (filters.neighborhood && p.neighborhood !== filters.neighborhood)
      return false;
    if (filters.minRooms !== undefined && filters.minRooms !== "" && p.rooms < filters.minRooms)
      return false;
    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== "" &&
      (p.price === null || p.price > filters.maxPrice)
    )
      return false;
    if (filters.opportunity && !p.isOpportunity) return false;
    if (filters.exclusive && !p.isExclusive) return false;
    if (filters.hasElevator && !p.hasElevator) return false;
    if (filters.hasParking && !p.hasParking) return false;
    if (filters.hasBalcony && !p.hasBalcony) return false;
    return true;
  });
}
