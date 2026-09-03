import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import type { AppRoute } from "../hooks/useAppRoute";

type AboutPageProps = {
  onNavigate: (route: AppRoute) => void;
};

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
};

const features = [
  ["01", "JPEG · PNG · WebP", "여러 장의 이미지를 한 번에 추가할 수 있습니다."],
  [
    "02",
    "FRAME ORDER",
    "사진을 드래그해서 GIF에 들어갈 순서를 바꿀 수 있습니다.",
  ],
  ["03", "TIMING", "프레임마다 원하는 재생 시간을 따로 설정할 수 있습니다."],
  ["04", "OUTPUT", "출력 크기와 반복 횟수, 이미지 맞춤 방식을 설정합니다."],
  [
    "05",
    "BACKGROUND",
    "이미지가 화면을 채우지 않을 때 사용할 배경색을 정합니다.",
  ],
  ["06", "MAKE GIF", "설정을 확인하고 브라우저에서 바로 GIF를 생성합니다."],
];

const steps = [
  [
    "01",
    "이미지를 추가합니다",
    "JPEG, PNG, WebP 이미지를 원하는 만큼 추가합니다.",
  ],
  [
    "02",
    "순서와 설정을 조정합니다",
    "프레임 순서와 재생 시간, 출력 크기와 반복 방식을 정합니다.",
  ],
  ["03", "GIF를 만듭니다", "완성된 결과를 미리 확인하고 바로 다운로드합니다."],
];

function RevealSection({ children, className = "" }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, y: 12 }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.18,
      }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.42,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-machine text-[11px] font-bold tracking-[0.14em] text-zinc-500">
      {children}
    </p>
  );
}

