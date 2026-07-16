import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { mockProducts } from "../../../mocks";
import { ProductsContext } from "./products-context";

const PRODUCTS_STORAGE_KEY = "lr-pos-products";

function createProductId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return `product-${crypto.randomUUID()}`;
  }

  return `product-${Date.now()}`;
}

function createVariantId(productId, variantName) {
  const normalizedName = String(variantName ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `${productId}-${normalizedName || Date.now()}`;
}

function normalizeVariants(productId, variants = []) {
  const normalizedVariants = variants.map((variant) => ({
    id:
      variant.id ??
      createVariantId(productId, variant.name),
    name: String(variant.name ?? "").trim(),
    price: Number(variant.price ?? 0),
    isDefault: Boolean(variant.isDefault),
    isActive: variant.isActive ?? true,
  }));

  const defaultVariantIndex =
    normalizedVariants.findIndex(
      (variant) => variant.isDefault,
    );

  return normalizedVariants.map((variant, index) => ({
    ...variant,
    isDefault:
      defaultVariantIndex >= 0
        ? index === defaultVariantIndex
        : index === 0,
  }));
}

function buildCreatedProduct(productData) {
  const productId = createProductId();

  return {
    id: productId,
    name: String(productData.name ?? "").trim(),
    description: String(
      productData.description ?? "",
    ).trim(),
    categoryId: productData.categoryId ?? "",
    basePrice: Number(productData.basePrice ?? 0),
    imageUrl: productData.imageUrl ?? null,
    isActive: productData.isActive ?? true,
    sortOrder:
      productData.sortOrder ?? Date.now(),
    variants: normalizeVariants(
      productId,
      productData.variants ?? [],
    ),
  };
}

function loadProductsFromStorage() {
  if (typeof window === "undefined") {
    return [...mockProducts];
  }

  try {
    const storedProducts =
      window.localStorage.getItem(
        PRODUCTS_STORAGE_KEY,
      );

    if (!storedProducts) {
      return [...mockProducts];
    }

    const parsedProducts = JSON.parse(
      storedProducts,
    );

    if (!Array.isArray(parsedProducts)) {
      return [...mockProducts];
    }

    return parsedProducts;
  } catch (error) {
    console.error(
      "No se pudieron cargar los productos desde localStorage:",
      error,
    );

    return [...mockProducts];
  }
}

function saveProductsToStorage(products) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products),
    );
  } catch (error) {
    console.error(
      "No se pudieron guardar los productos en localStorage:",
      error,
    );
  }
}

function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() =>
    loadProductsFromStorage(),
  );

  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  const createProduct = useCallback((productData) => {
    const createdProduct =
      buildCreatedProduct(productData);

    setProducts((currentProducts) => [
      createdProduct,
      ...currentProducts,
    ]);

    return createdProduct;
  }, []);

  const updateProduct = useCallback(
    (productId, productData) => {
      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          if (product.id !== productId) {
            return product;
          }

          return {
            ...product,
            ...productData,
            id: product.id,
            variants: normalizeVariants(
              product.id,
              productData.variants ??
                product.variants,
            ),
          };
        }),
      );
    },
    [],
  );

  const toggleProductStatus = useCallback(
    (productId) => {
      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          if (product.id !== productId) {
            return product;
          }

          return {
            ...product,
            isActive: !product.isActive,
          };
        }),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      products,
      createProduct,
      updateProduct,
      toggleProductStatus,
    }),
    [
      products,
      createProduct,
      updateProduct,
      toggleProductStatus,
    ],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;