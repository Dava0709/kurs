/**
 * =====================================================
 * ЛОГИКА КОРЗИНЫ ПОКУПОК
 * =====================================================
 * 
 * Управление корзиной товаров, сохранение в localStorage
 */

class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  /**
   * Загрузить корзину из localStorage
   */
  loadCart() {
    const savedCart = localStorage.getItem('ironpowerCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  /**
   * Сохранить корзину в localStorage
   */
  saveCart() {
    localStorage.setItem('ironpowerCart', JSON.stringify(this.cart));
  }

  /**
   * Добавить товар в корзину
   */
  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    this.saveCart();
  }

  /**
   * Удалить товар из корзины
   */
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  /**
   * Изменить количество товара
   */
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  /**
   * Получить общее количество товаров
   */
  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Получить общую стоимость
   */
  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Очистить корзину
   */
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  /**
   * Получить все товары в корзине
   */
  getCartItems() {
    return this.cart;
  }

  /**
   * Проверить, пуста ли корзина
   */
  isEmpty() {
    return this.cart.length === 0;
  }
}

// Создание глобального объекта корзины
const cartManager = new CartManager();
