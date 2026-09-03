# GIFCAM

여러 장의 이미지를 브라우저에서 바로 GIF로 만드는 간단한 웹 도구입니다.

사진은 서버로 업로드되지 않으며, 이미지 처리와 GIF 생성은 모두 사용자의 브라우저에서 이루어집니다.

## Features

- JPEG / PNG / WebP 이미지 추가
- 프레임 순서 변경
- 프레임별 재생 시간 설정
- GIF 반복 횟수 설정
- 출력 크기 설정
- `contain` / `crop` 방식 선택
- 검정 / 흰색 배경 설정
- 브라우저 내 GIF 생성 및 다운로드
- Web Worker를 이용한 GIF 인코딩
- 별도의 로그인이나 서버 업로드 없음

## Privacy

업로드한 사진은 기기 밖으로 전송되지 않습니다.

이미지 decode, Canvas 처리, GIF encoding 및 결과 파일 생성은 모두 브라우저에서 수행됩니다.

자세한 내용은 서비스의 `Privacy` 페이지에서 확인할 수 있습니다.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion
- gifski-wasm
- Web Worker / OffscreenCanvas

## Development

```bash
npm install
npm run dev
```
