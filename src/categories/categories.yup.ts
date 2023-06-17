import * as yup from "yup";

import { MessageCode } from "@interfaces";

import CreateCategoryInput from "./dto/create-category.input";

export default class CategoriesYup {
  validationCategory(category: CreateCategoryInput) {
    const { CATEGORY_NAME_REQUIRED, CATEGORY_DESCRIPTION_REQUIRED } =
      MessageCode;

    const categorySchema = yup.object({
      name: yup.string().required(CATEGORY_NAME_REQUIRED),
      description: yup.string().required(CATEGORY_DESCRIPTION_REQUIRED),
    });

    return categorySchema.validateSync(category);
  }
}
