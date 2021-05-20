import Bloc from "./Bloc";
import {
    IdentifiableObject,
    ListAction,
    ListField,
    ListLoadedState,
    ListPagination,
    ListSorting,
    ListState,
    SortDirection,
} from "../state/ListState";
import { DataError } from "../../domain/Errors";
import { DetailPageConfig } from "../PageRoutes";

export const defaultPagination = { pageSizeOptions: [5, 10, 25], pageSize: 10, page: 0, total: 0 };

const editAction = {
    name: "edit",
    text: "Edit",
    icon: "edit",
    multiple: false,
    primary: true,
    active: true,
};

const deleteAction = {
    name: "delete",
    text: "Delete",
    icon: "delete",
    multiple: true,
    primary: false,
    active: true,
};

abstract class ListBloc<S extends IdentifiableObject> extends Bloc<ListState<S>> {
    items: S[] = [];
    actions: ListAction[] = [editAction, deleteAction];

    abstract confirmDelete(): Promise<void>;

    constructor(private detailPage: DetailPageConfig) {
        super({
            kind: "ListLoadingState",
        });
    }

    public actionClick(): void {
        this.changeState({
            kind: "NavigateTo",
            route: this.detailPage.generateUrl({ action: "new" }),
        });
    }

    public actionItemClick(actionName: string, id: string): void {
        switch (actionName) {
            case editAction.name: {
                this.changeState({
                    kind: "NavigateTo",
                    route: this.detailPage.generateUrl({ id, action: "edit" }),
                });
                break;
            }
            case deleteAction.name: {
                this.delete(id);
                break;
            }
        }
    }

    async delete(id: string) {
        if (this.state.kind === "ListLoadedState") {
            this.changeState({ ...this.state, itemsToDelete: [id] });
        }
    }

    async cancelDelete() {
        if (this.state.kind === "ListLoadedState") {
            this.changeState({ ...this.state, itemsToDelete: undefined });
        }
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
        const prevItems = this.state.kind === "ListLoadedState" ? this.state.items : [];

        super.changeState(state);

        if (state.kind === "ListLoadedState" && prevItems.length !== state.items.length) {
            this.items = state.items;
            this.updateItems(state.pagination, state.search, state.sorting);
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
            searchableFields.some(
                field =>
                    !search ||
                    (item[field.name] as any)
                        .toString()
                        .toLowerCase()
                        .includes(search.toLocaleLowerCase())
            )
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
