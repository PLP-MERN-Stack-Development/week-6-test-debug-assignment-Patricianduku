import { render } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';

const AllProviders = ({ children }) => (
  <>
    {children}
    <Toaster />
  </>
);

const customRender = (ui, options) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
