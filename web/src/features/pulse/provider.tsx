"use client";
import {
  createContext,
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

type Notice = { kind: "success" | "error"; text: string } | null;
export type Scenario = "ready" | "loading" | "empty" | "error";
type DemoContext = {
  state: DemoState;
  actor: Actor | null;
  notice: Notice;
  scenario: Scenario;
  solid: boolean;
  enter: (id: string) => void;
  leave: () => void;
  reset: () => void;
  run: (command: Command) => boolean;
  register: (patient: Omit<Patient, "id">) => boolean;
  notify: (text: string, kind?: "success" | "error") => void;
  clearNotice: () => void;
  setScenario: (value: Scenario) => void;
  setSolid: (value: boolean) => void;
};
const Context = createContext<DemoContext | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const store = useRef(state);
  const [actor, setActor] = useState<Actor | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [scenario, setScenario] = useState<Scenario>("ready");
  const [solid, setSolid] = useState(false);
  function update(next: DemoState) {
    store.current = next;
    setState(next);
  }
  function enter(id: string) {
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
  function run(command: Command) {
    const result = applyCommand(store.current, actor, command);
    if (result.ok) update(result.state);
    setNotice({ kind: result.ok ? "success" : "error", text: result.message });
    return result.ok;
  }
  function register(data: Omit<Patient, "id">) {
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
        enter,
        run,
        register,
        reset,
        leave: () => {
          setActor(null);
          setNotice(null);
          setScenario("ready");
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
