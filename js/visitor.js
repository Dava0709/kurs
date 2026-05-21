/**
 * =====================================================
 * VISITOR PATTERN - XMLExportVisitor
 * =====================================================
 * 
 * Это реализация паттерна проектирования VISITOR.
 * 
 * СУТЬ ПАТТЕРНА:
 * Visitor позволяет определить новую операцию без изменения классов элементов,
 * над которыми эта операция проводится.
 * 
 * В нашем случае:
 * - ЭЛЕМЕНТЫ: классы товаров (Product, Protein, Creatine, BCAA и т.д.)
 * - ОПЕРАЦИЯ: экспорт в XML (определена в XMLExportVisitor)
 * 
 * ПРЕИМУЩЕСТВА:
 * 1. Разделение ответственности - данные отделены от логики обработки
 * 2. Легко добавить новую операцию (например, JSONExportVisitor) без изменения классов товаров
 * 3. Логика экспорта сконцентрирована в одном месте (XMLExportVisitor)
 * 4. Товары остаются чистыми и сосредоточены на хранении данных
 */

// ===== VISITOR PATTERN START =====

/**
 * Базовый класс Visitor (интерфейс)
 * Определяет контракт для всех visitor'ов
 */
class Visitor {
  /**
   * Абстрактный метод, который должен быть реализован в подклассах
   * @param {Product} product - объект товара для обработки
   */
  visit(product) {
    throw new Error('visit() must be implemented by subclass');
  }
}

/**
 * XMLExportVisitor - Visitor для экспорта товаров в XML
 * 
 * РАБОТАЕТ ТАК:
 * 1. Создаем экземпляр XMLExportVisitor
 * 2. Вызываем product.accept(xmlVisitor)
 * 3. Product вызывает visitor.visit(this)
 * 4. XMLExportVisitor.visit() получает доступ к данным товара и формирует XML
 * 
 * ПРИМЕР:
 *   const xmlVisitor = new XMLExportVisitor();
 *   const xmlString = product.accept(xmlVisitor);
 */
class XMLExportVisitor extends Visitor {
  constructor() {
    super();
    // Здесь будут накапливаться XML элементы
    this.xmlElements = [];
  }

  /**
   * Метод visit переопределен для работы с товарами
   * 
   * Это ключевой момент паттерна:
   * - Товар не знает, как себя сериализовать
   * - Visitor знает, как получить данные и преобразовать их в XML
   * 
   * @param {Product} product - объект товара
   * @returns {string} XML представление товара
   */
  visit(product) {
    // Получаем данные товара
    const data = product.getData();

    // Формируем XML элемент для товара
    const xmlElement = this.generateProductXML(data);

    // Сохраняем для последующего использования
    this.xmlElements.push(xmlElement);

    return xmlElement;
  }

  /**
   * Приватный метод для генерации XML для одного товара
   * @private
   */
  generateProductXML(data) {
    const xml = `
  <product>
    <id>${this.escapeXML(data.id)}</id>
    <name>${this.escapeXML(data.name)}</name>
    <price>${this.escapeXML(data.price)}</price>
    <description>${this.escapeXML(data.description)}</description>
    <category>${this.escapeXML(data.category)}</category>
    <type>${this.escapeXML(data.type)}</type>
    ${data.proteinType ? `<proteinType>${this.escapeXML(data.proteinType)}</proteinType>` : ''}
    ${data.servingSize ? `<servingSize>${this.escapeXML(data.servingSize)}</servingSize>` : ''}
    ${data.creatineType ? `<creatineType>${this.escapeXML(data.creatineType)}</creatineType>` : ''}
    ${data.purity ? `<purity>${this.escapeXML(data.purity)}</purity>` : ''}
    ${data.ratio ? `<ratio>${this.escapeXML(data.ratio)}</ratio>` : ''}
    ${data.flavor ? `<flavor>${this.escapeXML(data.flavor)}</flavor>` : ''}
    ${data.calories ? `<calories>${this.escapeXML(data.calories)}</calories>` : ''}
    ${data.carbs ? `<carbs>${this.escapeXML(data.carbs)}</carbs>` : ''}
    ${data.caffeine ? `<caffeine>${this.escapeXML(data.caffeine)}</caffeine>` : ''}
    ${data.servings ? `<servings>${this.escapeXML(data.servings)}</servings>` : ''}
  </product>`;

    return xml;
  }

  /**
   * Экранирование специальных символов XML
   * Нужно для безопасности и корректности XML
   * @private
   */
  escapeXML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Получить полный XML документ со всеми элементами
   * 
   * Используется после того, как все товары были обработаны методом visit()
   * или после экспорта всех товаров через exportAllProducts()
   */
  getFullXML() {
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    const rootOpen = '<catalog>';
    const rootClose = '</catalog>';

    const allProducts = this.xmlElements.join('\n');

    return `${xmlDeclaration}\n<catalog>\n${allProducts}\n${rootClose}`;
  }

  /**
   * Метод для экспорта коллекции товаров в XML
   * 
   * Это показывает, как Visitor обходит несколько элементов:
   * @param {Array<Product>} products - массив товаров
   * @returns {string} Полный XML документ
   */
  exportProducts(products) {
    // Применяем visitor к каждому товару
    products.forEach(product => {
      product.accept(this); // <- Ключевая строка паттерна Visitor!
    });

    // Возвращаем полный XML
    return this.getFullXML();
  }

  /**
   * Метод для экспорта товаров по категориям
   */
  exportProductsByCategory(products) {
    const categories = {};

    // Группируем товары по категориям
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Формируем XML с категориями
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    let categoriesXml = '';

    for (const [category, items] of Object.entries(categories)) {
      categoriesXml += `\n  <category name="${this.escapeXML(category)}">`;

      items.forEach(product => {
        const xml = this.generateProductXML(product.getData());
        categoriesXml += xml;
      });

      categoriesXml += '\n  </category>';
    }

    return `${xmlDeclaration}\n<catalog>${categoriesXml}\n</catalog>`;
  }
}

// ===== VISITOR PATTERN END =====

/**
 * ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР: JSONExportVisitor
 * 
 * Это демонстрирует, как легко добавить новую операцию,
 * не меняя классы товаров!
 */
class JSONExportVisitor extends Visitor {
  constructor() {
    super();
    this.products = [];
  }

  visit(product) {
    this.products.push(product.getData());
    return JSON.stringify(product.getData(), null, 2);
  }

  exportProducts(products) {
    products.forEach(product => {
      product.accept(this);
    });
    return JSON.stringify(this.products, null, 2);
  }
}

/**
 * ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР: CSVExportVisitor
 */
class CSVExportVisitor extends Visitor {
  constructor() {
    super();
    this.rows = [];
  }

  visit(product) {
    const data = product.getData();
    const row = [
      data.id,
      data.name,
      data.price,
      data.description,
      data.category,
      data.type
    ].join(',');
    this.rows.push(row);
    return row;
  }

  exportProducts(products) {
    const header = 'ID,Name,Price,Description,Category,Type';
    this.rows = [header];

    products.forEach(product => {
      product.accept(this);
    });

    return this.rows.join('\n');
  }
}
