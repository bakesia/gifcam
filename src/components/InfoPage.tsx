import { useState } from "react";
import type { MouseEvent } from "react";
import type { AppRoute } from "../hooks/useAppRoute";

type ContentLanguage = "ko" | "en";

type InfoPageProps = {
  page: "privacy" | "licenses";
  onNavigate: (route: AppRoute) => void;
};

const LICENSE_NOTICE_URL =
  "https://github.com/bakesia/gifcam/blob/main/THIRD_PARTY_LICENSES.md";

const licenseItems = [
  {
    name: "gifski-wasm 2.2.0",
    license: "AGPL-3.0-or-later",
    href: "https://github.com/jamsinclair/gifski-wasm",
  },
  {
    name: "gifski-lite 1.32.0",
    license: "AGPL-3.0-or-later",
    href: "https://github.com/jamsinclair/gifski-lite",
  },
  {
    name: "gifski",
    license: "AGPL-3.0-or-later",
    href: "https://github.com/ImageOptim/gifski",
  },
  {
    name: "wasm-feature-detect 1.6.1",
    license: "Apache-2.0",
    href: "https://github.com/GoogleChromeLabs/wasm-feature-detect",
  },
];

function LanguageToggle({
  language,
  onChange,
}: {
  language: ContentLanguage;
  onChange: (language: ContentLanguage) => void;
}) {
  return (
    <div
      className="flex w-fit shrink-0 items-center border border-zinc-400 bg-white"
      aria-label="언어 선택"
    >
      <button
        type="button"
        className={`min-h-8 cursor-pointer px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#a64132] ${
          language === "ko"
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
        onClick={() => onChange("ko")}
        aria-pressed={language === "ko"}
        aria-label="한국어로 보기"
      >
        KO
      </button>

      <button
        type="button"
        className={`min-h-8 cursor-pointer border-l border-zinc-400 px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#a64132] ${
          language === "en"
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
        onClick={() => onChange("en")}
        aria-pressed={language === "en"}
        aria-label="View in English"
      >
        EN
      </button>
    </div>
  );
}

function InfoPageHeader({
  page,
  language,
  onLanguageChange,
}: {
  page: InfoPageProps["page"];
  language: ContentLanguage;
  onLanguageChange: (language: ContentLanguage) => void;
}) {
  const isKorean = language === "ko";

  const title =
    page === "privacy"
      ? isKorean
        ? "사진은 기기 밖으로 전송되지 않습니다."
        : "Your photos never leave your device."
      : isKorean
        ? "오픈소스 라이선스"
        : "Third-party licenses";

  const eyebrow = page === "privacy" ? "PRIVACY" : "LICENSES";

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="font-machine text-[11px] font-bold tracking-[0.14em] text-zinc-500">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
          {title}
        </h1>
      </div>

      <div className="ml-auto shrink-0">
        <LanguageToggle language={language} onChange={onLanguageChange} />
      </div>
    </div>
  );
}

function BackToWorkspaceLink({
  onNavigate,
  language,
}: Pick<InfoPageProps, "onNavigate"> & { language: ContentLanguage }) {
  const handleNavigateHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    onNavigate("/");
  };

  const label =
    language === "ko" ? "작업 화면으로 돌아가기" : "Back to workspace";

  return (
    <a
      className="inline-flex cursor-pointer font-bold text-zinc-900 underline underline-offset-4 transition hover:text-zinc-500 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
      href="/"
      onClick={handleNavigateHome}
    >
      {label}
    </a>
  );
}

