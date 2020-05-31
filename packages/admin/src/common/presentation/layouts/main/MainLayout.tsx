import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery, Theme, Box } from "@material-ui/core";

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
        padding: theme.spacing(2),
        height: "100%",
    },
}));

const MainLayout: React.FC = ({ children }) => {
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
        <div
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                    flexDirection="column"
                    height="100%">
                    {children}
                    <Footer />
                </Box>
            </main>
        </div>
    );
};

export default MainLayout;
