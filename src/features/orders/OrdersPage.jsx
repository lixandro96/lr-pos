import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Toast from "../../components/ui/Toast";
import { mockProducts } from "../../mocks";

import ProductCard from "./components/ProductCard";
import ProductOptionsSheet from "./components/ProductOptionsSheet";
import OrderCart from "./components/OrderCart";
import BottomSheet from "../../components/ui/BottomSheet";


function createCartItemKey(item) {
  const normalizedNotes = String(item.notes ?? "")
    .trim()
    .toLowerCase();

  return [
    item.productId,
    item.variantId ?? "base",
    normalizedNotes,
  ].join("::");
}
const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function OrdersPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const activeProducts = mockProducts.filter(
    (product) => product.isActive,
  );

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  function handleSelectProduct(product) {
    setSelectedProduct(product);
  }

  function handleCloseProductOptions() {
    setSelectedProduct(null);
  }

  function handleAddProduct(item) {
    const cartItemKey = createCartItemKey(item);

    const existingItem = cartItems.find(
      (cartItem) => cartItem.cartItemKey === cartItemKey,
    );

    const accumulatedQuantity = existingItem
      ? existingItem.quantity + item.quantity
      : item.quantity;

    setCartItems((currentItems) => {
      const itemAlreadyExists = currentItems.some(
        (cartItem) => cartItem.cartItemKey === cartItemKey,
      );

      if (!itemAlreadyExists) {
        return [
          ...currentItems,
          {
            ...item,
            cartItemKey,
          },
        ];
      }

      return currentItems.map((cartItem) => {
        if (cartItem.cartItemKey !== cartItemKey) {
          return cartItem;
        }

        const newQuantity =
          cartItem.quantity + item.quantity;

        return {
          ...cartItem,
          quantity: newQuantity,
          subtotal: cartItem.unitPrice * newQuantity,
        };
      });
    });

    const variantText = item.variantName
      ? ` (${item.variantName})`
      : "";

    setToast({
      isOpen: true,
      title: existingItem
        ? "Cantidad actualizada"
        : "Producto agregado",
      message: `Ahora tienes ${accumulatedQuantity} × ${item.name}${variantText}`,
    });
  }

  function handleIncreaseCartItem(cartItemKey) {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.cartItemKey !== cartItemKey) {
          return item;
        }

        const newQuantity = item.quantity + 1;

        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.unitPrice * newQuantity,
        };
      }),
    );
  }

  function handleDecreaseCartItem(cartItemKey) {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.cartItemKey !== cartItemKey) {
          return item;
        }

        const newQuantity = Math.max(1, item.quantity - 1);

        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.unitPrice * newQuantity,
        };
      }),
    );
  }

  function handleRemoveCartItem(cartItemKey) {
  const remainingItems = cartItems.filter(
    (item) => item.cartItemKey !== cartItemKey,
  );

  setCartItems(remainingItems);

  if (remainingItems.length === 0) {
    setIsCartOpen(false);
  }
}

  function handleCloseToast() {
    setToast((currentToast) => ({
      ...currentToast,
      isOpen: false,
    }));
  }

 return (
  <section
    className={`
      space-y-6 p-4 md:p-6
      ${cartItems.length > 0 ? "pb-32 lg:pb-6" : ""}
    `}
  >
    <PageHeader
      title="Pedidos"
      description="Selecciona los productos para crear un nuevo pedido."
    />

    <div
      className="
        grid gap-6
        lg:grid-cols-[minmax(0,1fr)_22rem]
        xl:grid-cols-[minmax(0,1fr)_24rem]
      "
    >
      {/* Catálogo */}
      <div className="min-w-0">
        <div
          className="
            grid grid-cols-2 gap-3
            sm:grid-cols-3 sm:gap-4
            lg:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {activeProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>
      </div>

      {/* Carrito de escritorio */}
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          {cartItems.length > 0 ? (
            <OrderCart
              items={cartItems}
              totalQuantity={cartQuantity}
              total={cartTotal}
              onIncrease={handleIncreaseCartItem}
              onDecrease={handleDecreaseCartItem}
              onRemove={handleRemoveCartItem}
            />
          ) : (
            <div
              className="
                rounded-2xl border border-dashed
                border-gray-300 bg-white
                px-6 py-12 text-center
              "
            >
              <h2 className="font-semibold text-gray-900">
                Pedido vacío
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Selecciona un producto para comenzar el pedido.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>

    {/* Botón móvil para abrir el carrito */}
    {cartItems.length > 0 && (
      <div
        className="
          fixed inset-x-0 z-40 px-4
          bottom-[calc(4rem+env(safe-area-inset-bottom))]
          lg:hidden
        "
      >
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="
            mx-auto flex min-h-16 w-full max-w-md
            items-center justify-between gap-4
            rounded-2xl bg-[#3B281F]
            px-5 py-3 text-left text-white
            shadow-xl
          "
        >
          <div>
            <p className="text-sm text-white/70">
              {cartQuantity} unidades
            </p>

            <p className="font-semibold">
              Ver pedido
            </p>
          </div>

          <p className="font-bold">
            {currencyFormatter.format(cartTotal)}
          </p>
        </button>
      </div>
    )}

    {/* Carrito móvil */}
    <BottomSheet
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Pedido actual"
    >
      <OrderCart
        items={cartItems}
        totalQuantity={cartQuantity}
        total={cartTotal}
        onIncrease={handleIncreaseCartItem}
        onDecrease={handleDecreaseCartItem}
        onRemove={handleRemoveCartItem}
        embedded
        showHeader={false}
      />
    </BottomSheet>

    {selectedProduct && (
      <ProductOptionsSheet
        key={selectedProduct.id}
        isOpen
        product={selectedProduct}
        onClose={handleCloseProductOptions}
        onAdd={handleAddProduct}
      />
    )}

    <Toast
      isOpen={toast.isOpen}
      type="success"
      title={toast.title}
      message={toast.message}
      onClose={handleCloseToast}
    />
  </section>
);
}

export default OrdersPage;