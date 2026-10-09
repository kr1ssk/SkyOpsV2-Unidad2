import { useEffect, useRef, useState } from "react";
import { read } from "../services/storage";

// Inspirado en el ejemplo 01 del docente: estado React sincronizado con persistencia.
export default function useStoredData(key, fallback = []) {
  const initial = useRef(fallback);
  const [value, setValue] = useState(() => read(key, fallback));
  useEffect(() => {
    function refresh() {
      setValue(read(key, initial.current));
    }
    window.addEventListener("skyops:change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("skyops:change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [key]);
  return value;
}
