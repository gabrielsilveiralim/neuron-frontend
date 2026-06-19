import { useState } from 'react';
import { Layout } from './components/Layout';
import { Chat } from './components/Chat';
import { Ingest } from './components/Ingest';

type Tab = 'chat' | 'ingest';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'chat' ? <Chat /> : <Ingest />}
    </Layout>
  );
}