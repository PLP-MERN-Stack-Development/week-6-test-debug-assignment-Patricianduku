import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BugList from '../../components/BugList';
import axios from 'axios';
import toast from 'react-hot-toast';

import { vi } from 'vitest';

vi.mock('axios');
vi.mock('react-hot-toast');


const sampleBugs = [
  { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', createdAt: new Date().toISOString() },
  { _id: '2', title: 'Bug 2', description: 'Desc 2', status: 'resolved', createdAt: new Date().toISOString() }
];

describe('BugList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: sampleBugs });
  });

  it('renders and displays bugs', async () => {
    render(<BugList />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(await screen.findByText(/Bug 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Bug 2/i)).toBeInTheDocument();
  });

  it('filters by status', async () => {
    render(<BugList />);
    await screen.findByText(/Bug 1/i);
    fireEvent.click(screen.getByRole('button', { name: /resolved/i }));
    expect(screen.getByText(/Bug 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bug 1/i)).not.toBeInTheDocument();
  });

  it('deletes a bug', async () => {
    axios.delete.mockResolvedValue({});
    render(<BugList />);
    await screen.findByText(/Bug 1/i);
    const deleteButtons = screen.getAllByLabelText('Delete bug');
    fireEvent.click(deleteButtons[0]);

    await screen.findByText(/confirm delete/i);
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/bugs/1');
      expect(toast.success).toHaveBeenCalledWith('Bug deleted successfully!');
    });
  });

  it('updates status', async () => {
    axios.put.mockResolvedValue({});
    render(<BugList />);
    await screen.findByText(/Bug 1/i);

    const dropdowns = screen.getAllByLabelText('Change bug status');
    fireEvent.change(dropdowns[0], {
      target: { value: 'resolved' },
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/bugs/1', { status: 'resolved' });
      expect(toast.success).toHaveBeenCalledWith('Bug status updated!');
    });
  });
});