function PrivacyInfo({ language }: { language: ContentLanguage }) {
  const isKorean = language === "ko";

  if (isKorean) {
    return (
      <div className="mt-8 grid gap-5 text-base leading-7 text-zinc-700">
        <p>
          업로드한 이미지는 브라우저 안에서만 처리합니다. 이미지 decode, Canvas
          처리와 GIF encoding, 생성된 GIF의 준비까지 모두 사용자의 기기에서
          진행됩니다.
        </p>

        <p>
          GIFCAM은 사진을 서버에 업로드하거나 보관하지 않습니다. 로그인이나 계정
          기능도 없습니다.
        </p>

        <p>
          현재 광고나 analytics는 사용하지 않습니다. 향후 이를 도입한다면 이
          개인정보 안내를 함께 갱신하겠습니다.
        </p>

        <p>
          페이지를 닫거나 작업을 초기화하면 브라우저 메모리에 있던 임시 이미지
          및 GIF 데이터는 정리됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 text-base leading-7 text-zinc-700">
      <p>
        Your images are processed locally in your browser. Image decoding,
        Canvas processing, GIF encoding, and the generated GIF all stay on your
        device.
      </p>

      <p>
        GIFCAM does not upload or store your photos on a server. No account or
        sign-in is required.
      </p>

      <p>
        GIFCAM currently does not use advertising or analytics. If either is
        introduced later, this privacy information will be updated.
      </p>

      <p>
        Temporary image and GIF data in browser memory is cleared when you close
        the page or reset your work.
      </p>
    </div>
  );
}

function LicenseInfo({ language }: { language: ContentLanguage }) {
  const isKorean = language === "ko";

  return (
    <>
      <div className="mt-8 text-base leading-7 text-zinc-700">
        <p>
          {isKorean
            ? "GIFCAM은 오픈소스 소프트웨어를 사용합니다. 아래는 주요 구성 요소이며, 전체 고지와 보존된 pngquant.c / libimagequant 계열 고지는 공개 저장소의 THIRD_PARTY_LICENSES.md에서 확인할 수 있습니다."
            : "GIFCAM uses open-source software. The entries below are the main components; the complete notices, including preserved pngquant.c / libimagequant notices, are available in THIRD_PARTY_LICENSES.md in the public repository."}
        </p>
      </div>

      <ul className="mt-8 divide-y-2 divide-zinc-200 border-y-2 border-zinc-900">
        {licenseItems.map((item) => (
          <li
            key={item.name}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <a
              className="cursor-pointer font-bold text-zinc-900 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>

            <span className="font-machine text-xs text-zinc-600">
              {item.license}
            </span>
          </li>
        ))}

        <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="font-bold text-zinc-900">
            pngquant.c / libimagequant
          </span>

          <span className="font-machine text-xs text-zinc-600">
            {isKorean ? "보존된 고지" : "Preserved notices"}
          </span>
        </li>
      </ul>

      <p className="mt-6 text-sm leading-6 text-zinc-600">
        {isKorean
          ? "GIFCAM 자체의 project-level license는 아직 별도 검토 대상이며, 이 페이지의 third-party notices가 이를 결정하지는 않습니다."
          : "GIFCAM’s project-level license remains subject to separate review. These third-party notices do not determine it."}
      </p>

      <a
        className="mt-6 inline-flex cursor-pointer font-bold text-zinc-900 underline underline-offset-4 transition hover:text-zinc-500 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
        href={LICENSE_NOTICE_URL}
        target="_blank"
        rel="noreferrer"
      >
        {isKorean
          ? "전체 third-party license notices 보기"
          : "View the complete third-party license notices"}
      </a>
    </>
  );
}

export function InfoPage({ page, onNavigate }: InfoPageProps) {
  const [language, setLanguage] = useState<ContentLanguage>("ko");

  return (
    <main className="flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-3xl border-t-2 border-zinc-900 pt-6">
        <InfoPageHeader
          page={page}
          language={language}
          onLanguageChange={setLanguage}
        />

        {page === "privacy" ? (
          <PrivacyInfo language={language} />
        ) : (
          <LicenseInfo language={language} />
        )}

        <div className="mt-10 border-t border-zinc-300 pt-5">
          <BackToWorkspaceLink onNavigate={onNavigate} language={language} />
        </div>
      </section>
    </main>
  );
}
