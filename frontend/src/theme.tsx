import {createTheme} from "@mui/material";

export const THEME = createTheme({
    palette: {
        mode: "dark"
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                html, body, #root {
                  height: 100%
                }
            `,
        },
    },
});
