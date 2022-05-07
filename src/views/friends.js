import { useState, useEffect } from "react"
import {
    Container,
    Tabs, 
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Typography,
    IconButton,
    Icon,
    Divider
} from "@mui/material"

import friendService from "../services/friendService";
import Loader from "components/Loader";
import theme from "utils/theme";

const tabs = [ "Buscar amigos", "Solicitudes" ];

const listItemStyle = {
    "&:hover": {
        backgroundColor: theme.palette.accent.main,
    }
};

export default function Friends() {

    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [friends, setFriends] = useState({})
    const [pending, setPending] = useState({})

    const loadData = async () => {
        let fetchFriends = await friendService.getFriends()
            .then(res => {
                console.log(res);
                setFriends(res.friends);
            })
            .catch(e => {

            });

        let fetchPending = await friendService.getPending()
            .then(res => {
                console.log(res);
                setPending(res.friends);
            })
            .catch(e => {

            });

        await Promise.all([fetchFriends, fetchPending])
            .catch(e => {

            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(async () => {
        await loadData();
    }, [])

    const handleChange = (e, v) => {
        e.preventDefault();
        setValue(v);
    };

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
            maxWidth="md"
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
            { loading ? (
                <Loader />
            ) : (
                <>
                    <TabPanel value={value} index={0}>
                        <List>
                            {friends.map((friend, key) => 
                                <>
                                    <ListItem>
                                        sx={listItemStyle}
                                        <ListItemText
                                            primary={JSON.stringify(friend)}
                                        />
                                    </ListItem>
                                    <Divider />
                                </>
                            )}
                        </List>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <List>
                            {pending.map((friend, key) => 
                                <>
                                    <ListItem
                                        sx={listItemStyle}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="begin" aria-label="delete">
                                                    <Icon baseClassName="fas" className="fa-check" />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete">
                                                    <Icon baseClassName="fas" className="fa-times" />
                                                </IconButton>
                                            </>
                                        }>
                                        <ListItemText
                                            primary={friend.nickname_2}
                                        />
                                    </ListItem>
                                    <Divider />
                                </>
                            )}
                        </List>
                    </TabPanel>
                </>
            )}
        </Container>
    )
}
