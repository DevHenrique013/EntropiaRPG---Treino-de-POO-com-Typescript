# TypeScript OOP Playground

Um projeto experimental para estudo de **TypeScript**, focado em **Programação Orientada a Objetos** e **Modelagem de Domínio**.

A ideia principal foi adaptar o sistema de combate do meu **RPG de mesa autoral** para um ambiente de software.

Esse projeto foi utilizado como laboratório para aplicar:

- conceitos de arquitetura
- modelagem de regras de negócio
- estruturas de dados
- tipagem avançada do TypeScript

---

# 🎯 Motivação

O sistema de combate do meu RPG possui diversas regras e interações complexas entre ataques, efeitos e atributos de personagens.

Isso o torna um ótimo caso de uso para praticar:

- modelagem de domínio
- encapsulamento de regras
- composição de comportamentos
- separação entre lógica de aplicação e domínio

---

# 📚 Conceitos Explorados

## Arquitetura

Separação de camadas:

- **Application**
    - Logging
    - Gerenciamento de turnos
    - Inicialização de personagens randômicos
- **Domain**
    - Regras de negócio
    - Modelagem de entidades
    - Exceptions de domínio
- **Utils**
    - Enums
    - Interfaces
    - Helpers

---

## Programação Orientada a Objetos

- Classes e Objetos
- Encapsulamento
- Composição
- Herança
- Polimorfismo
- Abstração
- Interfaces

---

## TypeScript

- Tipagem estática
- Generics
- Utility Types
- Enums
- Types

---

## Estruturas de Dados

- Arrays
- Estruturas de coleção customizadas

---

# 🎯 Objetivos

- Praticar conceitos de Programação Orientada a Objetos
- Explorar o sistema de tipos do TypeScript
- Implementar estruturas de dados simples
- Aplicar separação entre domínio e aplicação
- Experimentar padrões de design básicos

---

# 🚀 Tecnologias

- **TypeScript**
- **Node.js**
- **ts-node**

Gerenciadores suportados:

- npm
- pnpm

---

# 📁 Estrutura do Projeto

EntropiaRPG

├── package.json

├── pnpm-lock.yaml

├── src

│   ├── App

│   │   ├── Bootstrap

│   │   │   ├── AttackSetBootstrap.ts

│   │   │   ├── CharacterBootstrap.ts

│   │   │   └── StatusSetBootstrap.ts

│   │   ├── Combat

│   │   │   └── TurnManagerEngine.ts

│   │   └── Logging

│   │       └── LogSystem.ts

│   │

│   ├── Domain

│   │   ├── Character

│   │   │   ├── Character.ts

│   │   │   └── Status

│   │   │       ├── Status.ts

│   │   │       └── StatusSet.ts

│   │   │

│   │   └── Combat

│   │       ├── Attack

│   │       │   ├── Attack.ts

│   │       │   └── AttackSet.ts

│   │       │

│   │       └── Module

│   │           ├── Effect

│   │           │   └── Effect.ts

│   │           ├── Module.ts

│   │           ├── ModuleFactory.ts

│   │           └── ModuleRegistry.ts

│   │

│   ├── Utils

│   │   ├── Enums

│   │   ├── Helpers

│   │   ├── Interfaces

│   │   └── Types

│   │

│   └── index.ts

│

├── tsconfig.build.json

└── tsconfig.json

---

# ⚙️ Setup

Clone o repositório:

```bash
git clone <https://github.com/DevHenrique013/EntropiaRPG---Treino-de-POO-com-Typescript>
```

Entre na pasta do projeto:

```jsx
cd EntropiaRPG---Treino-de-POO-com-Typescript
```

## Instalar dependências

### NPM

```
npm install
```

### PNPM

```
pnpm install
```

## Build do projeto

### NPM

```
npm run build
```

### PNPM

```
pnpm run build
```

---

## Executar o projeto

### NPM

```
npmstart
```

### PNPM

```
pnpmstart
```

Ao executar o projeto, dois personagens aleatórios serão gerados e um combate automático será iniciado.

# 🧠 Arquitetura

## Domain

O **Domain** contém todas as regras de negócio do sistema.

### Character

A classe `Character` representa um personagem em combate.

Cada personagem possui:

- um conjunto de **Status (StatusSet)**
- um conjunto de **Ataques (AttackSet)**

Status disponíveis:

- Vida
- Energia
- Velocidade
- Força
- Resistência

Cada personagem possui **4 slots de ataque**, e cada ataque possui:

- custo de energia
- cooldown

---

### Sistema de Ataques

Os ataques são baseados em **composição de módulos**.

Cada ataque pode conter diversos módulos, como:

- Envenenamento
- Atordoamento
- Lentidão
- Dano direto

Esses módulos geram **efeitos** aplicados ao alvo.

Inclusive o **dano direto** é tratado como um efeito, com a diferença de ser instantâneo.

---

### Regras de Balanceamento

Algumas regras importantes do sistema incluem:

- cálculo automático de **custo energético**
- cálculo de **cooldown**
- classificação de módulos por tipo

Isso permite que ataques sejam **balanceados automaticamente**.

Todos os módulos disponíveis são registrados em:

```
src/Domain/Combat/Module/ModuleRegistry.ts
```

---

## Application

A camada **Application** coordena a execução do sistema.

### Bootstrap

Responsável pela geração de personagens aleatórios.

Processo:

1. Geração dos **Status**
2. Geração dos **Ataques**
3. Criação final do **Character**

Os parâmetros usados incluem:

- classe do personagem
- elemento
- nível

---

### Combat Engine

O combate é gerenciado por:

```
TurnManagerEngine.ts
```

Ele controla:

- ordem de turnos
- execução de ataques
- aplicação de efeitos
- verificação de vitória

Basta chamar uma função passando dois personagens para iniciar um combate automático.

---

### Logging

O sistema possui um **logging simples** que registra os eventos da batalha.

Isso permite acompanhar:

- ataques utilizados
- efeitos aplicados
- mudanças de status
- resultado do combate

---

# 🔮 Melhorias Futuras

- Controle de personagem via CLI
- Melhor tomada de decisão dos bots
- Sistema de turnos controlado (step-by-step)
- Melhor tratamento de erros
- Testes automatizados
- Transformação do projeto em **API**
- Interface Web para visualização de combates
