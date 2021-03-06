import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery, Theme, Box, Typography, Divider } from "@material-ui/core";

import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Topbar from "./Topbar";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: 56,
        height: "100%",
        [theme.breakpoints.up("sm")]: {
            paddingTop: 64,
        },
    },
    shiftContent: {
        paddingLeft: 240,
    },
    content: {
        padding: theme.spacing(4),
        flex: 1,
    },
    divider: {
        marginTop: "16px",
        marginBottom: "16px",
    },
}));

interface MainLayoutProps {
    title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
    const classes = useStyles();
    const theme: Theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
        defaultMatches: true,
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    return (
        <Box
            display="flex"
            flexDirection="column"
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop,
            })}>
            <Topbar onSidebarOpen={handleSidebarOpen} />
            <Sidebar
                onClose={handleSidebarClose}
                open={shouldOpenSidebar}
                variant={isDesktop ? "persistent" : "temporary"}
            />

            <main className={classes.content}>
                <Typography variant="h3" component="h1">
                    {title}
                </Typography>
                <Divider className={classes.divider} />

                {children}
            </main>
            <Footer />
        </Box>
    );
};

export default MainLayout;
