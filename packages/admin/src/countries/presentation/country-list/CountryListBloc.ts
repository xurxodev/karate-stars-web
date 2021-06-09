import { ListField } from "../../../common/presentation/state/ListState";
import { CountryData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetCountrysUseCase from "../../domain/GetCountriesUseCase";
import DeleteCountryUseCase from "../../domain/DeleteCountryUseCase";

class CountryListBloc extends ListBloc<CountryData> {
    constructor(
        private getCountrysUseCase: GetCountrysUseCase,
        private deleteCountryUseCase: DeleteCountryUseCase
    ) {
        super(pages.CountryDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteCountryUseCase.execute(this.state.itemsToDelete[0]);

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getCountrysUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            items =>
                this.changeState({
                    kind: "ListLoadedState",
                    items,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: items.length },
                    sorting: { field: "name", order: "asc" },
                    actions: this.actions,
                })
        );
    }
}

export default CountryListBloc;

const fields: ListField<CountryData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "image", text: "Image", type: "smallImage", searchable: false },
    { name: "name", text: "Name", type: "text" },
];
