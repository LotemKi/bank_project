import { createTheme } from "@mui/material/styles";

import bgImage from "../../assets/background.png";
import logoImage from "../../assets/bank_logo.png";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      backgroundImage: string;
      logoImage: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      backgroundImage?: string;
      logoImage?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#2e3b33ff', // Deep Forest
      dark: '#02140A', // Ultra Dark (Vault)
      light: '#2BAB27', // Bright Emerald
    },
    secondary: {
      light: "#FFDF00",   // Bright Gold (Lock Highlights)
      main: "#D4AF37",    // Metallic Gold (Lock Body)
      dark: "#CFAA3C",    // Burnt Orange-Gold (Lock Shadows)
    },
    text: {
      primary: "#1C1C1C",   // Near Black (Better than pure black for eyes)
      secondary: "#666666", // Medium Grey (For subtext)
      disabled: "#9E9E9E",  // Light Grey
    },
    background: {
      default: "#fdfefeff",
      paper: "#fbfbfbff",
    },
    // Adding the specific deep shield border color for accents
    divider: "#043015",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
      },
    },
  },
  custom: {
    backgroundImage: `url(${bgImage})`,
    logoImage: logoImage,
  },
});


// Element, Main Color (Hex), Light Shade (Highlight), Dark Shade (Shadow)
// L & K Letters, #1A652A (Dollar Green), #2BAB27,  #036704
// Gold Lock, #D4AF37 (Metallic Gold),  #FFDF00,  #AB8000
// Shield Border, #043015 (Deep Green),
// Text (BANK), #1A652A (Same as L & K),