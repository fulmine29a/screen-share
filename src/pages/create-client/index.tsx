import React, { FormEventHandler, useEffect, useState } from "react";
import { useAppDispatch } from "../../shared/store/hooks";
import { useSdpInput } from "../../shared/sdp/use-sdp-input";
import { checkSessionDescription } from "../../shared/sdp/check-session-description";
import { connectionCreateClient } from "../../features/connection/connection-create-client";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { appRestart } from "../../features/app";
import { SHOW_ANSWER_PATH } from "../../app/routes";

export const CreateClientPage: React.FC = () => {
  const dispatch = useAppDispatch(),
    navigate = useNavigate(),
    [submitted, setSubmitted] = useState(false);

  const { debouncedWrongSdpType, onChangeSdp, sdp, showSdpErrors, pasteSdp } =
    useSdpInput("offer");

  useEffect(() => {
    dispatch(appRestart());
  }, []);

  const clientSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget),
      offer = formData.get("offer") as string,
      { valid } = checkSessionDescription(offer, "offer");

    if (valid) {
      setSubmitted(true);

      dispatch(connectionCreateClient(JSON.parse(atob(offer)))).then(() => {
        navigate(SHOW_ANSWER_PATH);
      });
    }
  };

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
                      onChange={onChangeSdp}
                      value={sdp}
                      name="offer"
                      disabled={submitted}
                    />
                  </Form.Group>
                  <Form.Group className="d-flex gap-2">
                    <Button
                      variant="success"
                      type="submit"
                      disabled={showSdpErrors || submitted}
                    >
                      ОК
                    </Button>
                    <Button
                      onClick={() => {
                        pasteSdp();
                      }}
                    >
                      Вставить
                    </Button>
                    <Link to="/" className="btn btn-primary">
                      Назад
                    </Link>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Text>
          {showSdpErrors && (
            <Card.Text className="text-danger mt-2 fst-italic">
              {debouncedWrongSdpType
                ? "Это не серверное приглашение"
                : "Неправильный формат приглашения"}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
