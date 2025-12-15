import React, { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useAppSelector } from "../shared/store/hooks";
import { connectionSlice } from "../entities/connection/slice";
import { useNavigate } from "react-router";
import { FullScreenLoader } from "../widgets/streams/full-screen-loader";
import { CREATE_CLIENT_PATH } from "../app/router";
import { ShareButtons } from "../shared/share-buttons";

export const ShowAnswerPage: React.FC = () => {
  const status = useAppSelector(connectionSlice.selectors.status),
    role = useAppSelector(connectionSlice.selectors.role),
    navigate = useNavigate(),
    answer = useAppSelector(connectionSlice.selectors.localDescription);

  useEffect(() => {
    if (
      role != "CLIENT" ||
      !["SEARCH_FOR_CANDIDATES", "CANDIDATES_FOUND"].includes(status)
    ) {
      navigate(CREATE_CLIENT_PATH);
    }
  }, []);

  if (role != "CLIENT") {
    return null;
  }

  if (status == "SEARCH_FOR_CANDIDATES") {
    return <FullScreenLoader />;
  }

  if (status == "CANDIDATES_FOUND") {
    const encodedAnswer = btoa(JSON.stringify(answer));

    return (
      <Container as="section" className="my-5">
        <Card>
          <Card.Body>
            <Card.Title as="h1">Ответ клиента</Card.Title>
            <ShareButtons text={encodedAnswer} />
            <Card.Text
              className="pt-2 font-monospace text-secondary"
              as="small"
            >
              {encodedAnswer}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return null;
};
