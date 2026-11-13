/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Frame,
  Instagram,
  Layout,
  Menu,
  MessageCircle,
  Palette,
  PenTool,
  Send,
  X,
} from 'lucide-react';

const TOKEN = '9197460965:AAGBBJuUDXxFjzI93qu3PcagYIqBYeefys8';
const CHAT_ID = '8240711170';

interface WorkItem {
  id: string;
  index: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WORKS: WorkItem[] = [
  {
    id: 'skryptonit-poster',
    index: '01',
    category: 'Постер',
    title: 'Постер на концерт Скриптонита',
    subtitle: 'Астана · Congress Center · Концертная графика',
    image: '/assets/aistudio/photo_5445266242496305742_y_5b3821a1.jpg',
  },
  {
    id: 'theater-poster',
    index: '02',
    category: 'Афиша',
    title: 'Афиша на Театральное выступление',
    subtitle: 'Контрастная композиция · Театральная сцена',
    image: '/assets/aistudio/______________1__52a92e35.jpe',
  },
  {
    id: 'dog-show-poster',
    index: '03',
    category: 'Афиша',
    title: 'Афиша на выставку собак',
    subtitle: 'Журнальная вёрстка · Редакционный стиль',
    image: '/assets/aistudio/Dalmatian__photo__photography__dogue_332b946e.jpe',
  },
  {
    id: 'dog-illustration',
    index: '04',
    category: 'Иллюстрация',
    title: 'Иллюстрация о собаках',
    subtitle: 'Растровая графика · Типографика и принт',
    image: '/assets/aistudio/_____________788f4718.jpe',
  },
];

const SERVICES: ServiceItem[] = [
  {
    id: 'logos',
    title: 'Логотипы',
    description:
      'Создаю выразительные и чистые знаки, которые легко запоминаются и гармонично смотрятся на любом носителе.',
    icon: PenTool,
  },
  {
    id: 'illustrations',
    title: 'Иллюстрации',
    description:
      'Рисую тёплые и характерные графические иллюстрации для принтов, открыток, социальных сетей и проектов.',
    icon: Palette,
  },
  {
    id: 'posters',
    title: 'Постеры',
    description:
      'Разрабатываю постеры и афиши для концертов, спектаклей, выставок и локальных событий с акцентом на ритм и шрифт.',
    icon: Frame,
  },
  {
    id: 'websites',
    title: 'Сайты',
    description:
      'Проектирую аккуратные сайты-визитки и лендинги, где уютная эстетика сочетается с удобством для посетителей.',
    icon: Layout,
  },
];

const NAV_LINKS = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Работы', href: '#works' },
  { label: 'Услуги', href: '#services' },
  { label: 'Контакты', href: '#contact' },
];

