import React, { useState } from "react";
import {
    Box,
    Checkbox,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import SearchInput from "../search-input/SearchInput";
import { IdentifiableObject } from "../../state/ListState";

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

export interface TableColumn<T> {
    name: keyof T;
    text: string;
    sortable?: boolean;
    getValue?: (row: T) => JSX.Element;
}

export interface TablePagination {
    pageSize: number;
    page: number;
    total: number;
}

export interface TableSorting<T> {
    field: keyof T;
    order: "asc" | "desc";
}

export interface DataTableProps<T> {
    className?: string;
    columns: TableColumn<T>[];
    rows: T[];
    selectedRows: string[];
    paginationOptions: number[];
    pagination: TablePagination;
    sorting?: TableSorting<T>;
    search?: string;
    searchEnable?: boolean;
    onSearchChange?: (search: string) => void;
    onSelectionChange?: (id: string) => void;
    onSelectionAllChange?: (select: boolean) => void;
    onPaginationChange?: (pagination: TablePagination) => void;
    onSortingChange?: (sorting: TableSorting<T>) => void;
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
    onSearchChange,
    onSelectionChange,
    onSelectionAllChange,
    onPaginationChange,
    onSortingChange,
}: DataTableProps<T>) {
    const classes = useStyles();

    const [searchVisible] = useState(searchEnable || true);

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
        if (onPaginationChange) {
            onPaginationChange({ ...pagination, page });
        }
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        if (onPaginationChange) {
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

                                {columns.map((column, index) => {
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(item => (
                                <TableRow
                                    className={classes.tableRow}
                                    hover
                                    key={item.id}
                                    selected={selectedRows.includes(item.id)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(item.id)}
                                            color="primary"
                                            onChange={() => handleSelectOne(item.id)}
                                            value="true"
                                        />
                                    </TableCell>

                                    {columns.map((column, index) => {
                                        const cellContent = !column.getValue
                                            ? item[column.name]
                                            : column.getValue(item);
                                        return (
                                            <TableCell key={`${item.id}-${index}`}>
                                                {cellContent}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={pagination.total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={pagination.page}
                    rowsPerPage={pagination.pageSize}
                    rowsPerPageOptions={paginationOptions}
                />
            </Paper>
        </div>
    );
}
