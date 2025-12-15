import React from "react";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router";
import { CREATE_CLIENT_PATH, CREATE_SERVER_PATH } from "../app/router";

export const StartPage: React.FC = () => {
  return (
    <Container as="section" className="my-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">Выберите свой гендер</Card.Title>
          <Card.Text className="pt-2" as="div">
            <Link
              className="btn btn-primary btn-primary btn-lg w-100 mb-2"
              to={CREATE_SERVER_PATH}
            >
              Сервер
            </Link>
            <Link
              className="btn btn-primary btn-primary btn-lg w-100 mb-2"
              to={CREATE_CLIENT_PATH}
            >
              Клиент
            </Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};
