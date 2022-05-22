import React from "react"
import { render } from "react-dom"
import App from "./App"

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import theme from './utils/theme'
import { SocketProvider } from "context/socketContext";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

render(
    // provide socket context to every route
    <SocketProvider>
        <MuiThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </MuiThemeProvider>
    </SocketProvider>,
    document.querySelector("#root")
)
