# Guia de Componentes, Design System e Estilização

Este guia documenta o sistema de design, a paleta de cores institucional, a tipografia, a convenção de classes no Tailwind CSS 4 e o catálogo de componentes reutilizáveis do **Painel Administrativo da Paróquia São José**.

---

## 1. Identidade Visual e Tokens (Tailwind CSS 4)

O painel utiliza **Tailwind CSS v4** com tokens definidos no bloco `@theme` em `src/app/globals.css`.

### 1.1. Paleta de Cores Institucional
A paleta representa a sobriedade eclesiástica (verde floresta escuro) com detalhes em dourado litúrgico:

| Token Tailwind | Cor Hex / Valor | Aplicação Típica |
| :--- | :--- | :--- |
| `brand-0` | `#f8f0e7` | Fundo de destaque suave, rádio selecionado |
| `brand-50` | `#fbf4eb` | Fundo secundário claro |
| `brand-100` | `#fff8f0` | Anéis de foco suaves, badges institucionais |
| `brand-300` | `#eeca94` | Bordas douradas suaves em foco |
| `brand-500` | `#d6a64a` | Dourado litúrgico (ícones de destaque, botões `gold`) |
| `brand-600` | `#bb8835` | Dourado mais escuro (hover, bordas ativas) |
| `brand-700` | `#27442a` | Verde floresta médio (divisores de sidebar, hover de links) |
| `brand-800` | `#18351e` | Verde institucional principal (botões padrão, cabeçalhos) |
| `brand-900` | `#102415` | Verde escuro profundo (base do gradiente da sidebar) |
| `bg-brand-gradient` | `linear-gradient(180deg, #18351e 0%, #102415 100%)` | Fundo da sidebar lateral |

### 1.2. Tipografia
- **Títulos e Cabeçalhos**: Família Serifada clássica (`Cormorant Garamond, serif`).
- **Corpo e Interface**: Fonte moderna sem serifa (`Inter, sans-serif`).
- Utilize sempre os componentes padronizados de `src/components/ui/typography/`:
  - `<TypographyH1>`: Títulos de página (`text-3xl md:text-5xl font-semibold font-serif`).
  - `<TypographyH2>`: Seções principais (`text-2xl md:text-3xl font-semibold font-serif`).
  - `<TypographyH3>`: Subseções e cards (`text-xl font-semibold font-serif`).
  - `<TypographyP>`: Parágrafos e descrições do corpo do texto.
  - `<TypographyDescribe>`: Legendas e textos auxiliares esmaecidos.

---

## 2. Catálogo de Componentes Padronizados

### 2.1. Botão Padronizado (`src/components/ui/button.tsx`)
O componente `Button` é a referência unificada para todas as ações do sistema. Suporta estados de carregamento nativos (`isLoading`), ícones inline e polimorfismo via `asChild` (Radix Slot).

#### Variantes (`variant`):
- `default`: Fundo verde `brand-800`, texto branco, hover `brand-700` com anel de foco suave.
- `outline`: Borda sutil, fundo transparente, hover no cinza suave (`muted`).
- `secondary`: Ações secundárias neutras.
- `ghost`: Sem borda ou fundo até o hover; ótimo para ícones e botões de cabeçalho.
- `destructive`: Ações perigosas em vermelho vibrante (`bg-red-600 hover:bg-red-700`).
- `destructive-subtle`: Fundo vermelho translúcido (`bg-destructive/10 text-destructive`).
- `gold`: Botão dourado com alto destaque (`bg-brand-500 hover:bg-brand-600`).
- `link`: Botão com aparência de hyperlink com sublinhado no hover.

#### Tamanhos (`size`):
- `default` (`h-9 px-3`)
- `xs` (`h-6 px-2 text-xs`)
- `sm` (`h-8 px-2.5 text-xs`)
- `lg` (`h-11.5 px-6 text-sm font-semibold`) — **Padrão para formulários e ações de rodapé**.
- `icon`, `icon-xs`, `icon-sm`, `icon-lg` — Botões quadrados para ícones.

#### Uso com Loading Automático:
```tsx
import { Button } from '@/components/ui/button';

<Button 
  variant="default" 
  size="lg" 
  isLoading={isPending} 
  loadingText="Salvando alterações..."
>
  Salvar
</Button>
```

#### Uso como Link (Next.js):
```tsx
import { ROUTES } from '@/constants/routes';

<Button asChild variant="outline" size="lg">
  <Link href={ROUTES.PARISH.COMMUNITY.ADD}>Nova Comunidade</Link>
</Button>
```

---

