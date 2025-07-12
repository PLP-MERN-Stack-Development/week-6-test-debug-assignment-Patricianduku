// src/tests/integration/BugFlow.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BugForm from '../../components/BugForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('react-hot-toast');
vi.mock('axios');

describe('BugForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<BugForm />);
    expect(screen.getByText(/report a bug/i)).toBeInTheDocument();
  });

  it('shows error if title is missing', async () => {
    render(<BugForm />);

    // Fill in description but leave title empty
    fireEvent.change(screen.getByLabelText(/bug description/i), {
      target: { value: 'Some description' },
    });

    // Submit the form by triggering submit event directly
    const form = screen.getByTestId('bug-form');
    fireEvent.submit(form);

    // ✅ Expect form error to appear
    await waitFor(() =>
      expect(screen.getByTestId('form-error')).toHaveTextContent(/title is required/i)
    );

    // ✅ Expect toast to be called
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('submits form and shows success toast', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });
    
    render(<BugForm />);
    fireEvent.change(screen.getByLabelText(/bug title/i), {
      target: { value: 'Sample Bug' },
    });
    fireEvent.change(screen.getByLabelText(/bug description/i), {
      target: { value: 'Sample description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Bug reported successfully!')
    );
  });

  it('handles submission error', async () => {
    // Mock failed API response
    axios.post.mockRejectedValueOnce(new Error('API failure'));

    render(<BugForm />);
    fireEvent.change(screen.getByLabelText(/bug title/i), {
      target: { value: 'Bug' },
    });
    fireEvent.click(screen.getByRole('button', { name: /report bug/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to report bug.')
    );
  });
});
