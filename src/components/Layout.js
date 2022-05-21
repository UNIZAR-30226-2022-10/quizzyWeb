/*
 * Author: - Mathis
 * Filename: - Layout.js
 * Module: - Layout
 * Description: - Allows you to set up the organization of the page by adding a menu
 *                on the side and an appbar above the main content.
 */

import * as React from "react"
import { NavLink, Outlet} from "react-router-dom"
import { useQuery } from "react-query";

import { styled, ThemeProvider } from "@mui/material/styles"
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import CssBaseline from "@mui/material/CssBaseline"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"

import { loadCSS } from "fg-loadcss"
import Icon from "@mui/material/Icon"

import theme from '../utils/theme';

import AuthService from "services/auth"
import userService from 'services/userService';

const drawerWidth = 240
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.light.main,
})
const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.light.main,
})
const AppBar =  styled(MuiAppBar,{shouldForwardProp: (prop) => prop !== "open",})
    (({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
}))
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),


    })
)
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    color: theme.palette.light.main,
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const Layout = () => {
    // Fix font awseome icons
    React.useEffect(() => {
        const node = loadCSS(
            "https://use.fontawesome.com/releases/v6.1.1/css/all.css",
            // Inject before JSS
            document.querySelector("#font-awesome-css") || document.head.firstChild
        )

        return () => {
            node.parentNode.removeChild(node)
        }
    }, [])

    // User context
    const [user,setUser] = React.useState(null);
    const {
        isLoading,
        error: errorUser,
        data: userData,
        refetch: refetchUser,
    } = useQuery("user", userService.getUser)
    React.useEffect(() => {
        if (userData) {
            setUser(userData.data)
        }
    }, [userData])
    // Setting Open Gestion
    const [open, setOpen] = React.useState(false)
    // Left drawer Open Gestion
    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    //Select List
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index)
    }

    let menuList = [
        { text: "Inicio", icon: "fa-house", link: "/" },
        { text: "Tienda", icon: "fa-basket-shopping", link: "/shop" },
        { text: "Colección", icon: "fa-shirt", link: "/collecion" },
        { text: "Estadísticas", icon: "fa-chart-pie", link: "/stats" },
        { text: "Amigos", icon: "fa-user-group", link: "/friends" },
        { text: "Propuestas", icon: "fa-file-circle-question", link: "/proposal" },
    ]

    if ( JSON.parse(localStorage.getItem("user")).is_admin ) {
        menuList.push({ text: "Administrador", icon: "fa-screwdriver-wrench", link: "/admin" })
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                {/* TOP BAR */}
                <AppBar
                    position="fixed"
                    open={open}
                    sx={{
                        bgcolor: "primary",
                        color: "accent",
                        boxShadow: 1,
                    }}
                >
                    <Toolbar>
                        {/* Drawer Button */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Avatar */}
                        <Avatar alt="Remy Sharp" src={process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + user?.actual_cosmetic + ".jpg"} />
                        <Box sx={{display:'flex', flexDirection:'column' }}>   
                            {/* Username */}
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ ml: 2, fontWeight: 'bold'}}
                            >
                                Apodo : {user?.nickname || "Usuario"}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ ml: 2}}
                            >
                                Monedero : {user?.wallet || "0"}
                            </Typography>
                        </Box>

                        {/* Spacer */}
                        <Box sx={{ flexGrow: 1 }}></Box>

                        {/* Parameters Button */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Disconnect">
                                <Button 
                                    color="secondary"
                                    variant="contained" 
                                    onClick={() => AuthService.logout()}
                                >
                                    Cerrar Sesión
                                </Button>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>
                {/* SIDE MENU */}
                <Drawer 
                    component="nav" 
                    variant="permanent" 
                    open={open}
                >
                    <DrawerHeader>
                        {/* Avatar */}
                        <Avatar alt="Logo" 
                            src={process.env.PUBLIC_URL + "/images/quizzylogo.png"} 
                        />

                        {/* Username */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ ml: 2 }}
                        >
                            Quizzly
                        </Typography>

                        <IconButton onClick={handleDrawerClose} color="light">
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </DrawerHeader>

                    <Divider sx={{borderColor:"white"}}/>

                    <List>
                        {menuList.map((item, index) => (
                            <NavLink
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                            color: theme.palette.secondary.main,
                                            textDecoration: "none",
                                            fontWeight: "bold"
                                            }
                                        : {
                                            color:'inherit',
                                            textDecoration: "none",
                                            }
                                }
                                to={item.link}
                                key={index}
                            >
                                <ListItemButton
                                    key={item.text}
                                    selected={selectedIndex === index}
                                    onClick={(event) =>
                                        handleListItemClick(event, index)
                                    }
                                    sx={{
                                        color:'inherit',
                                        minHeight: 48,
                                        justifyContent: open
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                        mx: 1,
                                        borderRadius: "12px",
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.main,
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color:'inherit',
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Icon
                                            baseClassName="fas"
                                            className={item.icon}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            color:'inherit',
                                            opacity: open ? 1 : 0,
                                            textDecoration: "none",
                                        }}
                                    >
                                        {item.text}
                                    </ListItemText>
                                </ListItemButton>
                            </NavLink>
                        ))}
                    </List>
                </Drawer>
                {/* CONTENT */}
                <Box 
                    component="main"
                    sx={{ 
                        height: "100vh",
                        flexGrow: 1, 
                    }}
                >
                    <DrawerHeader />
                    <Outlet context={[user, setUser]} />
                </Box>
            </Box>
        </ThemeProvider> 
    )
}

export default Layout
