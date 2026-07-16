import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { mockCategories } from "../../../mocks";
import { CategoriesContext } from "./categories-context";

const CATEGORIES_STORAGE_KEY = "lr-pos-categories";

function createCategoryId(name) {
  const normalizedName = String(name ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (normalizedName) {
    return `category-${normalizedName}-${Date.now()}`;
  }

  return `category-${Date.now()}`;
}

function getNextSortOrder(categories) {
  const highestSortOrder = categories.reduce(
    (highest, category) =>
      Math.max(highest, Number(category.sortOrder ?? 0)),
    0,
  );

  return highestSortOrder + 1;
}

function buildCreatedCategory(categoryData, categories) {
  return {
    id: createCategoryId(categoryData.name),
    name: String(categoryData.name ?? "").trim(),
    description: String(
      categoryData.description ?? "",
    ).trim(),
    isActive: categoryData.isActive ?? true,
    sortOrder:
      categoryData.sortOrder ??
      getNextSortOrder(categories),
  };
}

function loadCategoriesFromStorage() {
  if (typeof window === "undefined") {
    return [...mockCategories];
  }

  try {
    const storedCategories =
      window.localStorage.getItem(
        CATEGORIES_STORAGE_KEY,
      );

    if (!storedCategories) {
      return [...mockCategories];
    }

    const parsedCategories = JSON.parse(
      storedCategories,
    );

    if (!Array.isArray(parsedCategories)) {
      return [...mockCategories];
    }

    return parsedCategories;
  } catch (error) {
    console.error(
      "No se pudieron cargar las categorías desde localStorage:",
      error,
    );

    return [...mockCategories];
  }
}

function saveCategoriesToStorage(categories) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories),
    );
  } catch (error) {
    console.error(
      "No se pudieron guardar las categorías en localStorage:",
      error,
    );
  }
}

function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() =>
    loadCategoriesFromStorage(),
  );

  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  const createCategory = useCallback((categoryData) => {
    let createdCategory = null;

    setCategories((currentCategories) => {
      createdCategory = buildCreatedCategory(
        categoryData,
        currentCategories,
      );

      return [
        createdCategory,
        ...currentCategories,
      ];
    });

    return createdCategory;
  }, []);

  const updateCategory = useCallback(
    (categoryId, categoryData) => {
      setCategories((currentCategories) =>
        currentCategories.map((category) => {
          if (category.id !== categoryId) {
            return category;
          }

          return {
            ...category,
            name: String(
              categoryData.name ?? category.name,
            ).trim(),
            description: String(
              categoryData.description ??
                category.description ??
                "",
            ).trim(),
            isActive:
              categoryData.isActive ?? category.isActive,
            sortOrder:
              categoryData.sortOrder ??
              category.sortOrder,
          };
        }),
      );
    },
    [],
  );

  const toggleCategoryStatus = useCallback(
    (categoryId) => {
      setCategories((currentCategories) =>
        currentCategories.map((category) => {
          if (category.id !== categoryId) {
            return category;
          }

          return {
            ...category,
            isActive: !category.isActive,
          };
        }),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      categories,
      createCategory,
      updateCategory,
      toggleCategoryStatus,
    }),
    [
      categories,
      createCategory,
      updateCategory,
      toggleCategoryStatus,
    ],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;