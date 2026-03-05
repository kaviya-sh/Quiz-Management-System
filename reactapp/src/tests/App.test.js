// src/__tests__/App.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import QuizForm from "../components/QuizForm";
import QuizList from "../components/QuizList";
import * as api from "../services/api";

jest.mock("../services/api");

const mockQuizzes = [
  { id: 1, title: "Math Quiz", description: "Basic math questions" },
  { id: 2, title: "Science Quiz", description: "Basic science questions" },
];

describe("Online Learning Quiz Game - Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Renders app title
  test("React_BuildUIComponents_renders app title", () => {
    api.getQuizzes.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText(/Online Learning Quiz Game/i)).toBeInTheDocument();
  });

  // 2. Fetches and displays quizzes
  test("React_APIIntegration_TestingAndAPIDocumentation_fetches and displays quizzes", async () => {
    api.getQuizzes.mockResolvedValueOnce(mockQuizzes);
    render(<App />);
    expect(await screen.findByText("Math Quiz")).toBeInTheDocument();
    expect(screen.getByText("Science Quiz")).toBeInTheDocument();
  });

  // 3. Shows empty message if no quizzes
  test("React_UITestingAndResponsivenessFixes_shows empty message if no quizzes", async () => {
    api.getQuizzes.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() => {
      // Since no quizzes, table will be empty; check no rows
      expect(screen.queryByRole("row", { name: /Math Quiz/i })).not.toBeInTheDocument();
    });
  });

  // 4. Handles fetch error gracefully
  test("React_UITestingAndResponsivenessFixes_handles fetch error gracefully", async () => {
    api.getQuizzes.mockRejectedValueOnce(new Error("Fetch error"));
    render(<App />);
    expect(await screen.findByText(/Online Learning Quiz Game/i)).toBeInTheDocument();
    // Optionally check if quizzes are empty after error
  });

  // 5. Renders QuizForm inputs
  test("React_BuildUIComponents_renders QuizForm inputs", () => {
    render(<QuizForm onAdd={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Quiz Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Quiz Description/i)).toBeInTheDocument();
  });
  // 7. Prevents submission if fields are empty
  test("React_UITestingAndResponsivenessFixes_prevents submission if fields are empty", () => {
    window.alert = jest.fn();
    render(<QuizForm onAdd={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Add Quiz/i }));
    expect(window.alert).toHaveBeenCalledWith("Fill all fields");
  });

  // 8. QuizList displays quiz details correctly
  test("React_BuildUIComponents_displays quizzes correctly in QuizList", () => {
    render(<QuizList quizzes={mockQuizzes} />);
    expect(screen.getByText("Math Quiz")).toBeInTheDocument();
    expect(screen.getByText("Basic math questions")).toBeInTheDocument();
    expect(screen.getByText("Science Quiz")).toBeInTheDocument();
    expect(screen.getByText("Basic science questions")).toBeInTheDocument();
  });

  // 9. QuizList renders empty table gracefully
  test("React_UITestingAndResponsivenessFixes_renders empty QuizList gracefully", () => {
    render(<QuizList quizzes={[]} />);
    expect(screen.queryByRole("row", { name: /Math Quiz/i })).not.toBeInTheDocument();
  });
// 10. Reloads quizzes after adding a quiz in App component
test("React_APIIntegration_TestingAndAPIDocumentation_reloads quizzes after adding a quiz", async () => {
  // Mock first getQuizzes call returns initial quizzes
  api.getQuizzes.mockResolvedValueOnce(mockQuizzes);

  // Mock addQuiz API call resolves successfully
  api.addQuiz.mockResolvedValueOnce({});

  // Mock second getQuizzes call (reload after add)
  api.getQuizzes.mockResolvedValueOnce([
    ...mockQuizzes,
    { id: 3, title: "Geography Quiz", description: "Geography questions" },
  ]);

  render(<App />);

  // Wait for initial quizzes load
  expect(await screen.findByText("Math Quiz")).toBeInTheDocument();

  // Fill and submit form
  fireEvent.change(screen.getByPlaceholderText(/Quiz Title/i), {
    target: { value: "Geography Quiz" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Quiz Description/i), {
    target: { value: "Geography questions" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Add Quiz/i }));

  // Wait for addQuiz to be called
  await waitFor(() => expect(api.addQuiz).toHaveBeenCalledTimes(1));

  // Wait for second getQuizzes call triggered by onAdd()
  await waitFor(() => expect(api.getQuizzes).toHaveBeenCalledTimes(2));

  // New quiz should be visible
  expect(await screen.findByText("Geography Quiz")).toBeInTheDocument();
});

// 11. Displays table headers correctly in QuizList
test("React_BuildUIComponents_displays table headers correctly", () => {
  render(<QuizList quizzes={mockQuizzes} />);
  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.getByText("Description")).toBeInTheDocument();
});
});
