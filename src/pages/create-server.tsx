import React from "react";
import { Card, Container } from "react-bootstrap";

export const createServerPage: React.FC = () => {
  return (
    <Container as="section" className="my-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">Создание сервера</Card.Title>
        </Card.Body>
      </Card>
    </Container>
  );
};
