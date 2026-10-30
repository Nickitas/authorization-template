import { PropsWithChildren } from 'react';
import { TanstackQueryProvider } from './tanstack-query.provider';
import { ThemeProvider } from './theme-provider';

export function Provider({ children }: PropsWithChildren) {
    return (
        <TanstackQueryProvider>
            <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </TanstackQueryProvider>
    );
}