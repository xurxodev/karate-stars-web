import { Icon } from "@material-ui/core";
import moment from "moment";
import { ReactNode } from "react";
import { TableColumn } from "./DataTable";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function defaultFormatter(value: any): ReactNode {
    if (!value) {
        return null;
    } else if (typeof value === "boolean") {
        return value ? <Icon>done</Icon> : "";
    } else if (isValidDate(value)) {
        return moment(value).format("YYYY-MM-DD");
    } else {
        return value;
    }
    // else if (Array.isArray(value)) {
    //     return (
    //         <ul>
    //             {value.map((item, idx) => (
    //                 <li key={`list-item-${defaultFormatter(item)}-${idx}`}>
    //                     {defaultFormatter(item)}
    //                 </li>
    //             ))}
    //         </ul>
    //     );
    // } else if (value.displayName || value.name || value.id) {
    //     return value.displayName || value.name || value.id;
    // } else if (isValidDate(value)) {
    //     return moment(value).format("YYYY-MM-DD HH:mm:ss");
    // } else {
    //     return <Linkify key={value}>{value}</Linkify>;
    // }
}

export function formatRowValue<T>(
    column: Pick<TableColumn<T>, "name" | "getValue">,
    row: T
): ReactNode {
    const defaultValue = defaultFormatter(row[column.name]);
    return column.getValue ? column.getValue(row) : defaultValue;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function isValidDate(value: any): boolean {
    if (moment.isDate(value) || moment.isMoment(value)) return true;

    const date = moment(value, moment.ISO_8601, true);
    const { format } = date.creationData();

    // Avoid dubious positives by skipping strings that do not contain at least year, month and day
    return format !== "YYYY" && format !== "YYYY-MM" && date.isValid();
}
