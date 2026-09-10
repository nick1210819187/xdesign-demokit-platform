import { useEffect, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  RocketOutlined,
  SendOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Segmented, Select, Space, Tag, Tooltip, Typography } from 'antd';
import type { Locale } from '../i18n';

type Mode = 'experience' | 'compare';
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const textModelText = {
  zh: {
    pageTitle: '文本模型',
    experience: '模型体验',
    compare: '模型对比',
    inferenceService: '推理服务',
    switchModel: '切换模型',
    run: '运行体验',
    more: '更多',
    close: '关闭',
    copy: '复制',
    app: '应用',
    clear: '清空',
    send: '发送',
    placeholder: '请输入消息...',
    hello: '你好',
    starter: '你好，我是文本模型体验助手。你可以在这里输入问题，也可以切换到模型对比查看不同模型的响应效果。',
    mockReply: '已收到问题。这里保留为 DemoKit 本地模拟响应，用于展示文本模型体验和对比页面结构。',
    modelA: '模型 A',
    modelB: '模型 B',
  },
  en: {
    pageTitle: 'Text Models',
    experience: 'Model Trial',
    compare: 'Model Compare',
    inferenceService: 'Inference Service',
    switchModel: 'Switch model',
    run: 'Run trial',
    more: 'More',
    close: 'Close',
    copy: 'Copy',
    app: 'Apps',
    clear: 'Clear',
    send: 'Send',
    placeholder: 'Type a message...',
    hello: 'Hello',
    starter: 'Hello, I am the text model trial assistant. Enter a question here, or switch to model compare to view responses side by side.',
    mockReply: 'Question received. This is a local DemoKit mock response for the text model trial and comparison layout.',
    modelA: 'Model A',
    modelB: 'Model B',
  },
};

type TextModelText = typeof textModelText.zh;

const modelOptions = [
  { value: 'deepseek-r1-671b', label: 'DeepSeek-R1-671B-昆仑' },
  { value: 'qwen3-32b', label: 'Qwen3-32B' },
  { value: 'deepseek-v3', label: 'DeepSeek-V3' },
  { value: 'ernie-lite', label: 'ERNIE Lite' },
];

const getStarterMessages = (locale: Locale): Message[] => [
  { role: 'user', content: textModelText[locale].hello },
  { role: 'assistant', content: textModelText[locale].starter },
];

function ModelPanel({ title, model, messages, text, onModelChange }: {
  title: string;
  model: string;
  messages: Message[];
  text: TextModelText;
  onModelChange: (value: string) => void;
}) {
  return (
    <Card
      className="text-model-panel"
      title={(
        <div className="text-model-panel-title">
          <Typography.Text type="secondary">{text.inferenceService}</Typography.Text>
          <Select value={model} onChange={onModelChange} options={modelOptions} variant="borderless" />
          <Tag color="blue">{title}</Tag>
        </div>
      )}
      extra={(
        <Space size={4}>
          <Tooltip title={text.switchModel}><Button type="text" size="small" icon={<SwapOutlined />} /></Tooltip>
          <Tooltip title={text.run}><Button type="text" size="small" icon={<RocketOutlined />} /></Tooltip>
          <Tooltip title={text.more}><Button type="text" size="small" icon={<MoreOutlined />} /></Tooltip>
          <Tooltip title={text.close}><Button type="text" size="small" icon={<CloseOutlined />} /></Tooltip>
        </Space>
      )}
    >
      <div className="text-model-message-list">
        {messages.map((message, index) => (
          <div className={`text-model-message ${message.role}`} key={`${message.role}-${index}`}>
            <div className="text-model-bubble">{message.content}</div>
            {message.role === 'assistant' ? (
              <Tooltip title={text.copy}>
                <Button type="text" size="small" icon={<CopyOutlined />} />
              </Tooltip>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TextModelPage({ locale = 'zh' }: { locale?: Locale }) {
  const text = textModelText[locale];
  const [mode, setMode] = useState<Mode>('compare');
  const [leftModel, setLeftModel] = useState(modelOptions[0].value);
  const [rightModel, setRightModel] = useState(modelOptions[1].value);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(getStarterMessages(locale));
  const panels = useMemo(() => mode === 'compare' ? [text.modelA, text.modelB] : [text.experience], [mode, text]);

  useEffect(() => {
    setMessages(getStarterMessages(locale));
  }, [locale]);

  const send = () => {
    const value = input.trim();
    if (!value) return;
    setMessages((items) => [
      ...items,
      { role: 'user', content: value },
      { role: 'assistant', content: text.mockReply },
    ]);
    setInput('');
  };

  return (
    <div className="workspace-page text-model-page">
      <div className="service-page-heading">
        <Typography.Title level={3}>{text.pageTitle}</Typography.Title>
      </div>

      <div className="text-model-content">
        <div className="text-model-modebar">
          <Segmented
            className="period-segmented"
            size="large"
            value={mode}
            onChange={(value) => setMode(value as Mode)}
            options={[
              { label: text.experience, value: 'experience' },
              { label: text.compare, value: 'compare' },
            ]}
          />
        </div>

        <div className={`text-model-chat-grid ${mode}`}>
          {panels.map((title, index) => (
            <ModelPanel
              key={title}
              title={title}
              model={index === 0 ? leftModel : rightModel}
              messages={messages}
              text={text}
              onModelChange={index === 0 ? setLeftModel : setRightModel}
            />
          ))}
        </div>

        <div className="text-model-composer">
          <Input.TextArea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={text.placeholder}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <div className="text-model-composer-footer">
            <Space size={8}>
              <Tooltip title={text.app}><Button type="text" icon={<AppstoreOutlined />} /></Tooltip>
              <Tooltip title={text.clear}><Button type="text" icon={<DeleteOutlined />} onClick={() => setMessages(getStarterMessages(locale))} /></Tooltip>
            </Space>
            <Button type="primary" icon={<SendOutlined />} disabled={!input.trim()} onClick={send}>
              {text.send}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