function InternalLink({
  href,
  onNavigate,
  children,
  className = "",
}: {
  href: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: ReactNode;
  className?: string;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  return (
    <a
      className={`cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132] ${className}`}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <main className="flex-1 overflow-hidden px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="border-t-2 border-zinc-950 pt-6 sm:pt-8">
          <motion.p
            className="font-machine text-[11px] font-bold tracking-[0.16em] text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.24,
            }}
          >
            ABOUT GIFCAM
          </motion.p>

          <motion.h1
            className="mt-5 max-w-4xl text-4xl font-bold leading-[0.96] tracking-tighter text-zinc-950 sm:text-6xl lg:text-7xl"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.42,
              ease: "easeOut",
              delay: reduceMotion ? 0 : 0.06,
            }}
          >
            TURN YOUR PHOTOS
            <br />
            INTO A GIF.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.34,
              ease: "easeOut",
              delay: reduceMotion ? 0 : 0.14,
            }}
          >
            GIFCAM은 여러 장의 이미지를 하나의 GIF로 만드는 브라우저 도구입니다.
            사진 순서, 재생 시간, 출력 크기와 반복 방식을 원하는 대로 조절할 수
            있습니다.
          </motion.p>

          <div className="mt-10 flex items-center gap-3 font-machine text-[11px] font-bold tracking-[0.12em] text-zinc-500">
            <span className="size-2 bg-[#a64132]" />
            SCROLL TO EXPLORE
          </div>
        </section>

        <div className="film-sprockets mt-16 h-3 sm:mt-24" aria-hidden="true" />

        <RevealSection className="grid gap-8 border-b-2 border-zinc-950 py-14 sm:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] sm:py-20">
          <div>
            <SectionLabel>01 / WHAT IT DOES</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
              필요한 것만
              <br />
              직접 조절합니다.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-600">
              이미지 순서부터 프레임 시간, 출력 크기까지 GIF를 만드는 데 필요한
              설정만 담았습니다.
            </p>
          </div>

          <ul className="divide-y divide-zinc-300 border-y border-zinc-300">
            {features.map(([index, title, description]) => (
              <motion.li
                key={index}
                className="grid grid-cols-[2.5rem_1fr] gap-3 py-4 sm:grid-cols-[3rem_1fr]"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: false,
                  amount: 0.5,
                }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.3,
                  ease: "easeOut",
                }}
              >
                <span className="font-machine text-xs font-bold text-zinc-500">
                  {index}
                </span>

                <div>
                  <h3 className="text-sm font-bold text-zinc-950">{title}</h3>

                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </RevealSection>

        <RevealSection className="border-b-2 border-zinc-950 py-14 sm:py-20">
          <SectionLabel>02 / HOW IT WORKS</SectionLabel>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950">
            이미지 추가부터 다운로드까지
            <br />세 단계면 충분합니다.
          </h2>

          <ol className="mt-10 grid border-t-2 border-zinc-950 sm:grid-cols-3">
            {steps.map(([index, title, description]) => (
              <motion.li
                key={index}
                className="border-b border-zinc-300 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: false,
                  amount: 0.45,
                }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.34,
                  ease: "easeOut",
                }}
              >
                <p className="font-machine text-xs font-bold text-zinc-500">
                  {index}
                </p>

                <h3 className="mt-5 text-lg font-bold text-zinc-950">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </motion.li>
            ))}
          </ol>
        </RevealSection>

        <RevealSection className="border-b-2 border-zinc-950 py-14 sm:py-20">
          <div className="bg-zinc-900 px-6 py-8 text-stone-100 sm:px-10 sm:py-12">
            <SectionLabel>03 / LOCAL PROCESSING</SectionLabel>

            <h2 className="mt-5 text-4xl font-bold leading-[0.94] tracking-[-0.04em] sm:text-6xl">
              YOUR PHOTOS
              <br />
              STAY ON YOUR DEVICE.
            </h2>

            <div className="mt-8 max-w-2xl space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
              <p>
                업로드한 이미지는 서버로 전송되지 않습니다. 이미지 해석, 크기
                조정, Canvas 처리와 GIF 생성은 모두 브라우저 안에서
                이루어집니다.
              </p>

              <p>
                로그인이나 계정도 필요하지 않습니다. 이미지를 올리고 설정한 뒤
                결과를 다운로드하면 됩니다.
              </p>
            </div>

            <div className="mt-8">
              <InternalLink
                href="/privacy"
                onNavigate={onNavigate}
                className="font-bold text-stone-100 underline underline-offset-4 transition hover:text-zinc-300"
              >
                자세한 개인정보 처리 방식
              </InternalLink>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="grid gap-8 border-b-2 border-zinc-950 py-14 sm:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] sm:py-20">
          <div>
            <SectionLabel>04 / WHY GIFCAM</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
              GIF를 만드는 데
              <br />
              필요한 만큼만.
            </h2>
          </div>

          <div className="max-w-2xl space-y-5 text-base leading-7 text-zinc-700">
            <p>
              GIFCAM은 복잡한 영상 편집기 대신 이미지로 GIF를 만드는 작업에
              집중합니다. 사진을 추가하고 순서와 시간을 정한 뒤 바로 결과를 만들
              수 있습니다.
            </p>

            <p>
              이미지에는 별도의 필터나 색 보정을 적용하지 않습니다. 사진의
              모습은 유지하고, 크기와 배치, 프레임 타이밍만 사용자가 정합니다.
            </p>

            <p>
              카메라와 필름을 닮은 화면은 사용 경험을 위한 디자인일 뿐입니다.
              실제 조작은 일반적인 웹 도구처럼 간단하게 사용할 수 있도록
              구성했습니다.
            </p>
          </div>
        </RevealSection>

        <RevealSection className="py-16 sm:py-24">
          <div className="border-b-2 border-zinc-950 py-12 text-center sm:py-16">
            <SectionLabel>05 / READY?</SectionLabel>

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              사진이 준비됐다면
              <br />
              바로 만들어보세요.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              이미지를 추가하고 순서와 시간을 정하면 GIFCAM이 브라우저에서 바로
              GIF를 만듭니다.
            </p>

            <div className="mt-9 flex justify-center">
              <InternalLink
                href="/"
                onNavigate={onNavigate}
                className="inline-flex min-w-56 items-center justify-center border-2 border-zinc-950 bg-zinc-950 px-8 py-4 text-base font-bold text-white transition duration-200 hover:-translate-y-1 hover:bg-white hover:text-zinc-950 active:translate-y-0"
              >
                GIF 만들기
              </InternalLink>
            </div>
          </div>
        </RevealSection>
      </div>
    </main>
  );
}
