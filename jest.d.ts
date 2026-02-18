// Jest type definitions for tests
// These declarations allow TypeScript to recognize Jest globals
// even before @types/jest is installed

// Temporary type declarations for @testing-library/react
declare module '@testing-library/react' {
  import { ReactElement } from 'react';
  
  export function render(component: ReactElement): {
    container: HTMLElement;
    rerender: (component: ReactElement) => void;
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

  export const screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp) => HTMLElement | null;
  };

  export function act(fn: () => void | Promise<void>): void;
  export function waitFor(fn: () => void | Promise<void>): Promise<void>;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveLength(length: number): R;
      toBeDefined(): R;
      toBe(value: any): R;
    }

    interface Expect {
      (value: any): Matchers<any>;
      stringContaining(str: string): any;
      objectContaining(obj: any): any;
    }

    interface Describe {
      (name: string, fn: () => void): void;
    }

    interface It {
      (name: string, fn: () => void | Promise<void>): void;
    }

    interface Lifecycle {
      (fn: () => void | Promise<void>): void;
    }
  }

  var describe: jest.Describe;
  var test: jest.It;
  var it: jest.It;
  var expect: jest.Expect;
  var beforeEach: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
  var beforeAll: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var jest: {
    fn: () => any;
    clearAllMocks: () => void;
    Mock: any;
  };
}

export {};
