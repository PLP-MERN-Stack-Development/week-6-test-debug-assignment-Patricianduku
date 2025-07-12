import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BugForm from '../../components/BugForm';
import axios from 'axios';
import toast from 'react-hot-toast';

import { vi } from 'vitest';

vi.mock('axios');
vi.mock('react-hot-toast');

describe('BugForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<BugForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('shows error if title is missing', async () => {
    render(<BugForm />);
    
    // Fill in description but leave title empty
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Some description' },
    });
    
    // Submit the form by triggering submit event directly
    const form = screen.getByTestId('bug-form');
    fireEvent.submit(form);
    
    expect(await screen.findByTestId('form-error')).toHaveTextContent(/title is required/i);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('submits form and shows success toast', async () => {
    axios.post.mockResolvedValueOnce({});
    render(<BugForm />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Bug A' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Bug description' } });
    fireEvent.click(screen.getByRole('button', { name: /report bug/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/bugs', {
        title: 'Bug A',
        description: 'Bug description',
      });
    });

    expect(await screen.findByText(/bug reported successfully/i)).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Bug reported successfully!');
  });

  it('handles submission error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed'));
    render(<BugForm />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Bug A' } });
    fireEvent.click(screen.getByRole('button', { name: /report bug/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to report bug.');
    });
  });
});
