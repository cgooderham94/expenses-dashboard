import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockSuccessfulGetRequest } from "../../../test-utils/msw/requestMockHelpers";
import { Dashboard } from "../Dashboard";
import { MOCK_PROVIDER_DATA, MOCK_PROVIDER_DATA_CONDENSED } from "./data";
import { server } from "../../../test-utils/msw/mswSetup";

describe("Transactions dashboard", () => {
  it("should display loading text when transactions are fetched", async () => {
    mockSuccessfulGetRequest("*/v2/5c62e7c33000004a00019b05", MOCK_PROVIDER_DATA_CONDENSED)

    const apiCallSpy = jest.fn();
    server.events.on("request:start", apiCallSpy);

    render(<Dashboard />);

    expect(screen.getByRole("columnheader", { name: /date/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /amount/i })).toBeInTheDocument();

    expect(screen.getAllByTestId("skeleton-loader")).toHaveLength(9);

    await waitFor(() => {
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
  });

  it("should display sorted expenses list when fetched", async () => {
    mockSuccessfulGetRequest("*/v2/5c62e7c33000004a00019b05", MOCK_PROVIDER_DATA_CONDENSED)

    const apiCallSpy = jest.fn();
    server.events.on("request:start", apiCallSpy);

    render(<Dashboard />);

    await waitFor(() => {
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
    });

    const transactions = screen.getAllByRole("row");

    expect(transactions).toHaveLength(4);

    const firstTransaction = transactions[1];
    const secondTransaction = transactions[2];
    const thirdTransaction = transactions[3];

    expect(within(firstTransaction).getByText(/05\/07\/2018/i)).toBeInTheDocument();
    expect(within(firstTransaction).getByText(/transport for london/i)).toBeInTheDocument();
    expect(within(firstTransaction).getByText(/£2.85/i)).toBeInTheDocument();

    expect(within(secondTransaction).getByText(/30\/06\/2018/i)).toBeInTheDocument();
    expect(within(secondTransaction).getByText(/tesco/i)).toBeInTheDocument();
    expect(within(secondTransaction).getByText(/£57.21/i)).toBeInTheDocument();

    expect(within(thirdTransaction).getByText(/03\/07\/2018/i)).toBeInTheDocument();
    expect(within(thirdTransaction).getByText(/amazon/i)).toBeInTheDocument();
    expect(within(thirdTransaction).getByText(/£99.95/i)).toBeInTheDocument();
  });

  it("contains toggle which allows number of results per page to be selected", async () => {
    mockSuccessfulGetRequest("*/v2/5c62e7c33000004a00019b05", MOCK_PROVIDER_DATA)

    const apiCallSpy = jest.fn();
    server.events.on("request:start", apiCallSpy);

    render(<Dashboard />);

    await waitFor(() => {
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
    });

    expect(screen.getAllByRole("row")).toHaveLength(11);

    const resultsSelect = screen.getByRole("combobox", { name: /no. of results/i });

    expect(resultsSelect).toBeInTheDocument();

    userEvent.click(resultsSelect);

    expect(screen.getAllByRole("option")).toHaveLength(3);

    const option = screen.getByRole("option", { name: /15/i });
    
    expect(option).toBeInTheDocument();
    userEvent.click(option);

    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(16));
  });
});