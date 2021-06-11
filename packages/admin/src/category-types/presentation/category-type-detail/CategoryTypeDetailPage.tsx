import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import CategoryTypeDetailBloc from "./CategoryTypeDetailBloc";

const CategoryTypeDetailPage: React.FC = () => {
    const bloc = di.get(CategoryTypeDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default CategoryTypeDetailPage;
