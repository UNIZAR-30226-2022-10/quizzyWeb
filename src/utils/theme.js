import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    typography: {
        fontFamily: `"montserrat", "Helvetica", "Arial", sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
    },
    components: {
        MuiIcon: {
            styleOverrides: {
                root: {
                    // Match 24px = 3 * 2 + 1.125 * 16
                    boxSizing: "content-box",
                    padding: 3,
                    fontSize: "1.125rem",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    "*::-webkit-scrollbar": {
                        backgroundColor: "lightgrey",
                    },
                    "*::-webkit-scrollbar, & *::-webkit-scrollbar-thumb": {
                        width: "26px",
                        borderRadius: "16px",
                        backgroundClip: "padding-box",
                        border: "10px solid transparent",
                        color: "grey",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        boxShadow: "inset 0 0 0 10px",
                    },
                },
            },
        },
    },
    palette: {
        primary: {
            main: '#112D4E',
        },
        secondary: {
            main: '#3F72AF',
        },
        accent: {
            main: '#CADEFC',
        },
        light: {
            main: '#E8F0FC',
        },
      }
})

export default theme;