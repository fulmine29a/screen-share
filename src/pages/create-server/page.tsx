import React, { FormEventHandler, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks";
import { connectionSlice } from "../../entities/connection/slice";
import { useStore } from "react-redux";
import { AppStore } from "../../app/store";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useSdpInput } from "../../shared/sdp/use-sdp-input";
import { Link, useNavigate } from "react-router";
import { checkSessionDescription } from "../../shared/sdp/check-session-description";
import { connectionServerSetAnswer } from "../../features/connection/connection-server-set-answer";
import { ShareButtons } from "../../shared/share-buttons";
import { CONNECTING_PATH } from "../../app/router";

export const Page: React.FC = () => {
  const connectionStatus = useAppSelector(connectionSlice.selectors.status),
    store = useStore() as AppStore,
    dispatch = useAppDispatch(),
    navigate = useNavigate(),
    [submitted, setSubmitted] = useState(false);

  console.assert(
    connectionStatus == "CANDIDATES_FOUND",
    `invalid status in CreateServerPage ${connectionStatus}`,
  );

  const offer = btoa(
    JSON.stringify(
      connectionSlice.selectors.localDescription(store.getState()) || "",
    ),
  );

  const { sdp, showSdpErrors, onChangeSdp, debouncedWrongSdpType, pasteSdp } =
    useSdpInput("answer");

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    const formData = new FormData(e.currentTarget),
      answer = formData.get("answer") as string,
      { valid } = checkSessionDescription(answer, "answer");

    if (valid) {
      setSubmitted(true);

      dispatch(connectionServerSetAnswer(JSON.parse(atob(answer))));
      navigate(CONNECTING_PATH);
    }
    e.preventDefault();
  };

  return (
    <Container as="section" className="my-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">Создание сервера</Card.Title>
          <ShareButtons text={offer} />
          <Card.Text as="small" className="font-monospace text-secondary">
            {offer}
          </Card.Text>
          <Form onSubmit={submit}>
            <Form.Group className="mt-4 mb-3">
              <Form.Label className="fw-bold">Ответ клиента</Form.Label>
              <Form.Control
                as="textarea"
                className="font-monospace"
                rows={5}
                value={sdp}
                name="answer"
                onChange={onChangeSdp}
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
              <Button disabled={!navigator.clipboard} onClick={pasteSdp}>
                Вставить
              </Button>
              <Link to="/" className="btn btn-primary">
                Назад
              </Link>
            </Form.Group>
          </Form>
          {showSdpErrors && (
            <Card.Text className="text-danger mt-2 fst-italic">
              {debouncedWrongSdpType
                ? "Это не клиентский ответ"
                : "Неправильный формат приглашения"}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
