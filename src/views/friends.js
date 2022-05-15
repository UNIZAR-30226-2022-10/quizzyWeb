import { useState, useEffect } from "react"
import { useQuery } from "react-query";
import { useTheme } from "@mui/material";

import {
    Container,
    Tabs, 
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    Icon,
    Button,
    Divider
} from "@mui/material";

import friendService from "../services/friendService";
import Loader from "components/Loader";
import userService from "services/userService";

const tabs = [ "Buscar amigos", "Amigos", "Solicitudes" ];

export default function Friends() {
    const theme = useTheme();

    const listStyle = {
        gap: "1rem"
    };
    
    const listItemStyle = {
        borderRadius: "1rem",
    };

    const [nickSearch, setNickSearch] = useState("");
    const [value, setValue] = useState(0);
    const [search, setSearch] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const { isLoading : friendsLoading, error : friendsError, data : friends } = useQuery('friends', friendService.getFriends)

    const { isLoading : pendingLoading, error : pendingError, data : pending } = useQuery('pending', friendService.getPending)

    const handleChange = (e, v) => {
        e.preventDefault();
        setValue(v);
    };

    const handleNickChange = (e) => {
        e.preventDefault();
        setNickSearch(e.target.value);
    }

    const submitSearch = async (e) => {
        e.preventDefault();
        await userService.searchUsers(nickSearch).then(s => {
            let current = JSON.parse(localStorage.getItem("user"))?.nickname
            let res = s.data.results.filter(s => s.nickname !== current);
            console.log(res)
            setSearch(res);
        })
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                <Box sx={{ p: 3 }}> {children} </Box>
                )}
            </div>
        );
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="friend tabs"
                    variant="fullWidth"
                >
                    {tabs.map((tab, key) => 
                        <Tab 
                            key={key}
                            label={tab}
                        />
                    )}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <form 
                    style={{
                        padding : "1rem 0"
                    }}
                    className="chat-input" 
                    onSubmit={submitSearch}>
                    <TextField
                        autoFocus
                        placeholder="Introduce una palabra de búsqueda"
                        variant="outlined"
                        value={nickSearch}
                        fullWidth
                        onChange={handleNickChange}
                    />
                    <Button
                        variant="contained" 
                        type="submit"
                        startIcon={
                            <Icon baseClassName="fas" className="fa-search" />
                        }>
                        Submit
                    </Button>
                </form>
                <List
                    sx={listStyle}>
                    {search.map((user, key) => 
                        <div key={key}>
                            <ListItem
                                sx={listItemStyle}>
                                <ListItemText
                                    primary={user.nickname}
                                />
                                <Button
                                    onClick={async () => {friendService.addFriend(user.nickname)}}
                                    variant="contained" 
                                    color="secondary"
                                    startIcon={
                                        <Icon baseClassName="fas" className="fa-circle-plus" />
                                    }>
                                    Añadir amigo
                                </Button>
                            </ListItem>
                            <Divider />
                        </div>
                    )}
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                { friendsLoading ? (
                    <Loader />
                ) : (
                    <List
                        sx={listStyle}>
                        {!friendsLoading && friends.friends?.map((friend, key) => 
                            <div key={key}>
                                <ListItem
                                    sx={listItemStyle}>
                                    <ListItemText
                                        primary={friend.nickname_2}
                                    />
                                    <Button
                                        onClick={async () => {friendService.deleteFriend(friend.nickname_2)}}
                                        variant="contained" 
                                        color="error"
                                        startIcon={
                                            <Icon baseClassName="fas" className="fa-trash" />
                                        }>
                                        Eliminar
                                    </Button>
                                </ListItem>
                                <Divider />
                            </div>
                        )}
                    </List>
                )}
            </TabPanel>
            <TabPanel value={value} index={2}>
                { pendingLoading ? (
                    <Loader />
                ) : (
                    <List
                        sx={listStyle}>
                        {!pendingLoading && pending.friends?.map((friend, key) => 
                            <div key={key}>
                                <ListItem
                                    sx={listItemStyle}>
                                    <ListItemText
                                        disableTypography
                                        primary={<Typography variant="b">{friend.nickname_2}</Typography>}
                                    />
                                    <div 
                                        style={{
                                            display: "flex",
                                            gap: "1em"
                                        }}>
                                        <Button
                                            onClick={async () => {friendService.acceptFriend(friend.nickname_2)}}
                                            variant="contained" 
                                            color="success"
                                            endIcon={
                                                <Icon baseClassName="fas" className="fa-plus-circle" />
                                            }>
                                            Añadir
                                        </Button>
                                        <Button
                                            onClick={async () => {friendService.deleteFriend(friend.nickname_2)}}
                                            variant="contained" 
                                            color="error"
                                            endIcon={
                                                <Icon baseClassName="fas" className="fa-trash" />
                                            }>
                                            Eliminar
                                        </Button>
                                    </div>
                                </ListItem>
                                <Divider />
                            </div>
                        )}
                    </List>
                )}
            </TabPanel>
        </Container>
    )
}
