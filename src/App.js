import * as React from "react"
import { NavLink } from "react-router-dom"

import { styled, ThemeProvider, createTheme } from "@mui/material/styles"
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
import { Route, BrowserRouter, Routes } from "react-router-dom"

import Solo from "./views/solo"
import Menu from "./views/menu"
import Shop from "./views/shop"
import Collecion from "./views/collecion"
import Stats from "./views/stats"
import Friends from "./views/friends"
import Chat from "./components/chat/chat"
import Error404 from "./views/error404"
import Login from "./views/login"
import Register from "./views/register"

import AuthService from "services/auth"
const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
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
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const App = () => {
    const theme = createTheme({
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
    })
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
    // Logout
    const logout = () => {
        AuthService.logout()
    }
    const menuList = [
        { text: "Inicio", icon: "fa-house", link: "/" },
        { text: "Tienda", icon: "fa-basket-shopping", link: "/shop" },
        { text: "Colección", icon: "fa-shirt", link: "/collecion" },
        { text: "Estadísticas", icon: "fa-chart-pie", link: "/stats" },
        { text: "Amigos", icon: "fa-user-group", link: "/friends" },
    ]

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    open={open}
                    sx={{
                        bgcolor: "background.default",
                        color: "text.primary",
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
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />

                        {/* Username */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2 }}
                        >
                            {localStorage.getItem("user")}
                        </Typography>

                        {/* Spacer */}
                        <Box sx={{ flexGrow: 1 }}></Box>

                        {/* Parameters Button */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Disconnect">
                                <Button variant="contained" onClick={logout}>Logout</Button>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>
                <BrowserRouter>
                    <Drawer component="nav" variant="permanent" open={open}>
                        <DrawerHeader>
                            {/* Avatar */}
                            <Avatar alt="Logo" src="/public/images/quizzylogo.png" />

                            {/* Username */}
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ mr: 2 }}
                            >
                                Quizzly
                            </Typography>

                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon />
                                ) : (
                                    <ChevronLeftIcon />
                                )}
                            </IconButton>
                        </DrawerHeader>

                        <Divider />

                        <List>
                            {menuList.map((item, index) => (
                                <NavLink
                                    style={({ isActive }) =>
                                        isActive
                                            ? {
                                                  color: "blue",
                                                  background: "blue",
                                                  textDecoration: "none",
                                              }
                                            : {
                                                  color: "inherit",
                                                  background: "inherit",
                                                  textDecoration: "inherit",
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
                                            minHeight: 48,
                                            justifyContent: open
                                                ? "initial"
                                                : "center",
                                            px: 2.5,
                                            mx: 1,
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
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

                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <DrawerHeader />
                        <Routes>
                            <Route path="/" element={<Menu />} />

                            <Route path="/solo" element={<Solo />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/collecion" element={<Collecion />} />
                            <Route path="/stats" element={<Stats />} />
                            <Route path="/friends" element={<Friends />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route path="*" element={<Error404 />} />
                        </Routes>
                    </Box>
                </BrowserRouter>
            </Box>
        </ThemeProvider>
    )
}

export default App
