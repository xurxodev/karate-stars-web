import React, { useState } from "react";
import {
    Box,
    Checkbox,
    IconButton,
    makeStyles,
    Paper,
    PopoverPosition,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme,
    Tooltip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import SearchInput from "../search-input/SearchInput";
import ContextualMenu, { MenuItemData } from "../contextual-menu/ContextualMenu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { formatRowValue } from "./utils";

interface IdentifiableObject {
    id: string;
}

export interface TableColumn<T> {
    name: keyof T;
    text: string;
    sortable?: boolean;
    getValue?: (row: T) => JSX.Element;
    hide?: boolean;
}

export interface TablePager {
    pageSize: number;
    page: number;
    total: number;
}

export interface TableSorting<T> {
    field: keyof T;
    order: "asc" | "desc";
}

export interface TableAction<T> {
    name: string;
    text: string;
    icon?: string;
    multiple?: boolean;
    primary?: boolean;
    isActive?(rows: T[]): boolean;
}

export interface DataTableProps<T> {
    className?: string;
    columns: TableColumn<T>[];
    rows: T[];
    selectedRows: string[];
    paginationOptions?: number[];
    pagination?: TablePager;
    sorting?: TableSorting<T>;
    search?: string;
    searchEnable?: boolean;
    actions?: TableAction<T>[];
    onSearchChange?: (search: string) => void;
    onSelectionChange?: (id: string) => void;
    onSelectionAllChange?: (select: boolean) => void;
    onPaginationChange?: (pagination: TablePager) => void;
    onSortingChange?: (sorting: TableSorting<T>) => void;
    onItemActionClick?: (actionName: string, id: string) => void;
    onRowClick?: (id: string) => void;
}

export default function DataTable<T extends IdentifiableObject>({
    rows,
    className,
    columns,
    search = "",
    selectedRows,
    paginationOptions,
    pagination,
    sorting,
    searchEnable,
    actions,
    onSearchChange,
    onSelectionChange,
    onSelectionAllChange,
    onPaginationChange,
    onSortingChange,
    onItemActionClick,
    onRowClick,
}: DataTableProps<T>) {
    const classes = useStyles();

    const [searchVisible] = useState(searchEnable ?? true);
    const [contextualMenuPosition, setContextualMenuPosition] = useState<PopoverPosition>();
    const [menus] = useState<MenuItemData[]>(
        actions
            ? actions.map(action => ({ name: action.name, text: action.text, icon: action.icon }))
            : []
    );

    const [contextualOwnerId, setContextualOwnerId] = useState<string>();

    const handleContextMenu = (event: React.MouseEvent<unknown>, row: T) => {
        event.preventDefault();
        setContextualOwnerId(row.id);
        setContextualMenuPosition({
            left: event.clientX - 2,
            top: event.clientY - 4,
        });
    };

    const handleClick = (event: React.MouseEvent<unknown>, row: T) => {
        const { tagName, type = null } = event.target as HTMLAnchorElement;
        if (!tagName) return;
        const isCheckboxClick = tagName.localeCompare("input") && type === "checkbox";

        if (onRowClick && !isCheckboxClick) onRowClick(row.id);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onSelectionAllChange) {
            onSelectionAllChange(event.target.checked);
        }
    };

    const handleSelectOne = (id: string) => {
        if (onSelectionChange) {
            onSelectionChange(id);
        }
    };

    const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        if (onPaginationChange && pagination) {
            onPaginationChange({ ...pagination, page });
        }
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        if (onPaginationChange && pagination) {
            onPaginationChange({ ...pagination, pageSize: +event.target.value });
        }
    };

    const handleSearch = (value: string) => {
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSortChange = (property: keyof T) => (_event: React.MouseEvent<unknown>) => {
        const isDesc = sorting?.field === property && sorting.order === "desc";
        if (onSortingChange) onSortingChange({ field: property, order: isDesc ? "asc" : "desc" });
    };

    const handleMenuSelected = (menu: string) => {
        if (onItemActionClick && contextualOwnerId) {
            setContextualMenuPosition(undefined);
            onItemActionClick(menu, contextualOwnerId);
        }
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Box
                className={classes.toolbar}
                display="flex"
                justifyContent="space-between"
                flexDirection="row">
                {searchVisible && <SearchInput value={search} onChange={handleSearch} />}
            </Box>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.length === rows.length}
                                        color="primary"
                                        indeterminate={
                                            selectedRows.length > 0 &&
                                            selectedRows.length < rows.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>

                                {columns
                                    .filter(column => !column.hide)
                                    .map((column, index) => {
                                        return (
                                            <TableCell
                                                key={index}
                                                sortDirection={
                                                    column.name === sorting?.field
                                                        ? sorting?.order
                                                        : false
                                                }>
                                                <TableSortLabel
                                                    active={column.name === sorting?.field}
                                                    direction={sorting?.order}
                                                    onClick={handleSortChange(column.name)}
                                                    IconComponent={ExpandMoreIcon}
                                                    disabled={column.sortable === false}>
                                                    {column.text}
                                                </TableSortLabel>
                                            </TableCell>
                                        );
                                    })}

                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(item => (
                                <TableRow
                                    className={classes.tableRow}
                                    hover
                                    key={item.id}
                                    selected={selectedRows.includes(item.id)}
                                    onClick={event => handleClick(event, item)}
                                    onContextMenu={event => handleContextMenu(event, item)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(item.id)}
                                            color="primary"
                                            onChange={() => handleSelectOne(item.id)}
                                            value="true"
                                        />
                                    </TableCell>

                                    {columns
                                        .filter(column => !column.hide)
                                        .map((column, index) => {
                                            const cellContent = formatRowValue(column, item);

                                            return (
                                                <TableCell key={`${item.id}-${index}`}>
                                                    {cellContent}
                                                </TableCell>
                                            );
                                        })}

                                    <TableCell
                                        key={`${item.id}-actions`}
                                        padding="none"
                                        align={"center"}>
                                        <Tooltip title={"Actions"}>
                                            <IconButton
                                                onClick={event => handleContextMenu(event, item)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {pagination && (
                    <TablePagination
                        component="div"
                        count={pagination.total}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        page={pagination.page}
                        rowsPerPage={pagination.pageSize}
                        rowsPerPageOptions={paginationOptions}
                    />
                )}
            </Paper>
            {contextualMenuPosition && (
                <ContextualMenu
                    isOpen={contextualMenuPosition !== undefined}
                    position={contextualMenuPosition}
                    menus={menus}
                    onClose={() => setContextualMenuPosition(undefined)}
                    onMenuSelected={handleMenuSelected}
                />
            )}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    content: {
        padding: theme.spacing(0),
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    nameContainer: {
        display: "flex",
        alignItems: "center",
    },
    tableRow: {},
    actions: {
        justifyContent: "flex-end",
    },
    toolbar: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));
