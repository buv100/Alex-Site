"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedLeads, seedProperties } from "@/data/seed";
import type {
  Lead,
  LeadStatus,
  Property,
  PropertyStatus,
  PublicUser,
} from "@/lib/types";
import { isArchivedPublicly, isListedPublicly, toPublicProperty } from "@/lib/property-public";
import { shuffle } from "@/lib/format";
import type { AdminLocale } from "@/lib/i18n/admin";
import { DEMO_ADMIN } from "@/lib/site";

const STORAGE_KEY = "alex-nekasim-demo-v2";

interface PersistedState {
  properties: Property[];
  leads: Lead[];
  users: PublicUser[];
  adminLoggedIn: boolean;
  adminLocale: AdminLocale;
  currentUserId: string | null;
}

interface DemoContextValue {
  ready: boolean;
  serverMode: boolean;
  properties: Property[];
  leads: Lead[];
  adminLoggedIn: boolean;
  adminLocale: AdminLocale;
  setAdminLocale: (l: AdminLocale) => void;
  loginAdmin: (username: string, password: string) => boolean;
  /** Mark admin UI session after successful next-auth */
  markAdminLoggedIn: () => void;
  logoutAdmin: () => void;
  refreshFromServer: () => Promise<void>;
  currentUser: PublicUser | null;
  registerUser: (data: {
    name: string;
    phone: string;
    password: string;
    privacyConsent: boolean;
  }) => { ok: true } | { ok: false; error: string };
  loginUser: (phone: string, password: string) => { ok: true } | { ok: false; error: string };
  logoutUser: () => void;
  toggleFavorite: (propertyId: string) => void;
  getPublicListings: () => ReturnType<typeof toPublicProperty>[];
  getArchiveListings: () => ReturnType<typeof toPublicProperty>[];
  getPropertyById: (id: string) => Property | undefined;
  getPublicPropertyById: (id: string) => ReturnType<typeof toPublicProperty> | undefined;
  saveProperty: (
    property: Property,
  ) =>
    | { ok: true }
    | { ok: false; error: string }
    | Promise<{ ok: true } | { ok: false; error: string }>;
  createPropertyDraft: (partial?: Partial<Property>) => Property;
  createProperty: (partial?: Partial<Property>) => Property;
  setPropertyStatus: (id: string, status: PropertyStatus) => { ok: true } | { ok: false; error: string };
  softDeleteProperty: (id: string) => void;
  restoreProperty: (id: string) => void;
  addLead: (
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status"> & {
      status?: LeadStatus;
    },
  ) => void | Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  resetDemoData: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function emptyProperty(): Property {
  const now = new Date().toISOString();
  return {
    id: uid("p"),
    title: "",
    description: "",
    dealType: "sale",
    propertyType: "apartment",
    status: "draft",
    price: null,
    currency: "ILS",
    rooms: 3,
    sizeSqm: null,
    floor: null,
    totalFloors: null,
    hasElevator: false,
    hasParking: false,
    hasBalcony: false,
    direction: null,
    city: "ירושלים",
    neighborhood: "",
    street: null,
    arnona: null,
    vaadBayit: null,
    areaPopulationNotes: null,
    isOpportunity: false,
    isExclusive: false,
    images: [],
    publishedAt: null,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ownerName: null,
    ownerPhone: null,
    ownerNotes: null,
    minPriceNegotiable: null,
    internalNotes: null,
    exactAddress: null,
  };
}

