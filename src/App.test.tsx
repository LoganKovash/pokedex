import React from 'react';
import { renderApp } from './test-utils';
import { act } from '@testing-library/react';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

test('renders home page', async () => {
  let getByTestId;
  await act(async () => {
    ({ getByTestId } = renderApp(<App />));
  });

  expect(getByTestId('MockReactMarkdown')).toBeInTheDocument();
});
