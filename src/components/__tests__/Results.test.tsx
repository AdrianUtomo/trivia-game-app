import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { Results } from '../Results';
import { ThemeProvider } from 'next-themes';

describe('Results Component', () => {
  const mockOnPlayAgain = jest.fn();
  const mockOnBackToSetup = jest.fn();

  const defaultProps = {
    score: 8,
    totalQuestions: 10,
    onPlayAgain: mockOnPlayAgain,
    onBackToSetup: mockOnBackToSetup,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct score and percentage', () => {
    render(
      <ThemeProvider>
        <Results {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Your Score: 8/10')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
  });

  it('displays correct message and color for excellent score (80%+)', () => {
    render(
      <ThemeProvider>
        <Results {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Excellent! You\'re a trivia master!')).toBeInTheDocument();
    expect(screen.getByText('Excellent! You\'re a trivia master!')).toHaveClass('text-green-600');
  });

  it('displays correct message and color for good score (60-79%)', () => {
    render(
      <ThemeProvider>
        <Results score={7} totalQuestions={10} onPlayAgain={mockOnPlayAgain} onBackToSetup={mockOnBackToSetup} />
      </ThemeProvider>
    );

    expect(screen.getByText('Good job! You know your stuff!')).toBeInTheDocument();
    expect(screen.getByText('Good job! You know your stuff!')).toHaveClass('text-blue-600');
  });

  it('displays correct message and color for average score (40-59%)', () => {
    render(
      <ThemeProvider>
        <Results score={5} totalQuestions={10} onPlayAgain={mockOnPlayAgain} onBackToSetup={mockOnBackToSetup} />
      </ThemeProvider>
    );

    expect(screen.getByText('Not bad! Keep learning!')).toBeInTheDocument();
    expect(screen.getByText('Not bad! Keep learning!')).toHaveClass('text-yellow-600');
  });

  it('displays correct message and color for low score (below 40%)', () => {
    render(
      <ThemeProvider>
        <Results score={3} totalQuestions={10} onPlayAgain={mockOnPlayAgain} onBackToSetup={mockOnBackToSetup} />
      </ThemeProvider>
    );

    expect(screen.getByText('Keep practicing! You\'ll get better!')).toBeInTheDocument();
    expect(screen.getByText('Keep practicing! You\'ll get better!')).toHaveClass('text-red-600');
  });

  it('calls onPlayAgain when Play Again button is clicked', () => {
    render(
      <ThemeProvider>
        <Results {...defaultProps} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onBackToSetup when Back to Setup button is clicked', () => {
    render(
      <ThemeProvider>
        <Results {...defaultProps} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /back to setup/i }));
    expect(mockOnBackToSetup).toHaveBeenCalledTimes(1);
  });

  it('handles edge case of zero total questions', () => {
    render(
      <ThemeProvider>
        <Results score={0} totalQuestions={0} onPlayAgain={mockOnPlayAgain} onBackToSetup={mockOnBackToSetup} />
      </ThemeProvider>
    );

    expect(screen.getByText('Your Score: 0/0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles maximum score', () => {
    render(
      <ThemeProvider>
        <Results score={10} totalQuestions={10} onPlayAgain={mockOnPlayAgain} onBackToSetup={mockOnBackToSetup} />
      </ThemeProvider>
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Excellent! You\'re a trivia master!')).toBeInTheDocument();
  });
});