### 2.2. Modais e Diálogos de Confirmação (`src/components/common/dialog/confirm-dialog.tsx`)
**Nunca utilize `window.confirm()` nativo do navegador.** Utilize as abstrações prontas construídas sobre o Radix Dialog:

#### Confirmação Geral (`ConfirmDialog`):
```tsx
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Deseja publicar este aviso?"
  description="O aviso ficará visível imediatamente para todos os visitantes do site."
  confirmText="Publicar"
  variant="default"
  isPending={isPublishing}
  onConfirm={handlePublish}
/>
```

#### Confirmação de Exclusão (`DeleteConfirmationDialog`):
Já configurado com estilo destrutivo (`variant="destructive"`), título padrão e mensagem segura:
```tsx
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';

<DeleteConfirmationDialog
  open={confirmDelete}
  onOpenChange={setConfirmDelete}
  itemName={community.name}
  isPending={deleteMutation.isPending}
  onConfirm={() => deleteMutation.mutate(community.id)}
/>
```

---

### 2.3. Campos de Formulário (`src/components/common/input.tsx`)
Implementa o padrão *Compound Components* com controle de erro e anel de foco integrado:

```tsx
import { Root as InputRoot, Control as InputControl, Prefix as InputPrefix } from '@/components/common/input';

<InputRoot 
  error={formik.errors.name} 
  touched={formik.touched.name}
  helperText="Informe o nome oficial da comunidade"
>
  <InputControl
    name="name"
    value={formik.values.name}
    onChange={formik.handleChange}
    placeholder="Ex: Comunidade São Pedro"
  />
</InputRoot>
```
*Regra de Ouro:* Ao detectar erro (`error && touched`), o componente automaticamente adiciona a classe CSS `.focus-error`, permitindo foco automático através do utilitário `focusFirstFieldError()`.

---

### 2.4. Select Padronizado (`src/components/common/select.tsx`)
Envolve o `@radix-ui/react-select` com portal dinâmico, animação de descida e indicação visual com checkmark:

```tsx
import { Select, SelectItem } from '@/components/common/select';

<Select
  placeholder="Selecione o tipo..."
  value={formik.values.type}
  onValueChange={(val) => formik.setFieldValue('type', val)}
>
  <SelectItem text="Igreja Matriz" value="parish_church" description="Sede da Paróquia" />
  <SelectItem text="Capela" value="chapel" description="Comunidade pertencente à paróquia" />
</Select>
```

---

### 2.5. Upload de Mídia e Imagens (`src/components/ui/file-input/`)
Componente modular que se integra diretamente ao `useFileInputStore`:

```tsx
import {
  Root as FileInputRoot,
  Trigger as FileInputTrigger,
  Control as FileInputControl,
  ImagePreview,
} from '@/components/ui/file-input';

<div className="flex flex-col sm:flex-row gap-4">
  <ImagePreview size="lg" />
  <div className="flex-1">
    <FileInputRoot className="flex-1">
      <FileInputTrigger />
      <FileInputControl accept="image/png,image/jpeg" />
    </FileInputRoot>
  </div>
</div>
```

---

### 2.6. Agrupamento de Seções de Formulário (`FieldSection`)
Garante o layout padronizado de duas colunas (título/descrição à esquerda, campos à direita em telas grandes):

```tsx
import { FieldSection } from '@/components/ui/field-section';

<FieldSection
  title="Informações do Padroeiro"
  description="Detalhes devocionais sobre o padroeiro desta comunidade."
>
  <div className="flex flex-col gap-4">
    {/* Campos do formulário */}
  </div>
</FieldSection>
```

---

### 2.7. Stepper de Múltiplos Passos (`Step`)
Usado em fluxos guiados (ex: Criação de Comunidades, Avisos e Missas):

```tsx
import { Step } from '@/components/ui/stepper';
import { Separator } from '@/components/ui/separator';

<div className="flex flex-row items-center gap-8">
  <Step variant={activeStep === 1 ? 'default' : 'completed'} step={1} label="Informações" />
  <Separator className="flex-1 max-w-20" />
  <Step variant={activeStep === 1 ? 'pending' : 'default'} step={2} label="Confirmação" />
</div>
```

---

### 2.8. Estados Vazios e Skeletons
- **Skeletons (`src/components/ui/skeleton.tsx`)**: Sempre implemente um layout de skeleton fiel à tela final durante `isPending`. Não utilize apenas um spinner solto no centro da página.
- **Empty State**: Mostre um card centralizado com ícone característico em caixa dourada (`bg-[#fef8ed] border-[#D6A64A]/40 text-[#B8872E]`), título em `Cormorant Garamond`, texto explicativo e botão de criação via `<Button asChild>`.
