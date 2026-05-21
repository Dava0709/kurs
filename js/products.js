/**
 * =====================================================
 * КЛАССЫ ТОВАРОВ И ПАТТЕРН VISITOR
 * =====================================================
 * 
 * Здесь определены классы товаров спортивного питания.
 * Каждый класс реализует метод accept(visitor), который позволяет
 * посетителю (visitor) выполнить операцию над объектом товара.
 * 
 * Это реализация паттерна VISITOR:
 * - Объекты (Product, Protein, Creatine и т.д.) содержат данные
 * - Операции (экспорт в XML) описаны в отдельном Visitor классе
 * - Таким образом мы разделяем структуру данных от операций над ними
 */

// ===== VISITOR PATTERN START =====

/**
 * Базовый класс Product (Абстрактный класс для всех товаров)
 * 
 * Основная идея паттерна Visitor:
 * - accept(visitor) - метод, через который visitor может "посетить" объект
 * - Visitor сам решает, что делать с данными товара
 */
class Product {
  constructor(id, name, price, description, category, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = image;
  }

  /**
   * Метод accept - ключевой метод в паттерне Visitor
   * 
   * @param {Visitor} visitor - объект, который выполнит операцию
   * 
   * Примечание:
   * Товар НЕ знает, что именно будет делать visitor.
   * Visitor может экспортировать в XML, JSON, PDF и т.д.
   * Товар остается независимым!
   */
  accept(visitor) {
    return visitor.visit(this);
  }

  /**
   * Получить данные товара в виде объекта
   */
  getData() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      category: this.category,
      image: this.image,
      type: this.constructor.name
    };
  }
}

/**
 * Класс Protein (Протеин)
 * 
 * Наследует от Product и добавляет специфические для протеина поля
 */
class Protein extends Product {
  constructor(id, name, price, description, image, proteinType, servingSize) {
    super(id, name, price, description, 'Протеин', image);
    this.proteinType = proteinType; // 'Whey', 'Casein', 'Plant'
    this.servingSize = servingSize; // в граммах
  }

  /**
   * Переопределяем getData для добавления специфических полей
   */
  getData() {
    return {
      ...super.getData(),
      proteinType: this.proteinType,
      servingSize: this.servingSize
    };
  }
}

/**
 * Класс Creatine (Креатин)
 */
class Creatine extends Product {
  constructor(id, name, price, description, image, creatineType, purity) {
    super(id, name, price, description, 'Креатин', image);
    this.creatineType = creatineType; // 'Monohydrate', 'Ethyl Ester'
    this.purity = purity; // процент чистоты
  }

  getData() {
    return {
      ...super.getData(),
      creatineType: this.creatineType,
      purity: this.purity
    };
  }
}

/**
 * Класс BCAA (Аминокислоты с разветвленной цепью)
 */
class BCAA extends Product {
  constructor(id, name, price, description, image, ratio, flavor) {
    super(id, name, price, description, 'BCAA', image);
    this.ratio = ratio; // '2:1:1', '4:1:1', '10:1:1'
    this.flavor = flavor; // вкус
  }

  getData() {
    return {
      ...super.getData(),
      ratio: this.ratio,
      flavor: this.flavor
    };
  }
}

/**
 * Класс Gainer (Гейнер)
 */
class Gainer extends Product {
  constructor(id, name, price, description, image, calories, carbs) {
    super(id, name, price, description, 'Гейнер', image);
    this.calories = calories; // калории на порцию
    this.carbs = carbs; // углеводы в граммах
  }

  getData() {
    return {
      ...super.getData(),
      calories: this.calories,
      carbs: this.carbs
    };
  }
}

/**
 * Класс PreWorkout (Предтренировочный комплекс)
 */
class PreWorkout extends Product {
  constructor(id, name, price, description, image, caffeine, servings) {
    super(id, name, price, description, 'Предтренировочный комплекс', image);
    this.caffeine = caffeine; // мг кофеина
    this.servings = servings; // количество порций
  }

  getData() {
    return {
      ...super.getData(),
      caffeine: this.caffeine,
      servings: this.servings
    };
  }
}

// ===== VISITOR PATTERN END =====

/**
 * Вспомогательная функция для получения всех товаров
 * Цены в тенге (₸) казахской валюты
 */
