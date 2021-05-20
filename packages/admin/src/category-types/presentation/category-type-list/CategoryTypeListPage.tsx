import React from "react";
import { di } from "../../../CompositionRoot";
import CategoryTypeListBloc from "./CategoryTypeListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const CategoryTypeListPage: React.FC = () => {
    const bloc = di.get(CategoryTypeListBloc);

    return <ListPage title={"Category Type List"} bloc={bloc} />;
};

export default CategoryTypeListPage;
