
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { router } from "@/routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });

    return (
        <ThemeProvider defaultTheme="dark" storageKey="edu-connect-theme">
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                    <Sonner />
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
