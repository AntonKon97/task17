import axios from "axios";
import { fetchMeal, apiURL } from "../services/mealService";

jest.mock("axios");

describe("fetchMeal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a random meal", async () => {
    const mockMeal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    axios.get.mockResolvedValue({
      data: {
        meals: [mockMeal],
      },
    });

    const result = await fetchMeal();

    expect(axios.get).toHaveBeenCalledWith(`${apiURL}random.php`);
    expect(result).toEqual(mockMeal);
  });

  it("should fetch a meal by search query", async () => {
    const mockMeal = {
      idMeal: "52795",
      strMeal: "Chicken Handi",
    };

    axios.get.mockResolvedValue({
      data: {
        meals: [mockMeal],
      },
    });

    const result = await fetchMeal("Chicken");

    expect(axios.get).toHaveBeenCalledWith(`${apiURL}search.php?s=Chicken`);
    expect(result).toEqual(mockMeal);
  });

  it("should return undefined when no meals are found", async () => {
    axios.get.mockResolvedValue({
      data: {
        meals: null,
      },
    });

    const result = await fetchMeal("UnknownMeal");

    expect(axios.get).toHaveBeenCalledWith(`${apiURL}search.php?s=UnknownMeal`);
    expect(result).toBeUndefined();
  });

  it("should return null when request fails", async () => {
    const mockError = new Error("Network Error");

    axios.get.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await fetchMeal();

    expect(axios.get).toHaveBeenCalledWith(`${apiURL}random.php`);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    expect(result).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
