import { fuseDark, skyBlue } from '@fuse/colors';
import { blueGrey } from '@mui/material/colors';
import { FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The lightPaletteText object defines the text color palette for the light theme.
 */
export const lightPaletteText = {
	primary: 'rgb(66, 66, 66)',
	secondary: 'rgb(161, 161, 161)',
	disabled: 'rgb(149, 156, 169)'
};

/**
 * The darkPaletteText object defines the text color palette for the dark theme.
 */
export const darkPaletteText = {
	primary: 'rgb(38, 38, 38)', // Dark gray #262626
	secondary: 'rgb(255, 255, 255)', // White
	disabled: 'rgb(79, 79, 79)' // Light gray #4F4F4F
};

/**
 * The themesConfig object is a configuration object for the color themes of the Fuse application.
 */
export const themesConfig: FuseThemesType = {
	default: {
		palette: {
			mode: 'light',
			divider: '#262626',
			text: lightPaletteText,
			common: {
				black: 'rgb(66, 66, 66)',
				white: 'rgb(255, 255, 255)'
			},
			primary: {
				light: '#70D6CE',
				main: '#43B2AE',
				dark: '#339991',
				contrastText: darkPaletteText.secondary
			},
			secondary: {
				// light: '#EC866A',
				// main: '#F8CA38',
				// dark: '#D33636',
				light: '#70D6CE',
				main: '#43B2AE',
				dark: '#339991',
				contrastText: darkPaletteText.secondary
			},
			background: {
				paper: '#FFFFFF',
				// default: '#E0F2F1'
				default: '#FFF'
			},
			error: {
				// Intense red
				light: '#FF5A5A',
				main: '#D30D0D',
				dark: '#AF0000',
				contrastText: darkPaletteText.secondary
			},
			success: {
				// Intense green
				light: '#85D86A',
				main: '#3ABC15',
				dark: '#359E12',
				contrastText: darkPaletteText.secondary
			},
			info: {
				// Brand Orange
				light: '#FF847B',
				main: '#4f46e5',
				dark: '#E03E32',
				contrastText: darkPaletteText.secondary
			},
			warning: {
				// Soft yellow
				light: '#FFEDC0',
				main: '#F9D97C',
				dark: '#EABA44',
				contrastText: darkPaletteText.primary
			}
		}
	},
	defaultDark: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: lightPaletteText,
			common: {
				black: 'rgb(66, 66, 66)',
				white: 'rgb(255, 255, 255)'
			},
			primary: {
				light: '#70D6CE',
				main: '#43B2AE',
				dark: '#339991',
				contrastText: darkPaletteText.secondary
			},
			secondary: {
				// light: '#EC866A',
				// main: '#F8CA38',
				// dark: '#D33636',
				light: '#70D6CE',
				main: '#43B2AE',
				dark: '#339991',
				contrastText: darkPaletteText.secondary
			},
			background: {
				paper: '#FFFFFF',
				// default: '#E0F2F1'
				default: '#FFF'
			},
			error: {
				// Intense red
				light: '#FF5A5A',
				main: '#D30D0D',
				dark: '#AF0000',
				contrastText: darkPaletteText.secondary
			},
			success: {
				// Intense green
				light: '#85D86A',
				main: '#3ABC15',
				dark: '#359E12',
				contrastText: darkPaletteText.secondary
			},
			info: {
				// Brand Orange
				light: '#FF847B',
				main: '#4f46e5',
				dark: '#E03E32',
				contrastText: darkPaletteText.secondary
			},
			warning: {
				// Soft yellow
				light: '#FFEDC0',
				main: '#F9D97C',
				dark: '#EABA44',
				contrastText: darkPaletteText.primary
			}
		}
	},
	legacy: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			common: {
				black: 'rgb(66, 66, 66)',
				white: 'rgb(255, 255, 255)'
			},
			primary: {
				light: fuseDark[200],
				main: fuseDark[500],
				dark: fuseDark[800],
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: skyBlue[100],
				main: skyBlue[500],
				dark: skyBlue[900],
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#f6f7f9'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light1: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#b3d1d1',
				main: '#006565',
				dark: '#003737',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#ffecc0',
				main: '#FFBE2C',
				dark: '#ff9910',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#F0F7F7'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light2: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#fdf3da',
				main: '#f8d683',
				dark: '#f3bc53',
				contrastText: lightPaletteText.primary
			},
			secondary: {
				light: '#FADCB3',
				main: '#F3B25F',
				dark: '#ec9339',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FAFBFD',
				default: '#FFFFFF'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light3: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#D9C8CE',
				main: '#80485B',
				dark: '#50212F',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#FFE3BF',
				main: '#FFB049',
				dark: '#FF8619',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFF0DF',
				default: '#FAFAFE'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light4: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#CDCCE8',
				main: '#5854B1',
				dark: '#2D2988',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#F8EBF2',
				main: '#E7BDD3',
				dark: '#D798B7',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#F6F7FB'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light5: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#C2C7F1',
				main: '#3543D0',
				dark: '#161EB3',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#B3F1FE',
				main: '#00CFFD',
				dark: '#00B2FC',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#F7FAFF'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light6: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#BBE2DA',
				main: '#1B9E85',
				dark: '#087055',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#FFD0C1',
				main: '#FF6231',
				dark: '#FF3413',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#F2F8F1'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light7: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#BFC4E6',
				main: '#2A3BAB',
				dark: '#0F1980',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#C2ECF0',
				main: '#33C1CD',
				dark: '#149EAE',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#EDF0F6'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light8: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#D2EFF2',
				main: '#68C8D5',
				dark: '#3AA7BA',
				contrastText: lightPaletteText.primary
			},
			secondary: {
				light: '#FFF2C6',
				main: '#FED441',
				dark: '#FDB91C',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FAF6F3',
				default: '#FFFFFF'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light9: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#D3C0CD',
				main: '#6B2C57',
				dark: '#3C102C',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#FDEAC9',
				main: '#F9B84B',
				dark: '#F59123',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#FAFAFE'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light10: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#C6C9CD',
				main: '#404B57',
				dark: '#1C232C',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#FEEDC7',
				main: '#FCC344',
				dark: '#FAA11F',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#F5F4F6'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	light11: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#C4C4C4',
				main: '#3A3A3A',
				dark: '#181818',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#EFEFED',
				main: '#CBCAC3',
				dark: '#ACABA1',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#EFEEE7',
				default: '#FAF8F2'
			},
			error: {
				light: '#F7EAEA',
				main: '#EBCECE',
				dark: '#E3B9B9'
			}
		}
	},
	light12: {
		palette: {
			mode: 'light',
			divider: '#e2e8f0',
			text: lightPaletteText,
			primary: {
				light: '#FFFAF6',
				main: '#FFEDE2',
				dark: '#FFE0CF',
				contrastText: lightPaletteText.primary
			},
			secondary: {
				light: '#DBD8F7',
				main: '#887CE3',
				dark: '#584CD0',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#FFFFFF',
				default: '#FCF8F5'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark1: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#C2C2C3',
				main: '#323338',
				dark: '#131417',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#B8E1D9',
				main: '#129B7F',
				dark: '#056D4F',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#262526',
				default: '#1E1D1E'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark2: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#C9CACE',
				main: '#4B4F5A',
				dark: '#23262E',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#F8F5F2',
				main: '#E6DED5',
				dark: '#D5C8BA',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#31343E',
				default: '#2A2D35'
			},
			error: {
				light: '#F7EAEA',
				main: '#EBCECE',
				dark: '#E3B9B9'
			}
		}
	},
	dark3: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#C2C8D2',
				main: '#354968',
				dark: '#16213A',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#F4CFCA',
				main: '#D55847',
				dark: '#C03325',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#23354E',
				default: '#1B2A3F'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark4: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#CECADF',
				main: '#5A4E93',
				dark: '#2E2564',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#B3EBD6',
				main: '#00BC77',
				dark: '#009747',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#22184B',
				default: '#180F3D'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark5: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#CCD7E2',
				main: '#56789D',
				dark: '#2B486F',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#D7D3ED',
				main: '#796CC4',
				dark: '#493DA2',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#465261',
				default: '#232931'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark6: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#FFC7CE',
				main: '#FF445D',
				dark: '#FF1F30',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#B4E3FB',
				main: '#05A2F3',
				dark: '#0175EA',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#2F3438',
				default: '#25292E'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark7: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: 'FFECC5',
				main: '#FEBE3E',
				dark: '#FD991B',
				contrastText: lightPaletteText.primary
			},
			secondary: {
				light: '#FFC8C7',
				main: '#FE4644',
				dark: '#FD201F',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#2A2E32',
				default: '#212529'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark8: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#BEBFC8',
				main: '#252949',
				dark: '#0D0F21',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#CBD7FE',
				main: '#5079FC',
				dark: '#2749FA',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#2D3159',
				default: '#202441'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark9: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#BCC8CD',
				main: '#204657',
				dark: '#0B202C',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#B3EBC5',
				main: '#00BD3E',
				dark: '#00981B',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#1C1E27',
				default: '#15171E'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark10: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#C3C2D2',
				main: '#36336A',
				dark: '#16143C',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#D6CEFC',
				main: '#765CF5',
				dark: '#4630EE',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#2D2A5D',
				default: '#26244E'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark11: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#BFB7BF',
				main: '#2A0F29',
				dark: '#0F040F',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#D9B9C3',
				main: '#801737',
				dark: '#500716',
				contrastText: darkPaletteText.primary
			},
			background: {
				paper: '#200D1F',
				default: '#2D132C'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	dark12: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: '#CCC3C8',
				main: '#543847',
				dark: '#291720',
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: '#DFB8BD',
				main: '#BE717A',
				dark: '#99424A',
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: '#4D4351',
				default: '#27141F'
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	},
	greyDark: {
		palette: {
			mode: 'dark',
			divider: 'rgba(241,245,249,.12)',
			text: darkPaletteText,
			primary: {
				light: fuseDark[200],
				main: fuseDark[700],
				dark: fuseDark[800],
				contrastText: darkPaletteText.primary
			},
			secondary: {
				light: skyBlue[100],
				main: skyBlue[500],
				dark: skyBlue[900],
				contrastText: lightPaletteText.primary
			},
			background: {
				paper: blueGrey[700],
				default: blueGrey[900]
			},
			error: {
				light: '#ffcdd2',
				main: '#f44336',
				dark: '#b71c1c'
			}
		}
	}
};

export default themesConfig;
