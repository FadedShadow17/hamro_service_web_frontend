// Temporary type declarations for @testing-library/react
// These will be replaced by actual types once packages are installed

declare module '@testing-library/react' {
  export function render(component: React.ReactElement): {
    container: HTMLElement;
    rerender: (component: React.ReactElement) => void;
    unmount: () => void;
  };

  export function renderHook<T>(
    hook: () => T
  ): {
    result: {
      current: T;
    };
    rerender: () => void;
    unmount: () => void;
  };

  export function screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp) => HTMLElement | null;
  };

  export function act(fn: () => void | Promise<void>): void;
  export function waitFor(fn: () => void | Promise<void>): Promise<void>;
}
