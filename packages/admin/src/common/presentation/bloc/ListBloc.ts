import Bloc from "./Bloc";
import {
    IdentifiableObject,
    ListField,
    ListLoadedState,
    ListPagination,
    ListSorting,
    ListState,
    SortDirection,
} from "../state/ListState";
import { DataError } from "../../domain/Errors";

export const defaultPagination = { pageSizeOptions: [5, 10, 25], pageSize: 10, page: 0, total: 0 };

abstract class ListBloc<S extends IdentifiableObject> extends Bloc<ListState<S>> {
    items: S[] = [];

    constructor() {
        super({
            kind: "ListLoadingState",
        });
    }

    search(search: string) {
        const currentstate = this.state as ListLoadedState<S>;

        const pagination = { ...currentstate.pagination, page: 0 };
        this.updateItems(pagination, search, currentstate.sorting);
    }

    paginationChange(page: number, pageSize: number) {
        const currentstate = this.state as ListLoadedState<S>;

        const pagination = { ...currentstate.pagination, page, pageSize };
        this.updateItems(pagination, currentstate.search, currentstate.sorting);
    }

    sortingChange(field: keyof S, order: SortDirection) {
        const currentstate = this.state as ListLoadedState<S>;

        const sorting = { field, order };
        this.updateItems(currentstate.pagination, currentstate.search, sorting);
    }

    selectChange(id: string) {
        if (this.state.kind === "ListLoadedState") {
            const exists = this.state.selectedItems.includes(id);

            const selectedItems = exists
                ? this.state.selectedItems.filter(selectedId => selectedId !== id)
                : [...this.state.selectedItems, id];

            this.changeState({ ...this.state, selectedItems: selectedItems });
        }
    }

    selectAllChange(value: boolean) {
        if (this.state.kind === "ListLoadedState") {
            const selectedItems = value ? [...this.state.items.map(item => item.id)] : [];

            this.changeState({ ...this.state, selectedItems });
        }
    }

    protected changeState(state: ListState<S>) {
        super.changeState(state);

        this.items.splice(0, this.items.length);

        if (state.kind === "ListLoadedState") {
            this.items.push(...state.items);
        }
    }

    protected handleError(error: DataError): ListState<S> {
        switch (error.kind) {
            case "Unauthorized": {
                return {
                    kind: "ListErrorState",
                    message: "Invalid credentials",
                };
            }
            case "ApiError": {
                return {
                    kind: "ListErrorState",
                    message: "Sorry, an error has ocurred in the server. Please try later again",
                };
            }
            case "UnexpectedError": {
                return {
                    kind: "ListErrorState",
                    message: "Sorry, an error has ocurred. Please try later again",
                };
            }
        }
    }

    private updateItems(pagination: ListPagination, search?: string, sorting?: ListSorting<S>) {
        const currentstate = this.state as ListLoadedState<S>;

        const itemsBySearch = this.searchItems(this.items, currentstate.fields, search);

        const sortedItems = this.sortItems(itemsBySearch, sorting);

        const currentItems = this.paginateItems(sortedItems, pagination);

        const state: ListLoadedState<S> = {
            ...currentstate,
            search,
            items: currentItems,
            sorting,
            pagination: { ...pagination, total: sortedItems.length },
        };

        super.changeState(state);
    }

    private sortItems(items: S[], sorting?: ListSorting<S>): S[] {
        const sortedItems = sorting
            ? items.sort((a, b) => {
                  if (a[sorting.field] < b[sorting.field]) return -1;
                  if (a[sorting.field] > b[sorting.field]) return 1;
                  return 0;
              })
            : items;

        return sorting ? (sorting.order === "asc" ? sortedItems : sortedItems.reverse()) : items;
    }

    private searchItems(items: S[], fields: ListField<S>[], search: string | undefined): S[] {
        const searchableFields = fields.filter(
            field => field.searchable === undefined || field.searchable === true
        );

        const itemsBySearch = items.filter(item =>
            searchableFields.some(field => !search || (item[field.name] as any).includes(search))
        );

        return itemsBySearch;
    }

    private paginateItems(items: S[], pagination: ListPagination) {
        const start = pagination ? pagination.page * pagination.pageSize : 0;
        const currentItems = pagination ? items.slice(start, start + pagination.pageSize) : items;
        return currentItems;
    }
}

export default ListBloc;
