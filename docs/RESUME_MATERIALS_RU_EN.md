# Message Hub — материалы для резюме

Ниже находятся готовые формулировки, которые можно копировать в резюме, LinkedIn, GitHub и описание portfolio.

## Русский

### Название проекта

**Message Hub — frontend-демо корпоративного мессенджера**

### Очень короткое описание

Автономное frontend-демо корпоративного чата на Nuxt 3, Vue 3, TypeScript и Pinia с переключением пользователей, каналами, direct/group conversations, mock API и сохранением в `localStorage`.

### Описание для блока «Проекты»

Разработал и подготовил к portfolio-публикации frontend корпоративного мессенджера. Спроектировал нормализованную модель пользователей, разговоров и сообщений, разделил состояние на пять Pinia stores и реализовал асинхронный mock API с versioned persistence в `localStorage`. Добавил 10 переключаемых пользователей, персональные unread-счётчики, CRUD сообщений с confirmation, управление участниками групп, единый поиск, локальные attachments и mock-бота. Довёл ключевые сценарии до demo-ready UX: skeleton, sending/typing states, toast-уведомления, автоскролл и last-message previews.

### Рекомендуемые bullet points

-   Спроектировал нормализованную модель `User`, `Conversation` и `Message` и организовал единый поток данных через пять специализированных Pinia stores.
-   Реализовал frontend-only mock API с задержкой 200–500 мс, debounce-сохранением, versioned snapshot в `localStorage`, Reset, error simulation и Retry.
-   Добавил 10 переключаемых demo-пользователей; membership, unread, message ownership, edit permissions и incoming/outgoing layout пересчитываются для активной сессии.
-   Реализовал каналы, direct- и group-чаты, CRUD сообщений с confirmation, add/remove reactions, локальные attachments, управление участниками и virtual scrolling.
-   Добавил demo-ready UX: skeleton и empty states, sending/typing indicators, toast-уведомления, автоскролл виртуализированной истории, unread reset и sidebar previews.
-   Добавил единый поиск по пользователям, ролям, каналам, разговорам и сообщениям с переходом и подсветкой найденной записи.
-   Заменил небезопасный прямой AI-запрос локальным детерминированным mock-ботом с искусственной задержкой и typing indicator.
-   Очистил legacy-код, удалил неиспользуемые сущности и подготовил production build автономного демо без backend и секретов.

Для компактного резюме выберите 3–4 пункта, наиболее подходящих вакансии.

### Вариант для LinkedIn или portfolio

Message Hub — frontend-only demo корпоративного мессенджера, который я подготовил из рабочего frontend-проекта для публичного portfolio. Основной фокус — архитектура состояния и реалистичное поведение без backend. Приложение использует Nuxt 3, Vue 3, TypeScript и Pinia, поддерживает 10 переключаемых пользователей, персональные разговоры и unread, CRUD сообщений, управление группами, единый поиск, reactions, локальные attachments и виртуализированную историю. Асинхронный mock API сохраняет versioned snapshot в `localStorage`, а локальный mock-бот демонстрирует typing и детерминированные ответы без внешнего AI API.

### Краткий ответ «Что было самым сложным?»

Самой интересной задачей было переключение текущего пользователя. Обычного `unreadCount` оказалось недостаточно, поэтому я сделал персональную карту unread по user ID. Все разговоры фильтруются по membership, а направление сообщения, права на редактирование, reactions и автор новой записи вычисляются из активной сессии. Это позволило показать один набор данных с разных пользовательских точек зрения без дублирования состояния.

### Краткий ответ «Почему без backend?»

Цель portfolio-версии — показать именно frontend-компетенции и сделать демо доступным без серверной инфраструктуры. Я сохранил API boundary: операции остаются асинхронными, имеют latency и состояния error/retry, но реализованы локальным service layer. Поэтому mock API в дальнейшем можно заменить реальным backend без переписывания UI-компонентов.

### Стек одной строкой

Nuxt 3, Vue 3, TypeScript, Pinia, SCSS, Tailwind CSS, Tiptap, Headless UI, vue-virtual-scroller, date-fns.

### Ключевые слова для ATS

Vue.js, Vue 3, Nuxt.js, Nuxt 3, TypeScript, Pinia, Composition API, state management, frontend architecture, normalized data, localStorage, mock API, async state, error handling, responsive UI, SCSS, Tailwind CSS, rich text editor, virtual scrolling, component architecture.

## English

### Project title

**Message Hub — frontend corporate messenger demo**

### One-line summary

A self-contained corporate messenger demo built with Nuxt 3, Vue 3, TypeScript, and Pinia, featuring switchable users, channels, direct and group conversations, an asynchronous mock API, and local persistence.

### Resume project description

Built and prepared a corporate messenger frontend as a standalone portfolio project. Designed normalized user, conversation, and message entities, split state across five focused Pinia stores, and implemented an asynchronous mock API with versioned `localStorage` persistence. Added ten switchable users, per-user unread state, confirmed message CRUD, group membership management, unified search, local attachments, and a deterministic bot. Polished the main flows with skeleton loading, sending and typing states, toast feedback, virtual-list auto-scroll, and conversation previews.

