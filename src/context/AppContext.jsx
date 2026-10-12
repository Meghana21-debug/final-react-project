import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("tripwise-theme", "light");
  const [user, setUser] = useLocalStorage("tripwise-user", {
    name: "Traveller",
    email: "you@example.com",
    currency: "INR",
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}