type SavedMock = jest.Mock["mock"];

export function saveMock(mock: CallableFunction): SavedMock {
  // https://jestjs.io/ru/docs/mock-function-api#mockfnmockclear
  return (mock as jest.Mock).mock;
}

export function restoreMock(mock: SavedMock): jest.Mock {
  const fn = jest.fn();
  fn.mock = mock;
  return fn;
}
