# Система учета мебельного склада

## 1.1 Актуальность

В условиях стремительного развития информационных технологий и цифровизации бизнес-процессов эффективное управление складскими операциями становится важнейшим элементом деятельности любой торговой компании. Особенно это актуально для мебельных компаний и складских комплексов, где объем товарных запасов значительно превышает среднестатистический уровень, а надежность и точность учета товаров напрямую влияет на производительность труда, финансовую устойчивость и конкурентоспособность предприятия.

Современные мебельные компании работают с широким ассортиментом товаров: столы, стулья, шкафы, диваны, кровати, комоды и другая мебель различных типов и категорий. Отсутствие централизованной системы учета может привести к следующим негативным последствиям:

- потеря или недостача товаров на складе;
- несвоевременное пополнение запасов;
- неэффективное использование складских площадей;
- затруднения при проведении инвентаризации и внутреннего контроля;
- ошибки в обработке заказов клиентов;
- потеря информации о поставщиках и их условиях поставки.

Актуальность приложения для учета мебельного склада подчеркивается Федеральным законом от 06.12.2011 № 402-ФЗ "О бухгалтерском учёте", который предписывает обеспечивать ведение учета всех товарно-материальных ценностей, в том числе товарных запасов, а также обеспечивать их сохранность и контроль движения для каждой организации. Кроме того, эффективная система учета позволяет соблюдать требования налогового законодательства и упрощает процедуры отчетности.

В современных условиях рыночной экономики конкурентоспособность мебельных компаний во многом зависит от скорости обработки заказов, точности учета остатков и качества обслуживания клиентов. Автоматизированная система учета позволяет:

- оперативно отслеживать движение товаров;
- контролировать остатки на складе в режиме реального времени;
- анализировать популярность различных видов мебели;
- оптимизировать закупочную деятельность;
- улучшить качество обслуживания клиентов за счет точной информации о наличии товаров.

Таким образом, разработка и внедрение системы учета мебельного склада представляет собой не только техническую, но и управленческую задачу, решение которой способствует оптимизации внутренних бизнес-процессов, соблюдению требований законодательства, повышению общей эффективности функционирования организации и улучшению качества обслуживания клиентов.

## 1.2 Цель
Целью данного проекта является разработка CRUD веб-приложения для учета мебельного склада с современным графическим интерфейсом и полнофункциональным API.

## 1.3 Задачи
1. Определить технологии, программные средства и инструменты, необходимые для реализации проекта;
2. Изучить теоретический материал выбранных технологий;
3. Разработать структуру базы данных для учета мебели, поставщиков, клиентов и заказов;
4. Спроектировать и реализовать современный пользовательский интерфейс приложения;
5. Разработать основную логику работы приложения с полным функционалом CRUD операций;
6. Провести тестирование приложения и устранить возможные ошибки;
7. Подготовить отчет о проекте в рамках учебной практики.

## 1.4 Ожидаемые результаты
1. Определен и обоснован выбор технологий, программных средств и инструментов, используемых при разработке приложения;
2. Изучен теоретический материал по веб-разработке и работе с базами данных;
3. Разработана структура базы данных с таблицами для мебели, поставщиков, клиентов и заказов;
4. Реализован современный адаптивный графический интерфейс с использованием React;
5. Разработана логика работы приложения с полным функционалом управления складом;
6. Проведено тестирование приложения, выявлены и устранены ошибки в его работе;
7. Подготовлен отчет о проекте в рамках учебной практики.

## 1.5 Методы исследования
1. Анализ литературных источников;
2. Сравнительный анализ существующих решений;
3. Моделирование структуры базы данных;
4. Эксперимент и итеративная разработка;
5. Наблюдение и анализ результатов тестирования.

## 1.6 Гипотеза исследования
Если разработать и внедрить веб-приложение для учета мебельного склада с использованием современных веб-технологий (React, Node.js), базы данных SQLite и RESTful API, то это позволит повысить эффективность управления складскими операциями, сократить риски потери товаров и улучшить контроль за движением мебели на складе.

## 1.7 Практическая значимость
Разработанное приложение может быть использовано в мебельных компаниях, складских комплексах и торговых организациях для упрощения процесса учета товаров. Оно позволяет систематизировать данные о мебели, поставщиках, клиентах и заказах. Такое решение способствует более эффективному управлению складскими активами, облегчает проведение инвентаризаций, улучшает контроль за сохранностью товаров и может быть легко адаптировано под нужды конкретной организации.

Проект также имеет учебную ценность, так как демонстрирует практическое применение знаний по современной веб-разработке, программированию на JavaScript, проектированию реляционных баз данных, а также созданию RESTful API.

## 2 Используемые инструменты разработки

Для разработки приложения для учета мебельного склада были использованы следующие инструменты и технологии:

### Frontend технологии:

**React**
- Назначение: JavaScript библиотека для создания пользовательских интерфейсов
- Почему выбран: React позволяет создавать современные интерактивные интерфейсы с компонентным подходом, обеспечивает высокую производительность благодаря виртуальному DOM и имеет большую экосистему

**JavaScript (ES6+)**
- Назначение: основной язык программирования на клиентской стороне
- Почему выбран: JavaScript является стандартом для веб-разработки, позволяет создавать интерактивные элементы пользовательского интерфейса и легко интегрируется с backend частью через API

**HTML5**
- Назначение: создание семантической структуры веб-страниц
- Почему выбран: HTML5 – основа современной веб-разметки с поддержкой новых элементов и API

**CSS3**
- Назначение: стилизация и создание современного дизайна
- Почему выбран: CSS3 позволяет создавать адаптивные интерфейсы с градиентами, анимациями и современными эффектами, улучшая пользовательский опыт

**Axios**
- Назначение: HTTP клиент для выполнения запросов к API
- Почему выбран: Axios предоставляет удобный интерфейс для работы с HTTP запросами, поддерживает промисы и имеет встроенную обработку ошибок

### Backend технологии:

**Node.js**
- Назначение: среда выполнения JavaScript на сервере
- Почему выбран: Node.js позволяет использовать один язык (JavaScript) на клиенте и сервере, обеспечивает высокую производительность для I/O операций

**Express.js**
- Назначение: веб-фреймворк для Node.js
- Почему выбран: Express облегчает создание RESTful API и маршрутов, он простой, гибкий и имеет богатую экосистему middleware

**SQLite**
- Назначение: встраиваемая реляционная СУБД для хранения данных о мебели, поставщиках, клиентах и заказах
- Почему выбран: SQLite не требует отдельного сервера, легко развертывается, поддерживает SQL стандарт и идеально подходит для небольших и средних приложений

**CORS**
- Назначение: middleware для обработки кросс-доменных запросов
- Почему выбран: необходим для взаимодействия между frontend и backend, работающими на разных портах

### Архитектурные решения:

**RESTful API**
- Назначение: организация взаимодействия между frontend и backend частями приложения
- Почему выбран: REST архитектура обеспечивает стандартизированный подход к созданию API, легко масштабируется и понятна для разработчиков

**Компонентная архитектура**
- Назначение: структурирование frontend кода
- Почему выбран: позволяет создавать переиспользуемые компоненты, упрощает поддержку и развитие приложения

Данные инструменты и технологии позволяют разработать современное, масштабируемое приложение для учета мебельного склада, которое обладает всеми необходимыми функциями CRUD операций и современным пользовательским интерфейсом. 