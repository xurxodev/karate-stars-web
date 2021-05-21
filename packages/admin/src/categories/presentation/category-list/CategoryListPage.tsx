import React from "react";
import { di } from "../../../CompositionRoot";
import CategoryListBloc from "./CategoryListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const CategoryListPage: React.FC = () => {
    const bloc = di.get(CategoryListBloc);

    return <ListPage title={"Category List"} bloc={bloc} />;
};

export default CategoryListPage;
