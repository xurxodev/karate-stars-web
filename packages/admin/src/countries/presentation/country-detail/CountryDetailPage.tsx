import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import CountryDetailBloc from "./CountryDetailBloc";

const CountryDetailPage: React.FC = () => {
    const bloc = di.get(CountryDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default CountryDetailPage;
