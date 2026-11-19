import { useEffect, useState } from "react";
import { subscribe } from "../storage/storageCore.js";
import { getCart } from "../storage/cartStorage.js";

/** Re-reads `read()` whenever anything in our localStorage namespace changes (also across tabs). */
export function useStored(read) {
  const [value, setValue] = useState(read);
  useEffect(() => subscribe(() => setValue(read())), []); // eslint-disable-line react-hooks/exhaustive-deps
  return value;
}
export const useCart = () => useStored(getCart);
