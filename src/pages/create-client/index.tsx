import React, { FormEventHandler, useEffect, useState } from "react";
import { useAppDispatch } from "../../shared/store/hooks";
import { useOffer } from "./useOffer";
import { checkOffer } from "./checkOffer";
import { connectionCreateClient } from "../../features/connection/connection-create-client";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { appRestart } from "../../features/app";

export const CreateClientPage: React.FC = () => {
  const dispatch = useAppDispatch(),
    navigate = useNavigate(),
    [submitted, setSubmitted] = useState(false);

  const {
    debouncedCanSubmitClient,
    debouncedWrongOfferType,
    onChangeOffer,
    offer,
  } = useOffer();

  useEffect(() => {
    dispatch(appRestart());
  }, []);

  const clientSubmit: FormEventHandler = (e) => {
    const { canSubmitClient } = checkOffer(offer);

    if (canSubmitClient) {
      setSubmitted(true);

      dispatch(connectionCreateClient(JSON.parse(atob(offer))));
      navigate("/show-answer");
    }
    e.preventDefault();
  };

  const showErrors = !debouncedCanSubmitClient && !!offer;

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
                      disabled={submitted}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button
                      variant="success"
                      className="me-2"
                      type="submit"
                      disabled={showErrors || submitted}
                    >
                      ОК
                    </Button>
                    <Link to="/" className="btn btn-primary">
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
