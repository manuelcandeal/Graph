# Graph

Projecte web frontend amb TypeScript pur, sense frameworks CSS o JavaScript.

## Taula de continguts

- [Instal·lació](#installació)
- [Configuració del Linter (ESLint)](#configuració-del-linter-eslint)
- [Configuració del Formatter (Prettier)](#configuració-del-formatter-prettier)
- [Scripts disponibles](#scripts-disponibles)
- [Configuració de Visual Studio Code](#configuració-de-visual-studio-code)

---

## Instal·lació

### Crear el projecte Vite amb TypeScript

```bash
npm create vite@latest . -- --template vanilla-ts
npm install
```

### Instal·lar ESLint i Prettier

```bash
npm install -D eslint @eslint/js @types/eslint__js typescript typescript-eslint
npm install -D prettier eslint-config-prettier
```

---

## Configuració del Linter (ESLint)

### Fitxer de configuració: `eslint.config.js`

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      // Regles personalitzades
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Prohibeix punts i coma
      semi: ['error', 'never'],
    },
  }
);
```

### Característiques de la configuració

- **Ignora directoris**: `dist/` i `node_modules/`
- **Configuracions base**:
  - `eslint.configs.recommended` - Regles recomanades d'ESLint
  - `tseslint.configs.recommended` - Regles recomanades per TypeScript
  - `prettierConfig` - Desactiva regles que entren en conflicte amb Prettier
- **Regles personalitzades**:
  - Variables no utilitzades que comencen amb `_` són permeses
  - L'ús de `any` genera un warning (no un error)
  - **Els punts i coma estan prohibits** - genera un error si n'afegeixes

---

## Configuració del Formatter (Prettier)

### Fitxer de configuració: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Explicació de les regles

| Regla           | Valor    | Descripció                                      |
| --------------- | -------- | ----------------------------------------------- |
| `semi`          | `false`  | **NO** utilitza punts i coma                    |
| `singleQuote`   | `true`   | Utilitza cometes simples en lloc de dobles      |
| `tabWidth`      | `2`      | Indentació de 2 espais                          |
| `trailingComma` | `es5`    | Comes finals on ES5 ho permet                   |
| `printWidth`    | `80`     | Longitud màxima de línia de 80 caràcters        |
| `arrowParens`   | `always` | Sempre utilitza parèntesis en arrow functions   |
| `endOfLine`     | `lf`     | Utilitza line feed (LF) per finals de línia     |

### Fitxer d'ignorats: `.prettierignore`

```
# Directoris
dist/
node_modules/
.git/

# Fitxers
package-lock.json
pnpm-lock.yaml
yarn.lock

# Build
*.min.js
*.min.css
```

---

## Scripts disponibles

### Desenvolupament

```bash
npm run dev
```

Inicia el servidor de desenvolupament amb hot reload.

### Build

```bash
npm run build
```

Compila TypeScript i genera els fitxers de producció a `dist/`.

### Preview

```bash
npm run preview
```

Previsualitza la build de producció localment.

### Linting

```bash
npm run lint
```

Executa ESLint per detectar errors i problemes al codi.

```bash
npm run lint:fix
```

Executa ESLint i corregeix automàticament els problemes que es poden solucionar.

### Formatting

```bash
npm run format
```

Formata tot el codi del projecte amb Prettier.

```bash
npm run format:check
```

Comprova si el codi està formatat correctament sense modificar-lo.

---

## Configuració de Visual Studio Code

### Extensions necessàries

Instal·la aquestes extensions des del marketplace de VS Code:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)

### Configuració inclosa

El projecte ja inclou el fitxer `.vscode/settings.json` amb la configuració següent:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript"],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Què fa aquesta configuració?

- **Format on save**: Formata automàticament el codi quan deses
- **ESLint auto-fix**: Corregeix automàticament problemes d'ESLint en desar
- **Prettier com a formatter per defecte**: Utilitza Prettier per formatar TS/JS

**Només cal que instal·lis les extensions** i la configuració funcionarà automàticament!

---

## Flux de treball recomanat

1. **Escriu codi** - VS Code mostrarà errors d'ESLint en temps real
2. **Desa el fitxer** - Prettier formata + ESLint corregeix automàticament
3. **Abans de commit**:
   ```bash
   npm run lint
   npm run format:check
   ```
4. **Build final**:
   ```bash
   npm run build
   ```

---

## Tecnologies utilitzades

- **Vite** - Build tool i dev server
- **TypeScript** - Superset de JavaScript amb tipatge estàtic
- **ESLint** - Linter per detectar errors i males pràctiques
- **Prettier** - Formatter per mantenir un estil de codi consistent
