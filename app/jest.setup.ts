import { Window } from 'happy-dom';

declare global {
  namespace NodeJS {
    interface Global {
      window: Window & typeof globalThis;
    }
  }
}
