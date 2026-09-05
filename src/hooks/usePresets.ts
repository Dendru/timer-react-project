import { useCallback, useEffect, useState } from "react";
import {
  loadPresets,
  savePresets,
  type UserPreset,
} from "../lib/presets";

export function usePresets() {
  const [presets, setPresets] = useState<UserPreset[]>([]);

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const addPreset = useCallback(
    (input: Omit<UserPreset, "id">) => {
      const next: UserPreset = {
        ...input,
        id: crypto.randomUUID(),
        label: input.label.trim(),
      };
      setPresets((prev) => {
        const list = [...prev, next];
        savePresets(list);
        return list;
      });
      return next;
    },
    [],
  );

  const removePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const list = prev.filter((preset) => preset.id !== id);
      savePresets(list);
      return list;
    });
  }, []);

  return { presets, addPreset, removePreset };
}
