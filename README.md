# Admin Dashboard

## Tech Stack

- **UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI) & [Ant Design](https://ant.design/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router/latest)
- **Type Checking:** [TypeScript](https://www.typescriptlang.org/)
- **Linting/Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)
- **Icons:** [Tabler Icons](https://tabler.io/icons)

## Run Locally

1. **Clone the project:**

```bash
git clone <repository-url>
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Start the server:**

```bash
pnpm run dev
```

4. **Before committing, run Knip to check for unused files:**

```bash
pnpm run knip
```

## Conventions

- **Type Naming:**

  - Types start with `T`
  - Interfaces start with `I`
  - Enums start with `E`

  **Examples:**

  - **Type of Student:**

  ```typescript
  type TStudent = {
    full_name: string
    // other fields...
  }
  ```

  - **Interface of Props:**

  ```typescript
  interface IProps {
    full_name: string
    // other fields...
  }
  ```

  - **Enum of Role:**

  ```typescript
  enum ERole {
    ADMIN = 'Admin',
    // other roles...
  }
  ```
