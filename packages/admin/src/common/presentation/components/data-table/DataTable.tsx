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
    Theme,
} from "@material-ui/core";
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
    getValue?: (row: T) => JSX.Element;
}

export interface DataTableProps<T> {
    className?: string;
    columns: TableColumn<T>[];
    rows: T[];
    selectedRows: string[];
    search?: string;
    onSearchChange?: (search: string) => void;
    onSelectionChange?: (id: string) => void;
    onSelectionAllChange?: (select: boolean) => void;
    searchEnable?: boolean;
}

export default function DataTable<T extends IdentifiableObject>({
    rows,
    className,
    columns,
    search = "",
    onSearchChange,
    selectedRows,
    onSelectionChange,
    onSelectionAllChange,
    searchEnable,
}: DataTableProps<T>) {
    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(0);

    const [pageRows, setPageRows] = useState<T[]>(rows);

    const [searchVisible] = useState(searchEnable || true);

    React.useEffect(() => {
        const start = page * rowsPerPage;
        const result = rows.slice(start, start + rowsPerPage);

        setPageRows(result);
    }, [search, page, rowsPerPage, columns, rows]);

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
        setPage(page);
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
    };

    const handleSearch = (value: string) => {
        if (onSearchChange) {
            onSearchChange(value);
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
                                        checked={selectedRows.length === pageRows.length}
                                        color="primary"
                                        indeterminate={
                                            selectedRows.length > 0 &&
                                            selectedRows.length < pageRows.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>

                                {columns.map((column, index) => {
                                    return <TableCell key={index}>{column.text}</TableCell>;
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(item => (
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
                    count={rows.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                />
            </Paper>
        </div>
    );
}
