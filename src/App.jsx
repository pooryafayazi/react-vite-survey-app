// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import QuestionRenderer from './components/QuestionRenderer.jsx';
import questions from './data/questions.js';
import { loadState, saveState, clearState } from './utils/storage.js';


const LIMIT_MS = 2 * 60 * 1000; // 2 دقیقه

function formatMs(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}



export default function App() {
  // deadline را فقط اولین‌بار می‌سازیم و در storage ذخیره می‌کنیم
  const [deadline, setDeadline] = useState(() => loadState('rvsa-deadline'));
  useEffect(() => {
    if (!deadline) {
      const t = Date.now() + LIMIT_MS;
      setDeadline(t);
      saveState('rvsa-deadline', t);
    }
  }, [deadline]);

  // باقی‌ماندهٔ زمان (هر ثانیه به‌روزرسانی)
  const [left, setLeft] = useState(() => {
    const d = loadState('rvsa-deadline');
    return d ? Math.max(0, d - Date.now()) : LIMIT_MS;
  });

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => {
      setLeft(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  // اگر زمان تمام شد → ذخیرهٔ وضعیت و رفتن به صفحهٔ تشکر با پیام اتمام زمان
  useEffect(() => {
    if (left <= 0 && deadline) {
      saveState('rvsa-finish-reason', 'timeout');
      saveState('rvsa-answers-final', answers);
      // deadline را عمداً پاک نمی‌کنیم تا با رفرش هم پیام باقی بماند
      nav('/thanks', { replace: true });
    }
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  const nav = useNavigate();
  const steps = useMemo(() => questions, []);


  const [index, setIndex] = useState(() => loadState('rvsa-index') ?? 0);
  const [answers, setAnswers] = useState(() => loadState('rvsa-answers') ?? {});


  const total = steps.length;
  const current = steps[index];


  useEffect(() => { saveState('rvsa-index', index); }, [index]);
  useEffect(() => { saveState('rvsa-answers', answers); }, [answers]);


  function onChange(val) {
    setAnswers(prev => ({ ...prev, [current.id]: val }));
  }


  function isValid() {
    const val = answers[current.id];
    if (current.type === 'text') return typeof val === 'string' && val.trim().length > 0;
    if (current.type === 'single') return !!val;
    if (current.type === 'multi') return Array.isArray(val) && val.length > 0;
    if (current.type === 'rating') return Number(val) > 0;
    return true;
  }

  function next() {
    if (index < total - 1) setIndex(i => i + 1);
    else submit();
  }


  function prev() {
    if (index > 0) setIndex(i => i - 1);
  }


  function submit() {
    clearState('rvsa-index');
    // keep answers in storage so ThankYou can show summary if needed
    saveState('rvsa-answers-final', answers);
    saveState('rvsa-finish-reason', 'submitted');
    nav('/thanks');
  }


  const progress = Math.round(((index) / total) * 100);


  return (
    <div className="survey-root py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7} xl={6}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="h4 m-0">فرم نظرسنجی</h1>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="primary" pill>{index + 1}/{total}</Badge>
                <Badge
                  bg={left <= 15000 ? 'danger' : left <= 45000 ? 'warning' : 'secondary'}
                  title="زمان باقی‌مانده">
                  {formatMs(left)}
                </Badge>
              </div>
            </div>
            <ProgressBar now={progress} className="mb-3" aria-label="پیشرفت" />


            <Card className="shadow-sm border-0">
              <Card.Body>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="h5 mb-3">{current.title}</h2>
                    {current.help && <p className="text-muted small mb-4">{current.help}</p>}


                    <QuestionRenderer q={current} value={answers[current.id]} onChange={onChange} />


                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={prev} disabled={index === 0}>قبلی</Button>
                      <Button variant="primary" onClick={next} disabled={!isValid()}>
                        {index === total - 1 ? 'ارسال' : 'بعدی'}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Card.Body>
            </Card>


            <p className="text-center text-muted small mt-3 mb-0">فرم نظرسنجی • طراحی با Bootstrap</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}