import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "./components/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
