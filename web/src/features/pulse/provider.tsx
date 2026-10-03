"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyCommand,
  initialState,
  personas,
  profileComplete,
  type Actor,
  type Command,
  type DemoState,
  type Patient,
} from "./model";
import { authClient } from "./auth-client";
import { useRouter } from "next/navigation";

const emptyState = (): DemoState => ({
  patients: [],
  doctors: [],
  slots: [],
  appointments: [],
  reports: [],
  articles: [],
  nextId: 0,
});

type Notice = { kind: "success" | "error"; text: string } | null;
export type Scenario = "ready" | "loading" | "empty" | "error";
type DemoContext = {
  state: DemoState;
  actor: Actor | null;
  notice: Notice;
  scenario: Scenario;
  solid: boolean;
  connected: boolean;
  loading: boolean;
  busy: boolean;
  googleReady: boolean;
  refresh: () => Promise<void>;
  enter: (id: string) => void;
  leave: () => Promise<boolean>;
  reset: () => void;
  run: (command: Command) => Promise<boolean>;
  register: (patient: Omit<Patient, "id">) => boolean;
  notify: (text: string, kind?: "success" | "error") => void;
  clearNotice: () => void;
  setScenario: (value: Scenario) => void;
  setSolid: (value: boolean) => void;
};
const Context = createContext<DemoContext | null>(null);

export function DemoProvider({
  children,
  connected = true,
}: {
  children: ReactNode;
  connected?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState(connected ? emptyState : initialState);
  const store = useRef(state);
  const [actor, setActor] = useState<Actor | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [scenario, setScenario] = useState<Scenario>("ready");
  const [solid, setSolid] = useState(false);
  const [loading, setLoading] = useState(connected);
  const [busy, setBusy] = useState(false);
  const writing = useRef(false),
    revision = useRef(0);
  const [googleReady, setGoogleReady] = useState(false);
  const refresh = useCallback(async () => {
    if (!connected) return;
    const request = ++revision.current;
    try {
      const response = await fetch("/api/workspace", {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json();
      if (request !== revision.current) return;
      if (!response.ok)
        throw new Error(payload.error ?? "The workspace could not be loaded.");
      store.current = payload.state;
      setState(payload.state);
      setActor(payload.actor);
      setGoogleReady(payload.googleReady);
    } catch (error) {
      if (request === revision.current) {
        store.current = emptyState();
        setState(emptyState());
        setActor(null);
        setGoogleReady(false);
        setNotice({
          kind: "error",
          text:
            error instanceof Error
              ? error.message
              : "Connection lost. Try refreshing.",
        });
      }
    } finally {
      if (request === revision.current) setLoading(false);
    }
  }, [connected]);
  useEffect(() => {
    if (!connected) return;
    const tick = () => {
      if (document.visibilityState === "visible" && !writing.current)
        void refresh();
    };
    const initial = setTimeout(tick, 0),
      timer = setInterval(tick, 15000);
    window.addEventListener("focus", tick);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, [connected, refresh]);
  function update(next: DemoState) {
    store.current = next;
    setState(next);
  }
  function enter(id: string) {
    if (connected) {
      router.push("/login");
      return;
    }
    const patient = store.current.patients.find((p) => p.id === id);
    const next =
      personas.find((p) => p.id === id) ??
      (patient
        ? { id: patient.id, name: patient.name, role: "patient" as const }
        : null);
    if (!next) return;
    setActor(next);
    setNotice(null);
    setScenario("ready");
  }
  async function run(command: Command) {
    if (connected) {
      if (writing.current) return false;
      writing.current = true;
      setBusy(true);
      try {
        const response = await fetch("/api/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
          signal: AbortSignal.timeout(15000),
        });
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error ?? "The change could not be saved.");
        await refresh();
        setNotice({ kind: "success", text: payload.message });
        return true;
      } catch (error) {
        setNotice({
          kind: "error",
          text:
            error instanceof Error
              ? error.message
              : "Connection failed. Refresh to check whether the change was saved.",
        });
        return false;
      } finally {
        writing.current = false;
        setBusy(false);
      }
    }
    const result = applyCommand(store.current, actor, command);
    if (result.ok) update(result.state);
    setNotice({ kind: result.ok ? "success" : "error", text: result.message });
    return result.ok;
  }
  function register(data: Omit<Patient, "id">) {
    if (connected) return false;
    const current = store.current;
    const patient = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      id: `patient-${current.nextId}`,
    };
    if (!profileComplete(patient)) {
      setNotice({ kind: "error", text: "Complete your name, email and city." });
      return false;
    }
    if (current.patients.some((p) => p.email.toLowerCase() === patient.email)) {
      setNotice({
        kind: "error",
        text: "That email already exists in this demo. Use another fictional address.",
      });
      return false;
    }
    update({
      ...current,
      patients: [...current.patients, patient],
      nextId: current.nextId + 1,
    });
    setActor({ id: patient.id, role: "patient", name: patient.name });
    setNotice({
      kind: "success",
      text: "Your fictional patient workspace is ready for this session.",
    });
    return true;
  }
  function reset() {
    if (connected) return;
    update(initialState());
    setActor(null);
    setScenario("ready");
    setNotice(null);
  }
  return (
    <Context.Provider
      value={{
        state,
        actor,
        notice,
        scenario,
        solid,
        connected,
        loading,
        busy,
        googleReady,
        refresh,
        enter,
        run,
        register,
        reset,
        leave: async () => {
          if (connected) {
            try {
              const result = await authClient.signOut();
              if (result.error)
                throw new Error("Sign out failed. Please try again.");
            } catch {
              setNotice({
                kind: "error",
                text: "Sign out failed. Please try again.",
              });
              return false;
            }
            revision.current++;
            update(emptyState());
          }
          setActor(null);
          setNotice(null);
          setScenario("ready");
          return true;
        },
        notify: (text, kind = "success") => setNotice({ kind, text }),
        clearNotice: () => setNotice(null),
        setScenario,
        setSolid,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("PULSE screens require DemoProvider.");
  return context;
}
