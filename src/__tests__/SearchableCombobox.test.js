import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchableCombobox from "../SearchableCombobox";
import * as mockSearch from "../mockSearch";

const DEBOUNCE_MS = 300;
const SEARCH_DELAY_MS = 300;

async function advanceSearchTimers() {
  await act(async () => {
    jest.advanceTimersByTime(DEBOUNCE_MS + SEARCH_DELAY_MS);
  });
}

describe("Milestone 1", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays matching options when the user types a search query", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchableCombobox />);

    await user.type(screen.getByTestId("combobox-input"), "ap");
    await advanceSearchTimers();

    await waitFor(() => {
      expect(screen.getByTestId("combobox-option-apple")).toBeInTheDocument();
      expect(screen.getByTestId("combobox-option-apricot")).toBeInTheDocument();
    });
  });
});

describe("Milestone 2", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("debounces search so rapid typing triggers only one API call", async () => {
    const searchSpy = jest.spyOn(mockSearch, "searchOptions");
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchableCombobox />);

    const input = screen.getByTestId("combobox-input");
    await user.click(input);
    await user.type(input, "apr");

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledWith("apr");
  });
});

describe("Milestone 3", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("moves focus with arrow keys and selects the focused option on Enter", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchableCombobox />);

    const input = screen.getByTestId("combobox-input");
    await user.type(input, "b");
    await advanceSearchTimers();

    await waitFor(() => {
      expect(screen.getByTestId("combobox-option-banana")).toBeInTheDocument();
      expect(
        screen.getByTestId("combobox-option-blueberry"),
      ).toBeInTheDocument();
    });

    await user.keyboard("{ArrowDown}");

    expect(screen.getByTestId("combobox-option-blueberry")).toHaveAttribute(
      "data-active",
      "true",
    );

    await user.keyboard("{Enter}");

    expect(input).toHaveValue("Blueberry");
  });
});

describe("Milestone 4", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("closes the list after selection and shows an empty state when nothing matches", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchableCombobox />);

    const input = screen.getByTestId("combobox-input");
    await user.type(input, "ap");
    await advanceSearchTimers();

    await waitFor(() => {
      expect(screen.getByTestId("combobox-option-apple")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("combobox-option-apple"));

    expect(input).toHaveValue("Apple");
    expect(screen.queryByTestId("combobox-list")).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "zzzzz");
    await advanceSearchTimers();

    await waitFor(() => {
      expect(screen.getByTestId("combobox-empty")).toHaveTextContent(
        "No results found",
      );
    });
  });
});
