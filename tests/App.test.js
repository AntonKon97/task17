import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import App from "../App";
import { fetchMeal } from "../services/mealService";

jest.mock("../services/mealService", () => ({
  fetchMeal: jest.fn(),
}));

const mockMeal = {
  strMeal: "Chicken Teriyaki",
  strMealThumb: "https://example.com/chicken.jpg",
  strInstructions: "Cook the chicken.",
};

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should fetch and display a random meal on mount", async () => {
    fetchMeal.mockResolvedValue(mockMeal);

    render(<App />);

    await waitFor(() => {
      expect(fetchMeal).toHaveBeenCalledWith("");
      expect(screen.getByText("Chicken Teriyaki")).toBeTruthy();
    });
  });

  it("should display a message when no meal is found", async () => {
    fetchMeal.mockResolvedValue(null);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("No meal was found")).toBeTruthy();
    });
  });

  it("should fetch a meal by name and clear the input", async () => {
    fetchMeal.mockResolvedValueOnce(null).mockResolvedValueOnce(mockMeal);

    render(<App />);

    const input = screen.getByPlaceholderText("Enter a meal name");

    await waitFor(() => {
      expect(fetchMeal).toHaveBeenCalledTimes(1);
    });

    fireEvent.changeText(input, "Chicken");
    fireEvent.press(screen.getByText("Get Meal"));

    await waitFor(() => {
      expect(fetchMeal).toHaveBeenLastCalledWith("Chicken");
      expect(screen.getByText("Chicken Teriyaki")).toBeTruthy();
      expect(input.props.value).toBe("");
    });
  });

  it("should display no meal message when search returns null", async () => {
    fetchMeal.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    render(<App />);

    const input = screen.getByPlaceholderText("Enter a meal name");

    await waitFor(() => {
      expect(screen.getByText("No meal was found")).toBeTruthy();
    });

    fireEvent.changeText(input, "UnknownMeal");
    fireEvent.press(screen.getByText("Get Meal"));

    await waitFor(() => {
      expect(fetchMeal).toHaveBeenLastCalledWith("UnknownMeal");
      expect(screen.getByText("No meal was found")).toBeTruthy();
    });
  });
});
