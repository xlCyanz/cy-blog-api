import { Category } from "./entities/category.entity";
import { CategoriesService } from "./categories.service";
import { BadRequestException } from "@nestjs/common";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: "categories" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: "categoryById" })
  findOne(@Args("id", { type: () => String }) categoryId: string) {
    if (!categoryId) throw new BadRequestException();
    return this.categoriesService.findById(categoryId);
  }

  @Query(() => Category, { name: "categoryByName" })
  findByName(@Args("name", { type: () => String }) categoryName: string) {
    if (!categoryName) throw new BadRequestException();
    return this.categoriesService.findByName(categoryName);
  }

  @Mutation(() => Category)
  createCategory(
    @Args("input", { type: () => CreateCategoryInput })
    createCategoryInput: CreateCategoryInput,
  ) {
    console.log(
      "🚀 ~ file: categories.resolver.ts ~ line 34 ~ CategoriesResolver ~ createCategoryInput",
      createCategoryInput,
    );
    return this.categoriesService.create(createCategoryInput);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args("updateCategoryInput") updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  removeCategory(@Args("id", { type: () => String }) categoryId: string) {
    if (!categoryId) throw new BadRequestException();
    return this.categoriesService.remove(categoryId);
  }
}
