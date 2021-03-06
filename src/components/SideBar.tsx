import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useCandidate } from '../hooks/useLive';
import { styled, Theme } from '@material-ui/core/styles';

const { TabPane } = Tabs;

const Container = styled('aside')(({ theme }: { theme: Theme }) => ({
  background: 'rgb(79, 83, 85)',
  gridArea: '1 / 3 / 3 / 4',
  [theme.breakpoints.down('lg')]: {
    gridArea: '1 / 3 / 3 / 4',
  },
}));

const SideBar = () => {
  const { data } = useCandidate();

  return (
    <Container>
      <Documents candidateData={data}></Documents>
    </Container>
  );
};
interface DocumentsProps {
  candidateData: CandidateData;
}

interface CandidateData {
  files: File[];
  email: string;
}

interface File {
  name: string;
  uid: string;
}
const Documents = ({ candidateData }: DocumentsProps) => {
  if (candidateData?.files.length < 2) {
    const [file] = candidateData?.files;
    return (
      <ShowFile
        header={false}
        url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`}
      />
    );
  }
  return (
    <Tabs style={{ padding: 24, color: 'white' }} defaultActiveKey="0">
      {candidateData.files.map((file: File, i: number) => (
        <TabPane tab={file.name} key={i.toLocaleString() + 1}>
          <ShowFile
            header={true}
            url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};
const ShowFile = ({ url, header }: any) => <IframeGoogleDoc header={header} url={url} />;

interface IframeGoogleDocsProps {
  url: string;
  header: boolean;
}

export function IframeGoogleDoc({ url, header }: IframeGoogleDocsProps) {
  const [iframeTimeoutId, setIframeTimeoutId] = useState<any>();
  const iframeRef: any = useRef(null);

  const getIframeLink = useCallback(() => {
    return `https://docs.google.com/gview?url=${url}&embedded=true`;
  }, [url]);

  const updateIframeSrc = useCallback(() => {
    if (iframeRef.current) {
      iframeRef!.current!.src = getIframeLink();
    }
  }, [getIframeLink]);

  useEffect(() => {
    const intervalId = setInterval(updateIframeSrc, 1000 * 20);
    setIframeTimeoutId(intervalId);
  }, [updateIframeSrc]);

  function iframeLoaded() {
    clearInterval(iframeTimeoutId);
  }

  return (
    <iframe
      title="Candidate Document"
      onLoad={iframeLoaded}
      onError={updateIframeSrc}
      ref={iframeRef}
      style={{ width: '100%', height: header ? 'calc(100vh - (72px + 24px + 46px + 12px))' : 'calc(100vh - (72px))' }}
      src={getIframeLink()}
    />
  );
}

export default SideBar;
