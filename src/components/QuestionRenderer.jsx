// src/components/QuestionRenderer.jsx
import { useId } from 'react';
import { Form, Row, Col } from 'react-bootstrap';


export default function QuestionRenderer({ q, value, onChange }) {
    const uid = useId();


    if (q.type === 'text') {
        return (
            <Form.Group controlId={`txt-${uid}`}>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={q.placeholder || 'پاسخ خود را بنویسید...'}
                />
            </Form.Group>
        );
    }


    if (q.type === 'single') {
        return (
            <Form>
                {q.options.map(opt => (
                    <Form.Check
                        key={opt.value}
                        type="radio"
                        name={`rad-${uid}`}
                        id={`rad-${uid}-${opt.value}`}
                        label={opt.label}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className="mb-2"
                    />
                ))}
            </Form>
        );
    }


    if (q.type === 'multi') {
        const list = Array.isArray(value) ? value : [];
        const toggle = (v) => {
            if (list.includes(v)) onChange(list.filter(x => x !== v));
            else onChange([...list, v]);
        };
        return (
            <Row xs={1} sm={2} className="g-2">
                {q.options.map(opt => (
                <Col key={opt.value}>
                    <Form.Check
                    type="checkbox"
                    id={`chk-${uid}-${opt.value}`}
                    label={opt.label}
                    checked={list.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                    className="k-check k-box"   // ← بجای px-2 py-2 border rounded
                    />
                </Col>
                ))}
            </Row>
            );
    }
    if (q.type === 'rating') {
        const val = Number(value) || 0;
        return (
            <div className="d-flex gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => {
                    const v = i + 1;
                    const active = v <= val;
                    return (
                        <button
                            key={v}
                            type="button"
                            className={`btn ${active ? 'btn-warning' : 'btn-outline-secondary'}`}
                            onClick={() => onChange(v)}
                            aria-pressed={active}
                        >{v}</button>
                    );
                })}
            </div>
        );
    }


    return <p className="text-muted">نوع سوال پشتیبانی نشده است.</p>;
}