function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#CBE5FA]/40 p-6 text-center">
        <Frame className="mb-3 h-8 w-8 text-[#0B1CF0]" />
        <p className="font-heading text-lg font-medium text-black">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackText, setFeedbackText] = useState('');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setMessage((prev) =>
      prev.trim() ? prev : `Здравствуйте! Хочу обсудить заказ: ${serviceTitle.toLowerCase()}.`
    );
    scrollToSection('contact');
  };

  useEffect(() => {
    if (activeWorkIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveWorkIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveWorkIndex((prev) => (prev === null ? null : (prev + 1) % WORKS.length));
      } else if (e.key === 'ArrowLeft') {
        setActiveWorkIndex((prev) =>
          prev === null ? null : (prev - 1 + WORKS.length) % WORKS.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeWorkIndex]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedContact) {
      setStatus('error');
      setFeedbackText('Пожалуйста, заполните обязательные поля: имя и контакт.');
      return;
    }

    setStatus('submitting');
    setFeedbackText('');

    const now = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const telegramText = [
      '📩 Новая заявка с сайта',
      '',
      `Имя: ${trimmedName}`,
      `Контакт: ${trimmedContact}`,
      `Сообщение: ${trimmedMessage || 'Без дополнительного сообщения'}`,
      `Дата и время: ${now}`,
    ].join('\n');

    try {
      const response = await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
        method: 'POST',
        body: new URLSearchParams({
          chat_id: CHAT_ID,
          text: telegramText,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || (result && result.ok === false)) {
        throw new Error('Telegram API request failed');
      }

      setStatus('success');
      setFeedbackText('Спасибо! Я скоро отвечу');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setStatus('error');
      setFeedbackText(
        'Не удалось отправить сообщение. Пожалуйста, попробуйте ещё раз или напишите в Telegram @zayavkiMor_bot.'
      );
    }
  };

  const activeWork = activeWorkIndex !== null ? WORKS[activeWorkIndex] : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-black">
        {/* Top Bar (3-zone contract) */}
        <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
            <a
              href="#top"
              className="font-heading shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight text-black transition-colors duration-200 hover:text-[#0B1CF0]"
            >
              Гаухар Одабай
            </a>

            <nav
              aria-label="Основная навигация"
              className="hidden items-center gap-7 text-sm font-medium text-black/75 md:flex"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="shrink-0 whitespace-nowrap underline-offset-4 transition-colors duration-200 hover:text-[#0B1CF0] hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="hidden min-h-[40px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl bg-[#0B1CF0] px-5 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-200 hover:bg-[#0916C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1CF0] sm:inline-flex"
              >
                Написать мне
              </button>

              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-black/10 text-black transition-colors duration-200 hover:bg-[#CBE5FA]/50 md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="border-t border-black/8 bg-white px-4 py-4 md:hidden"
              >
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-black transition-colors hover:bg-[#CBE5FA]/40"
                    >
                      {link.label}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-xl bg-[#0B1CF0] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0916C7]"
                  >
                    Написать мне
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main id="top">
          {/* 1) Hero Section */}
          <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <p className="mb-4 text-sm font-medium text-black/65">
                  Графический дизайнер <span aria-hidden="true">·</span> Астана
                </p>

                <h1 className="font-heading text-5xl leading-[1.02] font-bold tracking-tight text-balance text-black sm:text-6xl lg:text-7xl">
                  Гаухар Одабай
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed font-medium text-black/85 sm:text-xl">
                  Делаю постеры, афиши и логотипы
                </p>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-black/65 sm:text-base">
                  Минимализм, аккуратная типографика и уютное настроение в каждом проекте — от
                  концертных плакатов до тёплых иллюстраций.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[#0B1CF0] px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0916C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1CF0]"
                  >
                    Написать мне
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                  <a
                    href="#works"
                    className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-2xl border border-black/15 px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:border-[#0B1CF0] hover:bg-[#CBE5FA]/35"
                  >
                    Смотреть работы
                  </a>
                </div>
              </div>

              {/* Hero Visual Showcase using attached photos */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl bg-[#CBE5FA]/55 p-4 sm:p-6">
                  <div className="grid grid-cols-12 items-end gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveWorkIndex(0)}
                      aria-label="Открыть постер на концерт Скриптонита"
                      className="group col-span-8 cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1CF0]"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden">
                        <ImageWithFallback
                          src={WORKS[0].image}
                          alt={WORKS[0].title}
                          fallbackTitle={WORKS[0].title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    </button>

                    <div className="col-span-4 flex flex-col gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveWorkIndex(2)}
                        aria-label="Открыть афишу на выставку собак"
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1CF0]"
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden">
                          <ImageWithFallback
                            src={WORKS[2].image}
                            alt={WORKS[2].title}
                            fallbackTitle={WORKS[2].title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveWorkIndex(3)}
                        aria-label="Открыть иллюстрацию о собаках"
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1CF0]"
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden">
                          <ImageWithFallback
                            src={WORKS[3].image}
                            alt={WORKS[3].title}
                            fallbackTitle={WORKS[3].title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2) About Me Section */}
          <section id="about" className="border-t border-black/8 py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl bg-[#CBE5FA]/35 p-6 sm:p-10 lg:p-14"
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-4">
                    <h2 className="font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                      Обо мне
                    </h2>
                    <p className="mt-3 text-sm text-black/65">
                      Колледж ITSTEP <span aria-hidden="true">·</span> 2 курс дизайна
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <p className="text-lg leading-relaxed font-medium text-black sm:text-xl">
                      Я студентка 2 курса дизайна, из колледжа itstep. Создаю работу для портфолио,
                      и ради помощи людям/частным лица/организациям.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-6 border-t border-black/10 pt-6 sm:grid-cols-3">
                      <div>
                        <p className="font-heading text-xl font-semibold text-black">Астана</p>
                        <p className="mt-1 text-xs text-black/65">Локальные и удалённые проекты</p>
                      </div>
                      <div>
                        <p className="font-heading text-xl font-semibold text-black">
                          Постеры и лого
                        </p>
                        <p className="mt-1 text-xs text-black/65">Печатная и цифровая графика</p>
                      </div>
                      <div>
                        <p className="font-heading text-xl font-semibold text-black">
                          С душой и уютом
                        </p>
                        <p className="mt-1 text-xs text-black/65">
                          Внимание к деталям и задачам клиента
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3) My Works Section */}
          <section id="works" className="border-t border-black/8 py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Мои работы
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-black/65 sm:text-base">
                    Подборка постеров, афиш и иллюстраций. Нажмите на любую работу, чтобы рассмотреть
                    детали ближе.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {WORKS.map((work, idx) => (
                  <motion.article
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveWorkIndex(idx)}
                      className="cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1CF0]"
                    >
                      <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#CBE5FA]/20 transition-all duration-200 group-hover:border-[#0B1CF0]/40 group-hover:bg-[#CBE5FA]/45">
                        <div className="aspect-[3/4] w-full overflow-hidden">
                          <ImageWithFallback
                            src={work.image}
                            alt={work.title}
                            fallbackTitle={work.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-medium text-black/55 tabular-nums">
                          {work.index} <span aria-hidden="true">·</span> {work.category}
                        </p>
                        <h3 className="font-heading mt-1 text-xl font-semibold text-black transition-colors duration-200 group-hover:text-[#0B1CF0]">
                          {work.title}
                        </h3>
                      </div>
                    </button>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 4) Services Section */}
          <section id="services" className="border-t border-black/8 py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 max-w-xl">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                  Услуги
                </h2>
                <p className="mt-2 text-sm text-black/65 sm:text-base">
                  Помогаю частным заказчикам и организациям оформить идеи в понятный и красивый
                  визуал.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.4,
                        delay: idx * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#0B1CF0]/35 hover:bg-[#CBE5FA]/20"
                    >
                      <div>
                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#CBE5FA] text-[#0B1CF0]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="font-heading text-2xl font-semibold text-black">
                          {service.title}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-black/70">
                          {service.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectService(service.title)}
                        className="mt-6 inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 self-start text-xs font-semibold text-[#0B1CF0] underline-offset-4 transition-colors hover:underline"
                      >
                        Обсудить проект
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5) Contact Form Section */}
          <section id="contact" className="border-t border-black/8 py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12"
              >
                <div className="lg:col-span-5">
                  <h2 className="font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Напишите мне
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-black/70 sm:text-base">
                    Если вам нужен постер, афиша, логотип, иллюстрация или уютный сайт-визитка —
                    оставьте заявку. Сообщение сразу придёт ко мне в Telegram.
                  </p>

                  <div className="mt-8 space-y-4 border-t border-black/10 pt-6">
                    <a
                      href="https://t.me/zayavkiMor_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center gap-3 text-sm font-medium text-black transition-colors hover:text-[#0B1CF0]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#CBE5FA] text-[#0B1CF0]">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <span>Telegram: zayavkiMor_bot</span>
                    </a>

                    <a
                      href="https://instagram.com/Ddarkksouls"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center gap-3 text-sm font-medium text-black transition-colors hover:text-[#0B1CF0]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#CBE5FA] text-[#0B1CF0]">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <span>Instagram: Ddarkksouls</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="rounded-3xl border border-[#CBE5FA] bg-[#CBE5FA]/25 p-6 sm:p-8"
                  >
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-2 block text-sm font-semibold text-black"
                        >
                          Имя <span className="text-[#0B1CF0]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Как вас зовут?"
                          className="min-h-[48px] w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-[#0B1CF0] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-info"
                          className="mb-2 block text-sm font-semibold text-black"
                        >
                          Телефон или Telegram <span className="text-[#0B1CF0]">*</span>
                        </label>
                        <input
                          id="contact-info"
                          name="contact"
                          type="text"
                          required
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="+7 700 000 00 00 или @username"
                          className="min-h-[48px] w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-[#0B1CF0] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="mb-2 block text-sm font-semibold text-black"
                        >
                          Сообщение
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Расскажите о вашей идее, сроках или формате работы..."
                          className="w-full resize-y rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-[#0B1CF0] focus:outline-none"
                        />
                      </div>

                      {status === 'success' && (
                        <div
                          role="status"
                          className="flex items-start gap-2.5 rounded-xl border border-emerald-700/20 bg-white px-4 py-3 text-sm font-medium text-emerald-800"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                          <span>{feedbackText}</span>
                        </div>
                      )}

                      {status === 'error' && (
                        <div
                          role="alert"
                          className="flex items-start gap-2.5 rounded-xl border border-red-600/25 bg-white px-4 py-3 text-sm font-medium text-red-700"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                          <span>{feedbackText}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0B1CF0] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0916C7] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <Send className="h-4 w-4" />
                        {status === 'submitting' ? 'Отправка...' : 'Отправить'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* 6) Footer */}
        <footer className="border-t border-black/10 bg-white py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <p className="font-heading text-lg font-semibold text-black">Гаухар Одабай</p>
              <p className="mt-1 text-xs text-black/60">
                Графический дизайнер <span aria-hidden="true">·</span> Астана{' '}
                <span aria-hidden="true">·</span> © 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-black">
              <a
                href="https://instagram.com/Ddarkksouls"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 transition-colors hover:text-[#0B1CF0]"
              >
                <Instagram className="h-4 w-4 text-[#0B1CF0]" />
                <span>Instagram: Ddarkksouls</span>
              </a>

              <a
                href="https://t.me/zayavkiMor_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 transition-colors hover:text-[#0B1CF0]"
              >
                <MessageCircle className="h-4 w-4 text-[#0B1CF0]" />
                <span>Telegram: zayavkiMor_bot</span>
              </a>
            </div>
          </div>
        </footer>

        {/* Lightbox Modal for Works */}
        <AnimatePresence>
          {activeWork && activeWorkIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label={activeWork.title}
              onClick={() => setActiveWorkIndex(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white p-4 sm:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-black/55 tabular-nums">
                      {activeWork.index} <span aria-hidden="true">·</span> {activeWork.category}{' '}
                      <span aria-hidden="true">·</span> {activeWork.subtitle}
                    </p>
                    <h3 className="font-heading mt-1 text-2xl font-semibold text-black">
                      {activeWork.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="Закрыть просмотр"
                    onClick={() => setActiveWorkIndex(null)}
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-black/10 text-black transition-colors hover:bg-[#CBE5FA]/50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#CBE5FA]/20 p-2 sm:p-4">
                  <ImageWithFallback
                    src={activeWork.image}
                    alt={activeWork.title}
                    fallbackTitle={activeWork.title}
                    className="max-h-[65vh] w-auto rounded-xl object-contain"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveWorkIndex((activeWorkIndex - 1 + WORKS.length) % WORKS.length)
                    }
                    className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#CBE5FA]/40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Предыдущая
                  </button>

                  <span className="text-xs font-medium text-black/60 tabular-nums">
                    {activeWorkIndex + 1} / {WORKS.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveWorkIndex((activeWorkIndex + 1) % WORKS.length)}
                    className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#CBE5FA]/40"
                  >
                    Следующая
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
