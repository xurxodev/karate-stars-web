import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import CategoryDetailBloc from "./CategoryDetailBloc";

const CategoryDetailPage: React.FC = () => {
    const bloc = di.get(CategoryDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default CategoryDetailPage;