### Recommended resume bullets

-   Designed normalized `User`, `Conversation`, and `Message` entities and established a single store-driven data flow across five focused Pinia stores.
-   Implemented a frontend-only asynchronous mock API with 200–500 ms latency, debounced persistence, versioned `localStorage` snapshots, reset, error simulation, and retry flows.
-   Added ten switchable demo users with membership-aware conversations, per-user unread counts, message ownership, edit permissions, and incoming/outgoing message alignment.
-   Built channel, direct, and private-group flows with confirmed message CRUD, add/remove reactions, local attachments, member management, and virtual scrolling.
-   Polished demo UX with skeleton and empty states, sending/typing indicators, toast feedback, virtual-list auto-scroll, unread reset, and sidebar previews.
-   Added unified people, role, conversation, channel, and message search with navigation to and highlighting of matched messages.
-   Replaced an unsafe direct AI request with a deterministic local mock bot featuring delayed replies and a visible typing indicator.
-   Removed legacy code and unused entities and prepared a production-buildable demo that runs without a backend or secrets.

### LinkedIn or portfolio description

Message Hub is a frontend-only corporate messenger demo prepared from an existing frontend project for public portfolio use. The project focuses on client-side architecture and realistic behavior without backend infrastructure. It uses Nuxt 3, Vue 3, TypeScript, and Pinia and includes ten switchable users, membership-aware conversations, per-user unread state, confirmed message CRUD, group member management, unified search, reactions, local attachments, and a virtualized history. An asynchronous mock API persists a versioned browser snapshot, while a local deterministic bot demonstrates delayed replies and a typing state without calling an external AI service.

### 30-second interview pitch

> I turned an existing messenger frontend into a self-contained portfolio demo. I normalized users, conversations, and messages, split the state into five Pinia stores, and added an asynchronous mock API with versioned local persistence. The app supports ten switchable users, so conversation membership, unread counts, message ownership, and alignment change with the active session. I also replaced a direct external AI integration with a deterministic local bot, making the demo safe and runnable without a backend or credentials.

### Tech stack

Nuxt 3, Vue 3, TypeScript, Pinia, SCSS, Tailwind CSS, Tiptap, Headless UI, vue-virtual-scroller, and date-fns.

## Проверяемые цифры

Эти значения можно использовать без выдуманных бизнес-метрик:

-   10 переключаемых employee profiles;
-   1 локальный Demo Bot;
-   5 специализированных Pinia stores;
-   4 seed-канала;
-   1 приватная seed-группа;
-   200–500 мс simulated API latency;
-   2 версии data layer: seed и persisted snapshot;
-   0 обязательных внешних API и секретов.

## Что лучше не писать до следующих итераций

-   «Разработал backend»;
-   «Реализовал WebSocket real-time messaging»;
-   «Настроил серверную авторизацию»;
-   «Добавил production file upload»;
-   «Настроил CI/CD и production deployment».

После фактической реализации соответствующих возможностей этот список можно обновить.

## Дополнение после этапа 7

### Bullet point для резюме на русском

-   Реализовал адаптивный интерфейс messenger-приложения для desktop, tablet и mobile: drawer sidebar, мобильный сценарий «список → чат», управление фокусом, семантические кнопки, ARIA-атрибуты, видимый keyboard focus и поддержку `prefers-reduced-motion`.

### Resume bullet in English

-   Built responsive desktop, tablet, and mobile messenger layouts with drawer navigation, a mobile list-to-chat flow, focus management, semantic controls, ARIA labeling, visible keyboard focus, and `prefers-reduced-motion` support.

### Updated short project description

Message Hub — адаптивное frontend-only демо корпоративного мессенджера на Nuxt 3, Vue 3, TypeScript и Pinia. Проект поддерживает переключаемых пользователей, каналы, direct/group conversations, CRUD сообщений, mock API с `localStorage`, локального mock-бота и доступную навигацию на desktop, tablet и mobile.

## Дополнение после этапа 8

### Bullet point для резюме на русском

-   Настроил quality-контур Nuxt/Vue-проекта: strict TypeScript, ESLint, Prettier, 15 unit-тестов Pinia stores и mock services, 4 component-теста и 7 Playwright E2E-сценариев для отправки сообщений, создания каналов, смены пользователя, persistence после reload, reset demo data, onboarding и mobile overflow.

### Resume bullet in English

-   Established a Nuxt/Vue quality pipeline with strict TypeScript, ESLint, Prettier, 15 Pinia and mock-service unit tests, 4 component tests, and 7 Playwright E2E scenarios covering messaging, channel creation, user switching, reload persistence, demo-data reset, onboarding, and mobile overflow.

### Проверяемые цифры

-   15 unit-тестов;
-   4 component-теста;
-   7 Playwright E2E-сценариев;
-   1 команда `npm run quality` для статических проверок, тестов и production build.
