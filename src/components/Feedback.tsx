import React, { useContext, useState } from 'react';
import { Result, Button, Form, Rate, Row, Col, Typography, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import { GlobalStateContext } from '../state/GlobalState';
import { useParticipant, useLive } from '../hooks/useLive';
import InterviewInfo, { ContactDetails } from '../components/InterviewInfo';

import 'react-quill/dist/quill.snow.css';

// const onFinish = () => {
//   console.log('finished');
// };

export default function App() {
  const { data } = useLive();
  const { notes, role, setFeedbackScreen, setNotes } = useContext(GlobalStateContext);
  const [feedback, setFeedback] = useState<number | undefined>(undefined);
  useParticipant(notes, feedback);

  if (!data) return null;
  return (
    <div style={{ paddingLeft: 64, paddingRight: 64 }}>
      <Result
        icon={<SmileOutlined style={{ display: 'none' }} />}
        // status="success"
        title="You left the interview"
        subTitle="Please leave feedback below"
        extra={[
          <Button key="rejoin" onClick={() => setFeedbackScreen(false)}>
            Rejoin
          </Button>,
          // <Button key="buy">Buy Again</Button>,
        ]}
      />
      <Row gutter={64}>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>Feedback</Typography.Title>
          <div style={{ marginBottom: 24 }}>
            <span style={{ marginRight: 24 }}>Please rate {data.candidateName} as a match for your opportunity:</span>
            <Rate onChange={setFeedback} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <ReactQuill
              onChange={setNotes}
              key="feedback"
              defaultValue={notes}
              placeholder="Add any notes you would like to share here"
            />
          </div>
          {/* <Button style={{ marginRight: 8 }}>Share Interview</Button> */}
          <Button type="primary" disabled={!feedback} onClick={() => message.success('Feedback Saved')}>
            Submit Feedback
          </Button>
        </Col>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>Next Steps</Typography.Title>
          {data.followUpTime && <span> You have a follow up meeting scheduled for: {data.followUpTime} </span>}
          <Row style={{ marginTop: 24 }}>
            <ContactDetails data={data} />
          </Row>
        </Col>
      </Row>
      {/* <div style={{ height: 400, width: '30%' }}>
        <InterviewInfo />
      </div> */}
    </div>
  );
}