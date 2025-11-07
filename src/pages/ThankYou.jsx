// src/pages/ThankYou.jsx
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadState, clearState } from '../utils/storage.js';
import questions from '../data/questions.js';
import { AnimatePresence, motion } from 'framer-motion';


const reason = loadState('rvsa-finish-reason') ?? 'submitted';

export default function ThankYou() {
  const nav = useNavigate();
  const raw = useMemo(() => loadState('rvsa-answers-final') ?? {}, []);
  const [copied, setCopied] = useState(false);

  const rows = useMemo(() => {
    return questions.map((q, i) => {
      const val = raw[q.id];

      if (q.type === 'rating') {
        const n = Number(val) || 0;
        const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
        return { no: i + 1, title: q.title, content: (<span aria-label={`${n} از 5`}>{stars} <small className="text-muted">({n}/5)</small></span>) };
      }

      if (q.type === 'single') {
        const label = q.options?.find(o => o.value === val)?.label ?? String(val ?? '—');
        return { no: i + 1, title: q.title, content: <Badge bg="secondary">{label}</Badge> };
      }

      if (q.type === 'multi') {
        const vals = Array.isArray(val) ? val : [];
        const labels = vals.map(v => q.options?.find(o => o.value === v)?.label ?? v);
        return {
          no: i + 1, title: q.title, content: (
            <div className="d-flex flex-wrap gap-2">
              {labels.length ? labels.map(l => <Badge key={l} bg="info" className="px-2 py-1">{l}</Badge>) : <span className="text-muted">—</span>}
            </div>
          )
        };
      }

      // text or fallback
      return { no: i + 1, title: q.title, content: <span>{val?.toString() || <span className="text-muted">—</span>}</span> };
    });
  }, [raw]);

  const json = useMemo(() => JSON.stringify(raw, null, 2), [raw]);

  function restart() {
    clearState('rvsa-index');
    clearState('rvsa-answers');
    clearState('rvsa-answers-final');
    clearState('rvsa-deadline');
    clearState('rvsa-finish-reason');
    nav('/');
  }

  function logToConsole() {
    console.group('=== Survey Submission ===');
    questions.forEach(q => {
      console.log(`${q.title}:`, raw[q.id]);
    });
    console.groupEnd();
  }

  function copyJSON() {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(json).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 1200);
  }

  function downloadJSON() {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'survey-answers.json'; a.click();
    URL.revokeObjectURL(url);
  }

  const hasAnswers = Object.keys(raw).length > 0;


  return (
    <div className="survey-root py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={9} lg={8} xl={7}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="display-6 mb-2">✅</div>
                  <h1 className="h4 mb-1">
                    {reason === 'timeout' ? 'زمان شما به پایان رسید.' : 'با تشکر! پاسخ‌های شما ثبت شد.'}
                  </h1>
                  <p className="text-muted">
                    {reason === 'timeout'
                      ? 'مهلت ۲ دقیقه‌ای تمام شد؛ پاسخ‌های ثبت‌شده تا این لحظه نگه داشته شدند.'
                      : 'مرور خلاصهٔ پاسخ‌ها در پایین آمده است.'}
                  </p>

                  {hasAnswers ? (
                    <>
                      <div className="text-end">
                        <Table responsive hover className="mb-3 align-middle">
                          <thead>
                            <tr>
                              <th style={{ width: 64 }}>#</th>
                              <th>سؤال</th>
                              <th>پاسخ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map(r => (
                              <tr key={r.no}>
                                <td className="text-muted">{r.no}</td>
                                <td>{r.title}</td>
                                <td>{r.content}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="primary" onClick={restart}>شروع مجدد</Button>
                        <Button variant="outline-secondary" onClick={copyJSON}>
                          {copied ? 'کپی شد!' : 'کپی JSON'}
                        </Button>
                        <Button variant="outline-secondary" onClick={downloadJSON}>دانلود JSON</Button>
                        <Button variant="outline-secondary" onClick={() => window.print()}>پرینت</Button>
                        <Button variant="outline-secondary" onClick={(logToConsole)}>
                          نمایش در کنسول
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-muted">پاسخی برای نمایش یافت نشد.</p>
                      <Button variant="primary" onClick={restart}>بازگشت به فرم</Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
