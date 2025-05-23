import { restoreMock, saveMock } from "../save-mock";

describe("save/restore mock", () => {
  const mock = jest.fn();

  mock(1);

  const savedMock = saveMock(mock);

  test("", () => {
    const restoredMock = restoreMock(savedMock);
    expect(restoredMock).toHaveBeenCalledTimes(1);
    expect(restoredMock).toHaveBeenCalledWith(1);
  });
});
