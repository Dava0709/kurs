/**
 * =====================================================
 * ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
 * =====================================================
 * 
 * Управление общей логикой приложения, событиями и интеграцией
 */

// Получить все товары при загрузке страницы
const allProducts = getAllProducts();

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('IronPower Store загружен!');
  console.log('Всего товаров:', allProducts.length);

  // Обновить счетчик корзины
  updateCartCounter();

  // Инициализировать страницы
  initializeCurrentPage();
});

/**
 * Инициализировать текущую страницу
 */
function initializeCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (currentPage === 'catalog.html' || currentPage === '') {
    initCatalog();
  } else if (currentPage === 'cart.html') {
    initCart();
  }
}

/**
 * Инициализировать каталог товаров
 */
function initCatalog() {
  const catalogGrid = document.querySelector('.catalog-grid');
  if (!catalogGrid) return;

  catalogGrid.innerHTML = '';

  allProducts.forEach(product => {
    const card = createProductCard(product);
    catalogGrid.appendChild(card);
  });
}

/**
 * Создать карточку товара
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  card.innerHTML = `
    <div class="product-image-wrapper">
      <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}'">
      <div class="product-category">${getProductCategoryLabel(product)}</div>
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <div class="product-price">${product.price} ₸</div>
        <button class="btn-add-to-cart" onclick="addToCartClick(${product.id})">
          <span>В корзину</span>
          <i class="icon">🛒</i>
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Получить пользовательскую метку категории товара
 */
function getProductCategoryLabel(product) {
  const name = product.name.toLowerCase();

  if (name.includes('vitamin') || name.includes('multivitamin')) {
    return 'Витамины';
  }

  if (name.includes('fat burner') || name.includes('carnitine')) {
    return 'Жиросжигатели';
  }

  if (name.includes('recovery')) {
    return 'Восстановление';
  }

  if (name.includes('bar')) {
    return 'Батончики';
  }

  if (name.includes('isolate') || name.includes('casein')) {
    return 'Изоляты';
  }

  return product.category;
}

/**
 * Добавить товар в корзину (обработчик события)
 */
function addToCartClick(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    cartManager.addToCart(product);
    updateCartCounter();

    // Показать уведомление
    showNotification(`${product.name} добавлен в корзину!`);
  }
}

/**
 * Обновить счетчик корзины в header'е
 */
function updateCartCounter() {
  const counter = document.querySelector('.cart-counter');
  if (counter) {
    const count = cartManager.getTotalItems();
    counter.textContent = count;
    counter.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Инициализировать страницу корзины
 */
function initCart() {
  renderCartItems();
  renderOrderSummary();
}

/**
 * Отрендерить товары в корзине
 */
function renderCartItems() {
  const cartItems = cartManager.getCartItems();
  const cartContainer = document.querySelector('.cart-items-container');

  if (!cartContainer) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Ваша корзина пуста 😢</h2>
        <p>Добавьте товары из каталога</p>
        <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
      </div>
    `;
    return;
  }

  const html = cartItems.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100x100'">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-price">${item.price} ₸</p>
      </div>
      <div class="cart-item-quantity">
        <button onclick="changeQuantity(${item.id}, ${item.quantity - 1})">−</button>
        <input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${item.id}, this.value)">
        <button onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-total">
        ${(item.price * item.quantity).toLocaleString('ru-RU')} ₸
      </div>
      <button class="btn-remove" onclick="removeFromCartClick(${item.id})" title="Удалить">✕</button>
    </div>
  `).join('');

  cartContainer.innerHTML = html;
}

/**
 * Отрендерить резюме заказа
 */
function renderOrderSummary() {
  const summary = document.querySelector('.order-summary');
  if (!summary) return;

  const total = cartManager.getTotalPrice();
  const itemsCount = cartManager.getTotalItems();

  summary.innerHTML = `
    <h2>Резюме заказа</h2>
    <div class="summary-row">
      <span>Товаров:</span>
      <strong>${itemsCount} шт.</strong>
    </div>
    <div class="summary-row">
      <span>Стоимость товаров:</span>
      <strong>${total.toLocaleString('ru-RU')} ₸</strong>
    </div>
    <div class="summary-row summary-delivery">
      <span>Доставка:</span>
      <strong class="free">БЕСПЛАТНО</strong>
    </div>
    <div class="summary-total">
      <span>Итого:</span>
      <strong>${total.toLocaleString('ru-RU')} ₸</strong>
    </div>
    <button class="btn btn-primary btn-checkout" onclick="checkout()">Оформить заказ</button>
    <button class="btn btn-secondary" onclick="window.location.href='catalog.html'">Продолжить покупки</button>
  `;
}

/**
 * Изменить количество товара
 */
function changeQuantity(productId, newQuantity) {
  const quantity = parseInt(newQuantity);
  if (quantity > 0) {
    cartManager.updateQuantity(productId, quantity);
    renderCartItems();
    renderOrderSummary();
  }
}

/**
 * Удалить товар из корзины
 */
function removeFromCartClick(productId) {
  cartManager.removeFromCart(productId);
  updateCartCounter();
  renderCartItems();
  renderOrderSummary();
  showNotification('Товар удален из корзины');
}

/**
 * Оформить заказ
 */
function checkout() {
  if (cartManager.isEmpty()) {
    showNotification('Корзина пуста!', 'error');
    return;
  }

  // Перейти на страницу оформления заказа
  window.location.href = 'checkout.html';
}

/**
 * Показать уведомление
 */
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Анимация входа
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Удалить уведомление через 3 секунды
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * ===== VISITOR PATTERN START =====
 * Экспорт товаров в XML
 * ===== VISITOR PATTERN END =====
 */

function exportProductsToXML() {
  // Создаем visitor для экспорта в XML
  const xmlVisitor = new XMLExportVisitor();

  // Применяем visitor ко всем товарам
  const xmlContent = xmlVisitor.exportProducts(allProducts);

  // Показываем XML в модальном окне
  showXMLModal(xmlContent);
}

/**
 * Показать XML в модальном окне
 */
function showXMLModal(xmlContent) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Экспортированные товары (XML)</h2>
        <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="xml-viewer">
          <pre><code>${escapeHtml(xmlContent)}</code></pre>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="downloadXML('${btoa(xmlContent)}')">Скачать XML</button>
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Закрыть</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

/**
 * Скачать XML файл
 */
function downloadXML(encodedContent) {
  const xmlContent = atob(encodedContent);
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'products-export.xml';
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Экранировать HTML символы
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Навигация между страницами
 */
function navigateTo(page) {
  window.location.href = page;
}
