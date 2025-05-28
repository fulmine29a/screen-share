/* eslint-disable @typescript-eslint/ban-types */

type Params = {
  dispatchMock: jest.Mock;
};

export const createAppThunkMock =
  (action: string, payloadCreator: Function) =>
  (params: unknown) =>
  ({ dispatchMock }: Params) =>
    payloadCreator(params, { dispatch: dispatchMock });
