import React from "react"
import { render } from "react-dom"
import App from "./App"

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import theme from './utils/theme'
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

render(
    <MuiThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </MuiThemeProvider>,
    document.querySelector("#root")
)
