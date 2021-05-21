import React from "react";
import { di } from "../../../CompositionRoot";
import CountryListBloc from "./CountryListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const CountryListPage: React.FC = () => {
    const bloc = di.get(CountryListBloc);

    return <ListPage title={"Country List"} bloc={bloc} />;
};

export default CountryListPage;
