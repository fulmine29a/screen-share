import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import React, { useRef, useState } from "react";
import { useAppDispatch } from "../shared/store/hooks";
import { connectionCreateClient } from "../features/connection/connection-create-client";
import { Link } from "react-router";

function useOffer() {
  const [offer, setOffer] = useState("");
  const [debouncedCanSubmitClient, setDebouncedCanSubmitClient] =
    useState(true);
  const [debouncedWrongOfferType, setDebouncedWrongOfferType] = useState(false);

  let canSubmitClient = true;
  let wrongOfferType = false;

  try {
    const parsedOffer = JSON.parse(atob(offer)) as RTCSessionDescriptionInit;
    if (
      typeof parsedOffer.sdp == "string" &&
      typeof parsedOffer.type == "string"
    ) {
      canSubmitClient = wrongOfferType = parsedOffer.type != "offer";
    }
  } catch {
    canSubmitClient = false;
  }

  const changeOfferInterval = useRef<ReturnType<typeof setInterval>>();

  const onChangeOffer: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    currentTarget,
  }) => {
    setOffer(currentTarget.value);
    setDebouncedCanSubmitClient(true);
    setDebouncedWrongOfferType(false);
    if (changeOfferInterval.current) {
      clearInterval(changeOfferInterval.current);
    }

    const storedValue = currentTarget.value;
    changeOfferInterval.current = setTimeout(() => {
      if (currentTarget.value == storedValue) {
        setDebouncedCanSubmitClient(canSubmitClient);
        setDebouncedWrongOfferType(wrongOfferType);
      }
    }, 1000);
  };

  return {
    offer,
    debouncedCanSubmitClient,
    debouncedWrongOfferType,
    onChangeOffer,
    canSubmitClient,
  };
}

export const createClientPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    debouncedCanSubmitClient,
    canSubmitClient,
    debouncedWrongOfferType,
    onChangeOffer,
    offer,
  } = useOffer();

  const clientSubmit = () => {
    if (canSubmitClient) {
      dispatch(connectionCreateClient(JSON.parse(atob(offer))));
    }
  };

  const showErrors = !debouncedCanSubmitClient && offer;

  return (
    <Container as="section" className="my-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">Введите приглашение сервера</Card.Title>
          <Card.Text className="pt-2" as="div">
            <Row className="mt-1">
              <Col>
                <Form onSubmit={clientSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      onChange={onChangeOffer}
                      value={offer}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button
                      variant="success"
                      className="me-2"
                      type="submit"
                      disabled={!canSubmitClient}
                    >
                      ОК
                    </Button>
                    <Link to="/" className="btn btn-primary btn-primary">
                      Назад
                    </Link>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Text>
          {showErrors && (
            <Card.Text className="text-danger mt-2 fst-italic">
              {debouncedWrongOfferType
                ? "Это не серверное приглашение"
                : "Неправильный формат приглашения"}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