function getAllProducts() {
  return [
    // ===== VISITOR PATTERN START =====
    // Примеры создания объектов товаров
    // На каждый объект можно вызвать product.accept(visitor)
    // ===== VISITOR PATTERN END =====

    // ПРОТЕИНЫ
    new Protein(
      1,
      'Optimum Nutrition Gold Standard Whey',
      11900,
      'Премиум протеин с быстрым усвоением. 24g белка на порцию. Идеален для роста мышц.',
      'https://source.unsplash.com/featured/400x400/?whey+protein+powder',
      'Whey',
      30
    ),

    new Protein(
      2,
      'MyProtein Impact Whey Protein',
      8500,
      'Отличное соотношение цены и качества. 21g белка. Популярно в Европе.',
      'https://source.unsplash.com/featured/400x400/?protein+supplement+jar',
      'Whey',
      25
    ),

    new Protein(
      3,
      'MuscleLabs Isolate Pro',
      15500,
      'Изолят высокой очистки. 95% чистого белка. Без лактозы.',
      'https://source.unsplash.com/featured/400x400/?protein+isolate+supplement',
      'Whey',
      35
    ),

    new Protein(
      4,
      'Power Fit Whey Protein',
      7200,
      'Бюджетный вариант с хорошим качеством. 20g белка на порцию.',
      'https://source.unsplash.com/featured/400x400/?fitness+protein+powder',
      'Whey',
      28
    ),

    new Protein(
      5,
      'AllNutrition Whey Pro',
      9800,
      'Мицеллярный казеин + сывороточный протеин. Медленное и быстрое усвоение.',
      'https://source.unsplash.com/featured/400x400/?protein+blend+powder',
      'Blend',
      32
    ),

    // КРЕАТИН
    new Creatine(
      6,
      'Creatine Monohydrate 100% Pure',
      4500,
      'Чистый креатин моногидрат. 500 порций. Проверен временем и наукой.',
      'https://source.unsplash.com/featured/400x400/?creatine+monohydrate',
      'Monohydrate',
      99.9
    ),

    new Creatine(
      7,
      'Creatine Ethyl Ester Pro',
      7200,
      'Лучшая абсорбция. Действует быстрее обычного. 400 порций.',
      'https://source.unsplash.com/featured/400x400/?creatine+supplement+bottle',
      'Ethyl Ester',
      98.5
    ),

    new Creatine(
      8,
      'Creatine HCL Enhanced',
      8900,
      'Креатина гидрохлорид. Усиленная формула с витаминами.',
      'https://source.unsplash.com/featured/400x400/?creatine+hcl+supplement',
      'HCL',
      97.0
    ),

    // BCAA
    new BCAA(
      9,
      'BCAA 2:1:1 Amino Power',
      6200,
      'Классическое соотношение аминокислот. Лимон-лайм. 60 порций.',
      'https://source.unsplash.com/featured/400x400/?bcaa+powder',
      '2:1:1',
      'Лимон-лайм'
    ),

    new BCAA(
      10,
      'BCAA 4:1:1 Advanced Formulation',
      8700,
      'Максимальное содержание лейцина. Груша. Для интенсивных тренировок.',
      'https://source.unsplash.com/featured/400x400/?amino+acid+supplement',
      '4:1:1',
      'Груша'
    ),

    new BCAA(
      11,
      'BCAA Energy Electrolyte Complex',
      7800,
      'BCAA с кофеином и электролитами. Малина-малина. Энергия + восстановление.',
      'https://source.unsplash.com/featured/400x400/?energy+drink+supplement',
      '3:1:2',
      'Малина'
    ),

    // ГЕЙНЕРЫ
    new Gainer(
      12,
      'Mass Gainer Professional 5kg',
      18500,
      'Профессиональный гейнер. 1000 калорий на порцию. Для набора массы.',
      'https://source.unsplash.com/featured/400x400/?mass+gainer+powder',
      1000,
      200
    ),

    new Gainer(
      13,
      'Serious Mass Gainer Premium',
      14200,
      'Сбалансированный состав. 750 калорий. 50g белка на порцию.',
      'https://source.unsplash.com/featured/400x400/?gainer+supplement',
      750,
      150
    ),

    new Gainer(
      14,
      'Mega Calorie Gainer Plus',
      12800,
      'Калорийный гейнер с добавками. 850 калорий. Быстрый результат.',
      'https://source.unsplash.com/featured/400x400/?calorie+gainer',
      850,
      120
    ),

    // ПРЕДТРЕНИРОВОЧНЫЕ
    new PreWorkout(
      15,
      'C4 Original Explosive Energy',
      9500,
      'Легендарный предтренировочный комплекс. 150mg кофеина. 60 порций.',
      'https://source.unsplash.com/featured/400x400/?pre-workout+powder',
      150,
      60
    ),

    new PreWorkout(
      16,
      'PWR Pre-Workout Extreme',
      11200,
      'Максимальная энергия. 200mg кофеина. 40 порций. Для опытных.',
      'https://source.unsplash.com/featured/400x400/?extreme+pre-workout',
      200,
      40
    ),

    new PreWorkout(
      17,
      'Dark Matter Pre-Workout',
      10500,
      'Интенсивный комплекс. 180mg кофеина. Экстремальная помпа.',
      'https://source.unsplash.com/featured/400x400/?dark+pre-workout',
      180,
      50
    ),

    // ВИТАМИНЫ И МИНЕРАЛЫ
    new Protein(
      18,
      'Vitamin Complex Sports',
      3800,
      'Комплекс из 25 витаминов и минералов. Для спортсменов.',
      'https://source.unsplash.com/featured/400x400/?vitamin+supplements',
      'Vitamin',
      30
    ),

    new Protein(
      19,
      'Multivitamin Sport Formula',
      4200,
      'Витамины для мышц и иммунитета. 60 капсул.',
      'https://source.unsplash.com/featured/400x400/?multivitamin+capsules',
      'Vitamin',
      60
    ),

    // ЖИРОСЖИГАТЕЛИ
    new PreWorkout(
      20,
      'Fat Burner Thermogenic',
      7500,
      'Активный жиросжигатель. Ускоренный метаболизм. 90 капсул.',
      'https://source.unsplash.com/featured/400x400/?fat+burner+supplement',
      120,
      90
    ),

    new PreWorkout(
      21,
      'Carnitine L-Carnitine Liquid',
      5900,
      'Жидкий карнитин. Сжигание жира. 500ml.',
      'https://source.unsplash.com/featured/400x400/?liquid+supplement+bottle',
      110,
      50
    ),

    // ВОССТАНОВЛЕНИЕ
    new BCAA(
      22,
      'Amino Recovery Complex',
      6800,
      'Полный набор аминокислот. Быстрое восстановление. 250g.',
      'https://source.unsplash.com/featured/400x400/?amino+recovery+supplement',
      '8:1:1',
      'Клубника'
    ),

    new Creatine(
      23,
      'Creatine Monohydrate Micronized',
      5500,
      'Микронизированный креатин. Лучшая растворяемость. 300g.',
      'https://source.unsplash.com/featured/400x400/?micronized+creatine',
      'Monohydrate',
      99.5
    ),

    // БАТОНЧИКИ И ЗАКУСКИ
    new Gainer(
      24,
      'Protein Bar Energy Pack',
      2800,
      'Протеиновые батончики. 30g белка. Упаковка 12шт.',
      'https://source.unsplash.com/featured/400x400/?protein+bar',
      250,
      12
    ),

    new Gainer(
      25,
      'Carbs Loading Bar Pro',
      3200,
      'Углеводные батончики для загрузки углеводов. 50g углеводов.',
      'https://source.unsplash.com/featured/400x400/?energy+bar',
      200,
      10
    ),

    // ИЗОЛЯТЫ
    new Protein(
      26,
      'Whey Protein Isolate 96%',
      16800,
      'Чистый изолят. 96% белка. Практически без углеводов.',
      'https://source.unsplash.com/featured/400x400/?whey+isolate+protein',
      'Isolate',
      40
    ),

    new Protein(
      27,
      'Premium Casein Protein',
      13500,
      'Казеиновый протеин. Медленное усвоение. Идеален перед сном.',
      'https://source.unsplash.com/featured/400x400/?casein+protein+powder',
      'Casein',
      35
    )
  ];
}
