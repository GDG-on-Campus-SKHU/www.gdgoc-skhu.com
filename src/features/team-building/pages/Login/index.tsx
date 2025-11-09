/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const [showDone, setShowDone] = useState(false);
    const [modalType, setModalType] = useState<'pending' | 'banned' | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        setTimeout(() => setVisible(true), 30);
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (email.includes('pending')) {
            setModalType('pending');
            setShowDone(true);
        } else if (email.includes('banned')) {
            setModalType('banned');
            setShowDone(true);
        } else if (email === '1234@gmail.com' && password === '1234') {
            router.push('/home');
        } else {
            setError('이메일 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <main
            css={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(22px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
        >
            <form
                onSubmit={handleSubmit}
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '455px',
                    minHeight: '406px',
                    padding: '40px',
                    borderRadius: '12px',
                    background: '#fff',
                    boxShadow: '0 0 30px rgba(0,0,0,0.05)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
            >
                <h1
                    css={{
                        fontFamily: 'Pretendard, system-ui, -apple-system, sans-serif',
                        fontSize: '34px',
                        fontWeight: 700,
                        lineHeight: '160%',
                        color: '#040405',
                        marginBottom: '28px',
                        textAlign: 'center',
                    }}
                >
                    로그인
                </h1>

                <div css={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        css={{
                            width: '100%',
                            height: '50px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1.5px solid ${error ? '#bcbcbc' : '#C3C6CB'}`,
                            fontSize: '16px',
                            color: '#333',
                            transition: 'all 0.2s ease',
                            '&:focus': {
                                outline: 'none',
                                borderColor: error ? '#bcbcbc' : '#4285F4',
                                boxShadow: `0 0 0 2px ${
                                    error ? 'rgba(213,213,213,0.2)' : 'rgba(66,133,244,0.2)'
                                }`,
                            },
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        css={{
                            width: '100%',
                            height: '50px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1.5px solid ${error ? '#bcbcbc' : '#C3C6CB'}`,
                            fontSize: '16px',
                            color: '#333',
                            transition: 'all 0.2s ease',
                            '&:focus': {
                                outline: 'none',
                                borderColor: error ? '#bcbcbc' : '#4285F4',
                                boxShadow: `0 0 0 2px ${
                                    error ? 'rgba(213,213,213,0.2)' : 'rgba(66,133,244,0.2)'
                                }`,
                            },
                        }}
                    />
                    <p
                        css={{
                            color: '#ea4335',
                            fontSize: '14px',
                            marginTop: '8px',
                            visibility: error ? 'visible' : 'hidden',
                        }}
                    >
                        {error}
                    </p>
                </div>

                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '100%',
                        marginTop: '36px',
                    }}
                >
                    <button
                        type="submit"
                        css={{
                            width: '100%',
                            height: '50px',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#4285f4',
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            '&:hover': { background: '#3b78e0' },
                        }}
                    >
                        로그인
                    </button>

                    <Link
                        href="/signup"
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50px',
                            borderRadius: '8px',
                            border: '1px solid #c3c6cb',
                            background: '#fff',
                            color: '#4285f4',
                            fontWeight: 500,
                            fontSize: '18px',
                            textDecoration: 'none',
                            '&:hover': { background: '#f5f8ff' },
                        }}
                    >
                        회원가입
                    </Link>
                </div>
            </form>

            {showDone && (
                <div
                    css={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        css={{
                            background: '#fff',
                            borderRadius: '16px',
                            width: '380px',
                            padding: '36px 28px 32px',
                            textAlign: 'center',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            animation: 'fadeIn 0.25s ease',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(12px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <h2
                            css={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#111',
                                marginBottom: '20px',
                            }}
                        >
                            {modalType === 'pending' ? '승인 대기 중' : '로그인 제한'}
                        </h2>
                        <p
                            css={{
                                fontSize: '15px',
                                color: '#555',
                                lineHeight: 1.6,
                                marginBottom: '20px',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {modalType === 'pending'
                                ? '아직 관리자의 승인이 되지 않았습니다.\n관리자의 승인 후 로그인 가능합니다.'
                                : '현재 로그인이 제한된 계정입니다.\n관리자에게 문의해주세요.'}
                        </p>
                        {modalType === 'banned' && (
                            <p css={{ fontSize: '14px', color: '#666', marginBottom: '26px' }}>
                                gdsc@gmail.com
                            </p>
                        )}
                        <button
                            onClick={() => setShowDone(false)}
                            css={{
                                width: '100%',
                                height: '46px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#4285f4',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                '&:hover': { backgroundColor: '#3367d6' },
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