const defaultState = (): PersistedState => ({
  properties: seedProperties,
  leads: seedLeads,
  users: [],
  adminLoggedIn: false,
  adminLocale: "he",
  currentUserId: null,
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  /** Seed data is available immediately so the UI never blocks on "טוען…" */
  const [ready, setReady] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [serverMode, setServerMode] = useState(false);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  const refreshFromServer = useCallback(async () => {
    try {
      const [pubRes, adminRes, leadsRes] = await Promise.all([
        fetch("/api/properties?scope=public"),
        fetch("/api/properties?scope=admin"),
        fetch("/api/leads"),
      ]);
      const pub = pubRes.ok ? await pubRes.json() : { properties: [] };
      const adm = adminRes.ok ? await adminRes.json() : null;
      const leadsJson = leadsRes.ok ? await leadsRes.json() : { leads: [] };

      setState((prev) => ({
        ...prev,
        properties: adm?.properties?.length
          ? adm.properties
          : pub.properties?.length
            ? pub.properties
            : prev.properties,
        leads: leadsJson.leads?.length ? leadsJson.leads : prev.leads,
      }));
    } catch {
      /* keep local */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const healthRes = await fetch("/api/health");
        const health = healthRes.ok
          ? ((await healthRes.json()) as { mode?: string })
          : null;

        if (!cancelled && health?.mode === "server") {
          setServerMode(true);
          await refreshFromServer();
          setHydrated(true);
          setReady(true);
          return;
        }
      } catch {
        /* demo mode */
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as PersistedState & {
            passwords?: Record<string, string>;
          };
          setState({
            properties: parsed.properties ?? [],
            leads: parsed.leads ?? [],
            users: parsed.users ?? [],
            adminLoggedIn: Boolean(parsed.adminLoggedIn),
            adminLocale: parsed.adminLocale === "ru" ? "ru" : "he",
            currentUserId: parsed.currentUserId ?? null,
          });
          if (parsed.passwords) setPasswords(parsed.passwords);
        }
      } catch {
        /* ignore private mode / blocked storage */
      }
      if (!cancelled) {
        setReady(true);
        setHydrated(true);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [refreshFromServer]);

  useEffect(() => {
    if (!hydrated || serverMode) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, passwords }),
      );
    } catch {
      /* ignore */
    }
  }, [state, passwords, hydrated, serverMode]);

  const persist = useCallback((updater: (prev: PersistedState) => PersistedState) => {
    setState(updater);
  }, []);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const value: DemoContextValue = {
    ready,
    serverMode,
    properties: state.properties,
    leads: state.leads,
    adminLoggedIn: state.adminLoggedIn,
    adminLocale: state.adminLocale,
    setAdminLocale: (l) => persist((p) => ({ ...p, adminLocale: l })),
    refreshFromServer,
    loginAdmin: (username, password) => {
      // Never accept hardcoded demo credentials in production builds
      if (process.env.NODE_ENV === "production") return false;
      const ok =
        username.trim() === DEMO_ADMIN.username &&
        password === DEMO_ADMIN.password;
      if (ok) persist((p) => ({ ...p, adminLoggedIn: true }));
      return ok;
    },
    markAdminLoggedIn: () => persist((p) => ({ ...p, adminLoggedIn: true })),
    logoutAdmin: () => persist((p) => ({ ...p, adminLoggedIn: false })),
    currentUser,
    registerUser: ({ name, phone, password, privacyConsent }) => {
      if (!privacyConsent) return { ok: false, error: "יש לאשר את מדיניות הפרטיות" };
      if (!name.trim() || !phone.trim() || password.length < 4) {
        return { ok: false, error: "מלאו שם, טלפון וסיסמה (לפחות 4 תווים)" };
      }
      if (state.users.some((u) => u.phone === phone.trim())) {
        return { ok: false, error: "מספר הטלפון כבר רשום" };
      }
      const user: PublicUser = {
        id: uid("u"),
        name: name.trim(),
        phone: phone.trim(),
        email: null,
        favorites: [],
        privacyConsentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setPasswords((prev) => ({ ...prev, [user.id]: password }));
      persist((p) => ({
        ...p,
        users: [...p.users, user],
        currentUserId: user.id,
      }));
      return { ok: true };
    },
    loginUser: (phone, password) => {
      const user = state.users.find((u) => u.phone === phone.trim());
      if (!user || passwords[user.id] !== password) {
        return { ok: false, error: "טלפון או סיסמה שגויים" };
      }
      persist((p) => ({ ...p, currentUserId: user.id }));
      return { ok: true };
    },
    logoutUser: () => persist((p) => ({ ...p, currentUserId: null })),
    toggleFavorite: (propertyId) => {
      if (!state.currentUserId) return;
      persist((p) => ({
        ...p,
        users: p.users.map((u) => {
          if (u.id !== p.currentUserId) return u;
          const has = u.favorites.includes(propertyId);
          return {
            ...u,
            favorites: has
              ? u.favorites.filter((id) => id !== propertyId)
              : [...u.favorites, propertyId],
          };
        }),
      }));
    },
    getPublicListings: () =>
      shuffle(state.properties.filter(isListedPublicly).map(toPublicProperty)),
    getArchiveListings: () =>
      state.properties.filter(isArchivedPublicly).map(toPublicProperty),
    getPropertyById: (id) => state.properties.find((p) => p.id === id),
    getPublicPropertyById: (id) => {
      const p = state.properties.find((x) => x.id === id);
      if (!p || p.deletedAt) return undefined;
      if (isListedPublicly(p) || isArchivedPublicly(p)) return toPublicProperty(p);
      return undefined;
    },
    saveProperty: async (property) => {
      const now = new Date().toISOString();
      const next = { ...property, updatedAt: now };
      if (next.status === "published" && next.images.length < 1) {
        return { ok: false, error: "cannot_publish_no_image" };
      }

      if (serverMode) {
        const isMongoId = /^[a-f\d]{24}$/i.test(next.id);
        const res = await fetch(
          isMongoId ? `/api/properties/${next.id}` : "/api/properties",
          {
            method: isMongoId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          },
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { ok: false, error: (err as { error?: string }).error || "save_failed" };
        }
        const data = await res.json();
        const saved = data.property as Property;
        persist((p) => ({
          ...p,
          properties: p.properties.some(
            (x) => x.id === next.id || x.id === saved.id,
          )
            ? p.properties.map((x) =>
                x.id === next.id || x.id === saved.id ? saved : x,
              )
            : [...p.properties, saved],
        }));
        return { ok: true };
      }

      persist((p) => ({
        ...p,
        properties: p.properties.some((x) => x.id === next.id)
          ? p.properties.map((x) => (x.id === next.id ? next : x))
          : [...p.properties, next],
      }));
      return { ok: true };
    },
    createPropertyDraft: (partial) => {
      return { ...emptyProperty(), ...partial, id: uid("p") };
    },
    createProperty: (partial) => {
      const p = { ...emptyProperty(), ...partial, id: uid("p") };
      persist((prev) => ({ ...prev, properties: [...prev.properties, p] }));
      return p;
    },
    setPropertyStatus: (id, status) => {
      const prop = state.properties.find((p) => p.id === id);
      if (!prop) return { ok: false, error: "not_found" };
      if (status === "published" && prop.images.length < 1) {
        return { ok: false, error: "cannot_publish_no_image" };
      }
      const now = new Date().toISOString();
      const updated = {
        ...prop,
        status,
        updatedAt: now,
        publishedAt: status === "published" ? now : prop.publishedAt,
        archivedAt:
          status === "sold" || status === "rented" ? now : prop.archivedAt,
      };
      persist((p) => ({
        ...p,
        properties: p.properties.map((x) => (x.id === id ? updated : x)),
      }));
      if (serverMode) {
        void fetch(`/api/properties/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      }
      return { ok: true };
    },
    softDeleteProperty: (id) => {
      const now = new Date().toISOString();
      persist((p) => ({
        ...p,
        properties: p.properties.map((x) =>
          x.id === id ? { ...x, deletedAt: now, updatedAt: now } : x,
        ),
      }));
      if (serverMode) {
        void fetch(`/api/properties/${id}`, { method: "DELETE" });
      }
    },
    restoreProperty: (id) => {
      persist((p) => ({
        ...p,
        properties: p.properties.map((x) =>
          x.id === id
            ? { ...x, deletedAt: null, updatedAt: new Date().toISOString() }
            : x,
        ),
      }));
    },
    addLead: async (lead) => {
      const now = new Date().toISOString();
      const full: Lead = {
        ...lead,
        id: uid("l"),
        status: lead.status ?? "new",
        createdAt: now,
        updatedAt: now,
      };
      persist((p) => ({ ...p, leads: [full, ...p.leads] }));
      if (serverMode) {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(full),
        });
      }
    },
    updateLeadStatus: (id, status) => {
      persist((p) => ({
        ...p,
        leads: p.leads.map((l) =>
          l.id === id
            ? { ...l, status, updatedAt: new Date().toISOString() }
            : l,
        ),
      }));
      if (serverMode) {
        void fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      }
    },
    resetDemoData: () => {
      setPasswords({});
      setState(defaultState());
      localStorage.removeItem(STORAGE_KEY);
    },
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
