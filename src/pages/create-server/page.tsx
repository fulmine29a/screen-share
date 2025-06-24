import React from "react";
import { useAppSelector } from "../../shared/store/hooks";
import { connectionSlice } from "../../entities/connection/slice";
import { useStore } from "react-redux";
import { AppStore } from "../../app/store";
import { Button, Card, Container } from "react-bootstrap";

export const Page: React.FC = () => {
  const connectionStatus = useAppSelector(connectionSlice.selectors.status),
    store = useStore() as AppStore;

  console.assert(
    connectionStatus == "CANDIDATES_FOUND",
    `invalid status in CreateServerPage ${connectionStatus}`,
  );

  const offer = btoa(
    connectionSlice.selectors.localDescription(store.getState()) || "",
  );

  return (
    <Container as="section" className="my-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">Создание сервера</Card.Title>
          <Button
            className="my-3 me-2"
            size="sm"
            disabled={!navigator.clipboard}
            onClick={() => navigator.clipboard.writeText(offer)}
          >
            Копировать
          </Button>
          <Button
            size="sm"
            disabled={!navigator.share}
            onClick={() => {
              navigator.share({ text: offer });
            }}
          >
            Share
          </Button>
          <Card.Text>{offer}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};
