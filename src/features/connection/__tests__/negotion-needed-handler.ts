import { appSendControlChannelMessage } from "../../app";
import { getConnection } from "../../../entities/connection/connection";
import { negotiationNeededHandler } from "../negotiation-needed-handler";

jest.mock("../../app", () => ({
  appSendControlChannelMessage: jest.fn(),
}));

jest.mock("../../../entities/connection/connection");

describe("negotiationNeededHandler", () => {
  const mockDispatch = jest.fn();
  const mockConnection = {
    connectionState: "connected",
    createOffer: jest.fn().mockResolvedValue("offer-sdp"),
    setLocalDescription: jest.fn(),
  };

  beforeEach(() => {
    (getConnection as jest.Mock).mockReturnValue(mockConnection);
  });

  it("should handle negotiation needed event", async () => {
    await negotiationNeededHandler(mockDispatch)();

    expect(mockConnection.createOffer).toHaveBeenCalled();
    expect(mockConnection.setLocalDescription).toHaveBeenCalledWith(
      "offer-sdp",
    );
    expect(appSendControlChannelMessage).toHaveBeenCalledWith({
      type: "negotiation needed",
      sdp: "offer-sdp",
    });
  });

  it("should not process if connection is new", async () => {
    (getConnection as jest.Mock).mockReturnValue({
      ...mockConnection,
      connectionState: "new",
    });

    await negotiationNeededHandler(mockDispatch)();

    expect(mockConnection.createOffer).not.toHaveBeenCalled();
  });
});
