import { useEffect } from 'react'
import type { AppRoute } from './useAppRoute'

const pageMetadata: Record<AppRoute, { title: string; description: string }> = {
  '/': {
    title: 'GIFCAM - 사진으로 GIF 만들기',
    description: '여러 장의 사진을 브라우저에서 바로 GIF로 만들어보세요. 프레임 속도, 크기, 반복 횟수와 이미지 맞춤 방식을 설정할 수 있으며 사진은 기기 밖으로 전송되지 않습니다.',
  },
  '/privacy': {
    title: 'Privacy | GIFCAM',
    description: 'GIFCAM의 브라우저 내 이미지 처리 방식과 개인정보 보호 안내입니다.',
  },
  '/licenses': {
    title: 'Licenses | GIFCAM',
    description: 'GIFCAM에서 사용하는 오픈소스 소프트웨어와 라이선스 정보를 확인하세요.',
  },
}

export function useDocumentMetadata(route: AppRoute) {
  useEffect(() => {
    const metadata = pageMetadata[route]
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const routeUrl = new URL(route, canonical?.href ?? window.location.origin).toString()

    document.title = metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
    canonical?.setAttribute('href', routeUrl)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', routeUrl)
  }, [route])
}
