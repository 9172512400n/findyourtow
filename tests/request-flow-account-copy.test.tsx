// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RoadAssistNowAppFlow } from '../src/components/app/RoadAssistNowAppFlow';

afterEach(() => cleanup());

describe('request flow account/payment copy', () => {
  it('does not show guest checkout copy on the confirmation step', () => {
    render(<RoadAssistNowAppFlow activeTab="Request" initialStep={9} />);

    expect(screen.getByRole('heading', { name: /confirm reservation/i })).toBeInTheDocument();
    expect(screen.queryByText(/no account required/i)).not.toBeInTheDocument();
    expect(screen.getByText(/account and payment are required/i)).toBeInTheDocument();
  });
});
