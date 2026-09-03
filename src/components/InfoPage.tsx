import type { AppRoute } from '../hooks/useAppRoute'

type InfoPageProps = {
  page: 'privacy' | 'licenses'
  onNavigate: (route: AppRoute) => void
}

const LICENSE_NOTICE_URL = 'https://github.com/bakesia/gifcam/blob/main/THIRD_PARTY_LICENSES.md'

const licenseItems = [
  { name: 'gifski-wasm 2.2.0', license: 'AGPL-3.0-or-later', href: 'https://github.com/jamsinclair/gifski-wasm' },
  { name: 'gifski-lite 1.32.0', license: 'AGPL-3.0-or-later', href: 'https://github.com/jamsinclair/gifski-lite' },
  { name: 'gifski', license: 'AGPL-3.0-or-later', href: 'https://github.com/ImageOptim/gifski' },
  { name: 'wasm-feature-detect 1.6.1', license: 'Apache-2.0', href: 'https://github.com/GoogleChromeLabs/wasm-feature-detect' },
]

function BackToWorkspaceLink({ onNavigate }: Pick<InfoPageProps, 'onNavigate'>) {
  const handleNavigateHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate('/')
  }

  return <a className="inline-flex cursor-pointer font-bold text-zinc-900 underline underline-offset-4 transition hover:text-zinc-500 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" href="/" onClick={handleNavigateHome}>작업 화면으로 돌아가기</a>
}

function PrivacyInfo() {
  return (
    <>
      <p className="font-machine text-[11px] font-bold tracking-[0.14em] text-zinc-500">PRIVACY</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">사진은 기기 밖으로 전송되지 않습니다.</h1>
      <div className="mt-8 grid gap-5 text-base leading-7 text-zinc-700">
        <p>업로드한 이미지는 브라우저 안에서만 읽고 처리합니다. 이미지 decode, Canvas 처리, GIF 생성은 모두 사용자의 기기에서 진행됩니다.</p>
        <p>GIFCAM은 사진을 서버에 업로드하거나 보관하지 않습니다. 로그인, 계정, 서버 저장소도 사용하지 않습니다.</p>
        <p>페이지를 닫거나 작업을 초기화하면 브라우저 메모리에 있던 임시 이미지 및 GIF 데이터는 정리됩니다.</p>
      </div>
    </>
  )
}

function LicenseInfo() {
  return (
    <>
      <p className="font-machine text-[11px] font-bold tracking-[0.14em] text-zinc-500">LICENSES</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Third-party licenses</h1>
      <p className="mt-5 text-base leading-7 text-zinc-700">GIFCAM은 아래 오픈소스 구성 요소를 사용합니다. pngquant 계열 고지를 포함한 전체 내용은 공개 저장소의 라이선스 고지 문서에서 확인할 수 있습니다.</p>
      <ul className="mt-8 divide-y-2 divide-zinc-200 border-y-2 border-zinc-900">
        {licenseItems.map((item) => (
          <li key={item.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <a className="cursor-pointer font-bold text-zinc-900 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" href={item.href} target="_blank" rel="noreferrer">{item.name}</a>
            <span className="font-machine text-xs text-zinc-600">{item.license}</span>
          </li>
        ))}
      </ul>
      <a className="mt-6 inline-flex cursor-pointer font-bold text-zinc-900 underline underline-offset-4 transition hover:text-zinc-500 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" href={LICENSE_NOTICE_URL} target="_blank" rel="noreferrer">전체 third-party license notices 보기</a>
    </>
  )
}

export function InfoPage({ page, onNavigate }: InfoPageProps) {
  return (
    <main className="flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-3xl border-t-2 border-zinc-900 pt-6">
        {page === 'privacy' ? <PrivacyInfo /> : <LicenseInfo />}
        <div className="mt-10 border-t border-zinc-300 pt-5"><BackToWorkspaceLink onNavigate={onNavigate} /></div>
      </section>
    </main>
  )
}
