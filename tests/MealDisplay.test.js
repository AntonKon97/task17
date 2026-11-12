import React from "react";
import { render, screen } from "@testing-library/react-native";
import MealDisplay from "../components/MealDisplay";

const mockMeal = {
  strMeal: "Chicken Teriyaki",
  strMealThumb: "https://example.com/chicken.jpg",
  strInstructions: "Cook the chicken and add teriyaki sauce.",
};

describe("MealDisplay", () => {
  it("should display the meal name", () => {
    render(<MealDisplay meal={mockMeal} />);

    expect(screen.getByText("Chicken Teriyaki")).toBeTruthy();
  });

  it("should display meal instructions", () => {
    render(<MealDisplay meal={mockMeal} />);

    expect(screen.getByText(mockMeal.strInstructions)).toBeTruthy();
  });

  it("should display the meal image with correct URI", () => {
    render(<MealDisplay meal={mockMeal} />);

    const image = screen.getByTestId("mealImage");

    expect(image.props.source.uri).toBe(mockMeal.strMealThumb);
  });
});
